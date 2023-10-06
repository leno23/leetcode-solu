### 项目结构

Muti-repo or Mono-repo
前者 每个库有自己管理的仓库，逻辑清晰，相对应的，协同管理会更加繁琐
后者 可以方便的进行协同管理不同独立的库的生命周期，相对应的，会有更高的操作复杂度

### 包管理工具
pnpm 
- 依赖管理安装快 不同依赖使用link连接
- 更规范(处理幽灵依赖问题)

全局安装pnpm

` npm i pnpm -g `

`pnpm init`

`mkdir pnpm-workspace.yaml`

### 开发规范
`pnpm i -D -w eslint`
> -w 依赖安装在根目录
`npx eslint --init`

 ERR_PNPM_ADDING_TO_ROOT  报错说明install时需要指明安装位置 -w

pnpm i -D -w @typescript-eslint/eslint-plugin, @typescript-eslint/parser
 
ERR_PNPM_SPEC_NOT_SUPPORTED_BY_ANY_RESOLVER  多个依赖安装不支持 逗号

```json
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser", // 使用什么解析器解析typescript代码
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```
将prettier集成到eslint中
eslint-config-prettier 覆盖eslint本身的规则配置
eslint-plugin-prettier 用prettier来接管修复代码即 eslint --fix

### 规范检查
安装husky，用于拦截commit命令
`pnpm i husky -D -w`

初始化husky
`npx husky install`

将刚才实现的格式化命令pnpm lint纳入commit时husky将执行的脚本
`npx husky add .husky/pre-commit "pnpm lint"`
> todo: pnpm lint会对代码进行全量检查，当项目复杂后执行速度比较慢，届时可以考虑用lint-staged，实现只对暂存区代码进行检查

通过commitlint对git提交信息进行检查，首先安装必要的库
`pnpm i commitlint @commitlint/cli`

新建配置文件 .commitlintrc.js
```js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

集成到husky中
`npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"`

commitlint规范意义
`<type>: <subject>`
常见type值包括如下
feat: 添加新功能
fix: 修复Bug
chore: 一些不影响功能的更改
docs: 文档的修改
pref: 性能方面的修改
refactor: 代码重构
test: 添加一些测试代码

### 调试
dist/node_modules/react pnpm link --global 将react链接到全局
react-demo 使项目中的react使用全局的react

prod和dev环境react的jsx参数有所不同，需要区分

### 如何触发更新
常见的触发更新的方式
- ReactDom.createRoot().render 或老版的ReactDOM.render
- this.setState
- useState的dispatch方法
我们希望实现一套统一的更新机制，他的特点是
- 兼容删除触发更新的方式
- 方便后续扩展(优先级机制)
### 更新机制机制的组成部分
- 代表更新的数据结构 Update
- 消费update的数据结构 UpdateQueue
[update](/project/mini-react/packages/react-reconciler/src/update.drawio)

接下来的工作包括
- 实现mount时调用的API
- 将该API接入上述更新机制中
需要考虑的事情
- 更新可能发生在任意组件，而更新流程是从根节点递归的
- 需要一个统一的根节点保存通用信息

初探mount流程
更新流程的目的：
- 生成wip fiberNode树
- 标记副作用flags
更新流程的步骤
- 递： beginWork
- 归  completeWork

beginWork
对于如下结构的reactElement
```html
<A>
    <B/>
</A>
```
当进入A的beginWork时，通过比较B的current fiberNode与B ReactElement 生成B对应的wip fiberNode
在此过程中最多会标记2类【结构变化】相关的flags
- Placement
插入： a->ab 
移动: abc -> bca
- ChildDeletion
删除: ul>li*3 -> ul>li*1
不包含与【属性变化】相关的flag: Update, 比如
<img title="鸡"> ->  <img title="你太美"> 

### 实现与Host相关节点的beginWork
首先，为开发环境增加__DEV__标识，方便Dev包打印更多信息
`pnpm i -D -w @rollup/plugin-replace`
HostRoot的beginWork的工作流程
1.计算状态的最新值
2.创造子FiberNode
HostComponent的beginWork的工作流程
1.创造子FiberNode
HostText没有beginWork工作流程(因为他没有子节点)
`<p>唱跳rap</p>`
beginWork性能优化策略
考虑如下结构的reactElement
`
<div>
    <p>练习时长</p>
    <span>两年半</span>
</div>
`
理论上mount流程完毕后包含的flags
- 两年半 Placement
- span Placement
- 练习时长 Placement
- p Placement
- div Placement
  相比于执行5次Placement，我们可以构建好【离屏DOM树】后，对div执行1次Pplacement操作

completeWork
解决的问题
- 对于Host类型fiberNode 构建离屏DOM树
- 标记Update flag
completeWork性能优化策略
flags分布在不同fiberNode中，如何快速找打他们
答案：利用completeWork向上遍历(归)流程，将子fiberNode的flags冒泡到付fiberNode


### 初探ReactDom
react内部的三个阶段
- schedule阶段
- render阶段
- commit阶段

commit阶段的三个子阶段
- beforeMutation
- mutation
- layout
当前commit阶段要执行的任务
1.fiber树的切换 
2.执行Placement对应操作

需要注意的问题，考虑如下jsx，如果span中含有flag，该如何找到他
`
<App>
    <div>
        <span>只因</span>
    </div>
</App>
`

打包ReactDom
需要注意
- 兼容原版React的导出
- 处理HostConfig的指向