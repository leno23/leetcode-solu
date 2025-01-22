### 项目结构

Muti-repo or Mono-repo
前者 每个库有自己管理的仓库，逻辑清晰，相对应的，协同管理会更加繁琐
后者 可以方便的进行协同管理不同独立的库的生命周期，相对应的，会有更高的操作复杂度

### 包管理工具

pnpm

- 依赖管理安装快 不同依赖使用link连接
- 更规范(处理幽灵依赖问题)

全局安装pnpm

`npm i pnpm -g`

`pnpm init`

`mkdir pnpm-workspace.yaml`

### 开发规范

`pnpm i -D -w eslint`

> -w 依赖安装在根目录
> `npx eslint --init`

ERR_PNPM_ADDING_TO_ROOT  报错说明install时需要指明安装位置 -w

pnpm i -D -w @typescript-eslint/eslint-plugin, @typescript-eslint/parser

ERR_PNPM_SPEC_NOT_SUPPORTED_BY_ANY_RESOLVER  多个依赖安装不支持 逗号

```json
{
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	"parser": "@typescript-eslint/parser", // 使用什么解析器解析typescript代码
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": ["@typescript-eslint"],
	"rules": {}
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
};
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

## 三、初探reconciler

reonciler是React核心逻辑所在的模块，中文名叫协调器，协调(reconcile)就是diff算法的意思

### reconciler有什么用

jQuery工作原理--过程驱动

```
       调用            显示
jQuery --> 宿主环境API --> 真实UI
```

前端框架结构与工作原理--状态驱动

```
描述UI的方法                     核心模块
jsx            -------------> React -- reconciler    宿主环境API --> 真实UI
模板语法        -> 编译优化 -> Vue -- renderer
```

- 消费jsx
- 没有编译优化
- 开放通用的API供不同宿主环境使用

### 核心模块消费jsx的过程

#### 核心模块操作的数据结构是？

当前已知的数据结构：React Element
React Element如果作为核心模块操作的数据结构，存在的问题

- 无法表达节点之间的关系
- 字段有限，不好扩展(无法表达状态)

所以，需要一种新数据结构

- 介于React Element与真实UI节点之间
- 能够表达节点之间的关系
- 方便扩展(不仅作为数据存储单元，也能作为工作单元)

这就是**FiberNode**(**虚拟DOM**在React中的实现)

当前我们了解的数据结构

- jsx 开发者描述UI的结构
- React Element jsx执行结果
- FiberNode
- DOM element

#### reconciler的工作方式

对于同一个节点，比较其React Element与fiberNode，生成子fiberNode，并根据比较的结构生成不同的标记(插入、删除、移动...)，对应不同的 **宿主环境API的执行**

```
              比较                   产生
React element  --→  fiberNode       --→  各种标记
                        ↓
React element  --→   子fiberNode    --→  各种标记
                        ↓
                    孙fiber
```

当所有React Element比较完成后，会生成一课fiberNode树，一共会存在两课fibernode树
current: 与视图中真实UI对应的fiberNode树
workInProgress：触发更新后，正在reconciler中计算的fiberNode树(双缓冲技术)

#### jsx消费的顺序

以dfs的顺序遍历ReactElement树，这意味着

- 如果有子节点，遍历子节点
- 如果没有子节点，遍历兄弟节点

这是个递归过程，存在递、归两个阶段
递：对应commitWork
归：对应completeWork

## 四、如何触发更新

常见的触发更新的方式

- ReactDOM.createRoot().render
- this.setState
- useState的dispatch方法
  希望实现一套统一的更新机制，特点是
- 兼容上述触发更新的方式
- 方便后续扩展(优先级机制)

### 更新机制的组成部分

- 代表更新的数据结构 -- Update
- 消费Update的数据结构 -- UpdateQueue

```
_________________
| UpdateQueue
|   _____________
|  | sharedPening
|  |  __________
|  |  | Update |
|  |  ——————————
|  |  ——————————
|  |  | Update |
|  |  ——————————

```

接下来的工作：

- 实现mount时调用的API
- 将该API介入上述更新机制中

需要考虑的事情

- 更新可能发生于任意组件，而更新流程是从根节点递归的
- 需要一个统一的根节点保存通用信息

```
ReactDOM.createRoot(rootElement).render(<App/>)
      fiberRootNode
   current ↓↑ stateNode
      hostRootFiber
     child ↓↑ return
          App
```

## 五、初探mount流程

更新流程的目的：

- 生成wip fiberNode树
- 标记副作用flags

更新流程的步骤

- 递： beginWork
- 归 completeWork

### beginWork

对于如下结构的ReactElement

```html
<a>
	<b />
</a>
```

当进入A的beginWork时，通过比较B的current fiberNode与B ReactElement 生成B对应的wip fiberNode

在此过程中最多会标记2类【结构变化】相关的flags

- Placement
  插入： a->ab
  移动: abc -> bca
- ChildDeletion
  删除: ul>li*3 -> ul>li*1
  不包含与【属性变化】相关的flag: Update, 比如
  <img title="鸡"> -> <img title="你太美">

### 实现与Host相关节点的beginWork

首先，为开发环境增加**DEV**标识，方便Dev包打印更多信息

`pnpm i -D -w @rollup/plugin-replace`

HostRoot的beginWork的工作流程

- 1.计算状态的最新值
- 2.创造子FiberNode
  HostComponent的beginWork的工作流程
- 1.创造子FiberNode
  HostText没有beginWork工作流程(因为他没有子节点)

`<p>唱跳rap</p>`

### beginWork性能优化策略

考虑如下结构的reactElement

```html
<div>
	<p>练习时长</p>
	<span>两年半</span>
</div>
```

理论上mount流程完毕后包含的flags

- 两年半 Placement
- span Placement
- 练习时长 Placement
- p Placement
- div Placement
  相比于执行5次Placement，我们可以构建好【离屏DOM树】后，对div执行1次Pplacement操作

### completeWork

需要解决的问题

- 对于Host类型fiberNode 构建离屏DOM树
- 标记Update flag

### completeWork性能优化策略

flags分布在不同fiberNode中，如何快速找到他们？
答案：利用completeWork向上遍历(归)流程，将子fiberNode的flags冒泡到付fiberNode

## 六、初探ReactDom

react内部的三个阶段

- schedule阶段
- render阶段
- commit阶段

### commit阶段的三个子阶段

- beforeMutation
- mutation
- layout

### 当前commit阶段要执行的任务

- 1.fiber树的切换
- 2.执行Placement对应操作

需要注意的问题，考虑如下jsx，如果span中含有flag，该如何找到他
`<App>
    <div>
        <span>只因</span>
    </div>
</App>`

### 打包ReactDom

需要注意

- 兼容原版React的导出
- 处理HostConfig的指向

## 七、初探FC与实现 第二种调试方式

FunctionComponent需要考虑的问题

- 如何支持FC beginWork completeWork
- 如何组织Hooks

### 如何支持FC

FC的工作同样植根于

- beginWork
- completeWork

### 第二种调试方式

采用Vite的实时调试，他的好处是【实时看到源码运行效果】

第三种调试方式
`pnpm install -D -w jest jest-config jest-environment-jsdom`
jest-config jest的官方默认配置
jest-environmenttype-jsdom 调试DOM环境

## 八、实现useState

hook脱离FC上下文，仅仅是普通函数，如何让他拥有感知上下文环境的能力

- hook如何知道在另外一个hook的上下文环境内执行

```jsx
function App() {
	useEffect(() => {
		useState(0);
	});
}
```

- hook怎么知道当前是mount还是update
  解决方案：在不同上下文中调用的hook不是同一个函数

```
Reconciler                                            内部数据共享层
 mount时 useState useEffect...集合          →
 update时 useState useEffect...集合          →    当前使用的hooks集合  ---> React
 hook上下文中时 useState useEffect...集合    →
```

实现【内部数据共享层】时的注意事项
以浏览器为例，Reconciler+hostConfig = ReactDOM

增加【内部数据共享层】，意味着Reconciler和React产生关联，进而意味着ReactDOM与React产生关联。

如果两个包【产生关联】，在打包时需要考虑：
两者的代码是打包在一起还是分开？

如果打包在一起，意味着打包后的ReactDOM中会包含React的代码，那么ReactDOM中会包含一个内部数据共享层，React中会包含一个内部数据共享层，这两者不是同一个内部数据共享层。

而我们希望两者共享数据，所以不希望ReactDOM中会包含React的代码

- hook如何知道自身数据保存在哪

```js
function App() {
	// 执行useState为什么返回正确
	const [num] = useState(0);
}
```

答案：可以记录当前正在render的FC对应的fiberNode，在fiberNode中保存hook数据

### 实现Hooks的数据结构

fiberNode中可用的字段

- memoizedState
- updateQueue

```
FC fiberNode
memoizedState  →    useState  → hook数据
                         ↓
                      useEffect
                         ↓
                      useState
```

对于FC 对应的fiberNode，存在两层数据

- fiberNode.memoizedState对应Hooks链表
- 链表中每个hook对应自身的数据

### 实现useState

包括两个方面

- 实现mount时useState的实现
- 实现dispatch方法，并接入现有更新流程内

## 九、ReactElement的测试用例

本节课将实现第三种调试方式--用例调试

- 实现第一个测试工具-test-utils
- 实现测试环境
- 实现ReactElement用例
  与测试相关的代码都来自React仓库，可以把React仓库下载下来
  `git clone xxx`

### 实现test-utils

这是用于测试的工具集，来源于ReactTestUtils.js， 特点是使用ReactDOM作为宿主环境

### 实现测试环境

`pnpm i -D -w jest jest-config jest-environment-jsdom`
配置:

```js
const { defaults } = require('jest-config');
module.exports = {
	...defaults,
	rootDir: process.cwd(),
	modulePathIgnorePatterns: ['<rootDir>/.history'],
	// import React from 'react'  react从哪里进行解析
	moduleDirectories: ['dist/nodu_modules', ...defaults.moduleDirectories],
	testEnvironment: 'jsdom'
};
```

### 实现ReactElement用例

来源自ReactElement-test.js
为jest增加JSX解析能力，安装Babel
`pnpm i -D -w @babel/core @babel/prest-env @babel/plugin-transform-react-jsx`
新增babel.config.js

```js
module.exports = {
	presets: ['@babel/preset-env'],
	plugins: [['@babel/plugin-transform-react-jsx', { throwIfNamespace: false }]]
};
```

## 10、初探update流程

update流程和mount流程的区别

- 对于beginWork
  需要处理ChildDeletion的情况
  需要处理节点移动的情况(abc->bca)

- 对于completeWork
  需要处理HostText内容更新的情况
  需要处理HostComponent属性变化的情况

- 对于commitWork
  - 对于childDeletion，需要遍历被删除的子树
- 对于useState
  - 实现相对于mountState的updateState

### beginWork流程

本节课仅处理单一节点，所以省去了【节点移动】的情况，我们需要处理

- singleElement
- singleTextNode 1.处理流程为1.比较是否可以复用current fiber

  - 比较key 如果key不同 不复用
  - 比较type 如果type不同 不复用
  - 如果都相同 复用current fiber

    2.如果不复用current fiber 则创建新的fiberNode，可以复用则复用旧的

注意：对于同一个fiberNode即使反复更新，current、wip这两个fiberNode会重复使用

### completeWork流程

主要处理[标记Update]的情况，本节课我们处理HostText内容更新的情况

### commitWork流程

对于标记ChildDeletion的子树

- 对于FC，需要处理useEffect unmount执行，解绑ref
- 对于HostComponnet，需要解绑ref
- 对于字数的 跟HostComponent，需要移除DOM
  所以，需要实现[遍历ChildDeletion子树]的流程

### 对于useState

需要实现

- 针对update的dispatcher
- 实现对标mountWorkInProgressHook的updateWorkInProgressHook
- 实现updateState中[计算新state的逻辑]
  其中updateWorkInProgressHook的实现需要考虑的问题：
- hook数据从哪里来
- 交互阶段触发的更新
  `<div onClick={() => {update()}}></div>`
- render阶段触发的更新

```js
function App() {
	const [num, update] = useState(0);
	// 触发更新
	update(100);
	return <div>{num}</div>;
}
```

## 11、实现事件系统

事件系统本质上是植根于浏览器事件模型，所以他隶属于ReactDOM，在实现时要做到对Reconciler 0侵入
实现事件系统需要考虑：

- 模拟实现浏览器事件捕获、冒泡流程
- 实现合成事件对象
- 方便后续扩展

### 实现ReactDOM与Reconciler对接

将事件回调保存在DOM中，通过以下两个时机对接

- 创建DOM时
- 更新属性时

### 模拟实现浏览器事件流程

事件系统.drawio
需要注意

- 基于事件对象实现合成事件，以满足自定需求(比如:阻止事件传递)
- 方便后续扩展优先级机制

## 12、实现Diff算法

当前仅实现单一节点的增删操作，即【单节点Diff算法】，本节课实现多节点Diff算法

本节课采用简写实例: A1-> A2 type:A key:1 --> type:A key:2

### 对于reconcileSingleElement的改动

当前支持的情况

- A1->B1 type变化
- A1->A2 key变化

需要支持的情况

- ABC->A
  **【单\多节点】是指【更新后是单\多节点】**

更细致的，我们需要区分4种情况

- key相同，type相同==复用当前节点
  例如: A1B2C3->A1
- key相同，type不同==不存在任何复用的可能性
  例如：A1B2C3->B1
- key不同，type相同==当前节点不能复用
- key不同，type不同--当前节点不能复用

### 对于reconcileSingleTextNode的改动

类似reconcileSingleElement

### 对于同级多节点Diff的支持

单节点需要支持的情况

- 插入Placement
- 删除ChildDeletion

多节点需要支持的情况

- 插入Placement
- 移除ChildDeletion
- 移动Placement

整体流程分为4步

- 将current中所有同级fiber保存在Map中
- 遍历newChild数组，对于每个遍历到的element，存在两种情况
  - 在Map中存在对应current fiber，且可以复用
  - 在Map中不存在对应的current fiber，或不能复用
- 判断是插入还是删除
- 最后Map中剩下的都标记删除

### 步骤2 -- 是否复用 详解

首先，根据key从Map中获取current fiber，如果不存在current fiber，则没有复用的可能

接下来，分情况讨论

- element是HostText，current fiber是吗？
- element是其他ReactElement，current fiber是吗
- TODO element是数组组成Fragment，current fiber是吗

```html
<ul>
  <li/>
  <li/>
  {[<li/>,<li/>]}
</ul>


<ul>
  <li/>
  <li/>
  <>
    <li/>
    <li/>
  </>
</ul>
```

### 步骤3--插入/移动判断 详解

【移动】具体是指向右移动
移动的判断依据是 element的index与【element对应的current fiber】index的比较

A1B2C3 -> B2C3A1
0 1 2 0 1 2
当遍历element时，【当前遍历的element】一定是【所有已遍历的element】中最靠右的那个
所以只需要记录最后一个可复用fiber在current中的index(lastPlaceIndex),在接下来的遍历中

- 如果接下来遍历到可复用fiber的index<lastPlaceIndex,则标记Placement
- 否则，不标记

### 移动操作的执行

Placement同时对应

- 移动
- 插入
  对于插入操作，之前对应的DOM方法是parentNode.appendChild，现在为了实现移动操作，需要支持parentNode.insertBefore
  parentNode.insertBefore需要找到【目标兄弟】要考虑两个因素

## 13、实现Fragment

为了提高组件结构的灵活性，需要实现Fragment，具体来说，需要区分几种情况

### 1.Fragment包裹其他组件

```html
<>
<div></div>
<div></div>
</>
<!-- 对应DOM -->
<div></div>
<div></div>
```

这种情况的jsx转换结果

```js
jsxs(Fragment, {
	children: [jsx('div', {}), jsx('div', {})]
});
```

type为Fragment的ReactElement，对单一节点的Diff需要考虑Fragment的情况

### Fragment与其他组件同级

```html
<ul>
  <>
    <li>1</li>
    <li>2</li>
  </>
    <li>3</li>
    <li>4</li>
</ul>
<!-- 对应DOM -->
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
</ul>
```

这种情况的jsx转换结果

```js
jsxs('ul', {
	children: [
		jsxs(Fragment, {
			children: [
				jsx('li', {
					children: '1'
				}),
				jsx('li', {
					children: '2'
				})
			]
		}),
		jsx('li', { children: '3' }),
		jsx('li', { children: '4' })
	]
});
```

children为数组类型，则进入reconcileChildrenArray方法,
数组中的某一项为Fragment，所以需要增加【type为Fragment的ReactElement的判断】，同时beginWork中需要增加Fragment类型的判断

### 数组形式的Fragment

```html
<!-- arr = [<li>c</li>,<li>d</li>] -->
<ul>
	<li>a</li>
	<li>b</li>
	{arr}
</ul>
<!-- 对应DOM -->
<ul>
	<li>a</li>
	<li>b</li>
	<li>c</li>
	<li>d</li>
</ul>
```

jsx转换结果是

```js
jsxs('ul', {
	children: [
		jsx('li', {
			children: 'a'
		}),
		jsx('li', {
			children: 'b'
		}),
		arr
	]
});
```

children为数组，则进入recondileChildrenArray方法，
数组的某一项为数组，所以需要增加【reconcileCHildrenArray中数组类型的判断】

### Fragment对childDeletion的影响

childDeletion删除DOM的逻辑

- 找到子树的根Host节点
- 找到子树对应的父级Host节点
- 从父级Host中删除子树根Host节点
  考虑删除p节点的情况

```html
<div>
	<p>xxxxx</p>
</div>
```

考虑删除Fragment后，子树的根Host节点可能存在多个

```html
<div>
  <>
    <p>xxx</p>
    <p>yyy</p>
  </>
</div>
```

### 对React的影响

React包需要导入Fragment，用于jsx转换引入Fragment类型

## 14、实现同步调度流程

更新到底是同步还是异步

```js
class App extends React.Component {
	onClick() {
		this.setState({ a: 1 });
		console.log(this.state.a);
	}
	//
}
```

当前的现状

- 从触发更新到render，再到commit到时同步的
- 多次触发更新会重复多次更新流程

可以改进的地方：多次触发更新，只进行一次更新流程【Batch updates(批处理)】： 多次触发更新，只进行一次更新流程

将多次更新合并为一次，理念上有点类似防抖、节流，我们需要考虑合并的时机是：

- 宏任务
- 微任务
  用三款框架实现Batched Updates，打印结果不同
- React
- Vue3
- Svelte

结论：React批处理的时机既有宏任务也有微任务

本节课我们实现【微任务的批处理】

### 新增调度阶段

既然我们需要【多次触发更新，只进行一次更新流程】，意味着我们要将更新合并，所以在：

- render阶段
- commit阶段
  的基础上增加schedule阶段(调度阶段)

```
触发更新
dispatchSetState
updateContainer  -> scheduleUpdateOnFiber -> renderRoot -> commitRoot
                        ↓                       ↑
                             → 调度流程  →
```

### 对Update的调整

【多次触发更新，只进行一次更新流程】中【多次触发更新】意味着对于同一个fiber，会创建多个update

```

```

【多次触发更新，只进行一次更新流程】，意味着要达成三个目标

- 需要实现一套优先级机制，每个更新都拥有优先级
- 需要能够合并一个宏任务/微任务中触发的所有更新
- 需要一套算法，用于决定哪个优先级优先进入render阶段

```
之前
触发更新  ...   触发更新
  ↓               ↓
render阶段     render阶段

之后
  schedule阶段
    一个宏任务/微任务
      触发更新  触发更新 触发更新
      某种判断机制
            |
            ↓   选出一个优先级
          render阶段
```

### 实现目标1： Lane模型

包括：

- lane 二进制位，代表优先级
- lanes 二进制位，代表lane的集合
  其中
- lane作为update的优先级
- lanes作为lane的集合

### lane的产生

对于不同情况触发的更新，产生Lane，为后续不同事件产生不同优先级更新做准备

如何知道那些Lane被消费，还剩哪些Lane没有消费？

### 对FiberRootNode的改造

需要增加如下字段

- 代表所有未被消费的Lane的集合
- 代表本次更新消费的Lane

```
触发更新 -> update  拥有一个Lane
            ↓         ↓ 记录
  ——————→  schedule  ------->  fiberRootNode
  |         ↓                         ↑
  |        render阶段  选出一个lane ----
  |        ↓                          |
  |-----  commit阶段    ---------------
```

### 实现目标2、3

需要完成两件事

- 实现【某些判断机制，选出一个lane】
- 实现类似防抖、节流的效果，合并宏/微任务中触发的更新

### render阶段的改造

processUpdateQueue方法消费update时需要考虑

- lane的因素
- update现在是一条链表，需要遍历

### commit阶段的改造

移除【本地更新被消费的Lane】

## 实现useEffect

实现useEffect需要考虑的

- effect数据结构

```
fiber.memoizedState = useEffect --> useState               useEffect
                        |              |                    |
                      memoizedState   memoizedState     memoizedState
                      next            next    -->       next
                      updateQuque     updateQueue       updateQueue
                      ...             ...               ...
```

- effect的工作流程如何接入到现有流程
  什么是effect

```

function App(){
  useEffect(() => {
    return () => {

    }
  },[x],[y])
  useLayoutEffect(() => {})
  useEffect(() => {},[])
}
```

数据结构需要考虑

- 不同effect可以同一个机制
  - useEffect 依赖变化以后的当前commit阶段完成后 异步执行
  - useLayoutEffect commit完成后 同步执行
  - useInsertionEffect 拿不到dom引用，一般给cssinjs库使用
- 需要能保存依赖
- 需要能保存create回调
- 需要能保存destory回调
- 需要能够区分是否需要触发create回调
  - mount时
  - 依赖变化时

```js
const effect = {
	tag,
	create,
	destory,
	deps,
	next
};
```

注意区分本节课中新增的3个flags

- 对于fiber，新增PassiveEffect，代表【当前fiber本次更新存在副作用】
- 对于effect hook、Passive代表【useEffect对应的effect】
- 对于effect hook、HookHasEffect代表【当前effect本次更新存在副作用】

```
fiberNode                            fiber  -> PassiveEffect
useEffect  -> Passive                useEffect  Passive
useState                             useState
useLayoutEffect    --> layout        useLayoutEffect --> Passive | HookHasEffect
```

- 为了方便使用，最好和其他effect连接成链表render时重置effect链表

```
fiber.memoizedState = useEffect -->         useState                 useEffect
                        |          =>next        |          =>next       |
                      memoizedState         memoizedState            memoizedState
                      next                  next    -->              next
                      updateQuque           updateQueue              updateQueue
                      ...                   ...                      ...
```

### effect的工作原理

```
render阶段
FC FiberNoe    存在副作用
    ↓
commit阶段
  清理副作用
  收集回调

    ↓
  执行副作用
```

## 实现noop-renderer

到目前为止我们实现的效果

- 核心模块：Reconciler
- 公共方法：React
- 浏览器宿主环境：ReactDOM
  当前项目的问题：测试用例太单薄，无法照顾到项目的边界情况，但课程时长有限，无法覆盖所有用例
  解决办法：构建成熟的React测试环境，实现测试工具，学员按需跑通用例

为了测试Reconciler，我们需要构建【宿主环境无关的渲染器】，这就是react-noop-renderer
以下是实用noop-renderer的一个用例

```js
let React;
let ReactDOM;
let Scheduler;
let act;
let useEffect;

describe('ReactHooksWithNoopRenderer', () => {
	beforeEach(() => {
		jest.resetModules();
		jest.useFakeTimers();

		React = require('react');
		act = require('jest-react').act;

		Scheduler = require('scheduler');
		ReactNoop = require('react-noop-renderer');

		useEffect = React.useEffect;
	});

	test('passive unmount on deletion are fired in parent', () => {
    const root = ReactNoop.createRoot()
    function Parent(){
      useEffect(() => {
        return () => Scheduler.unstable_yieldValue('Unmount parent');
      });
      return <Child />;

    }
    function Child(){
      useEffect(() => {
        return () => {
          Scheduler.unstable_yieldValue('Unmount child')
        }
      })
      return 'Child'
    }
    await act(saync () => {
      root.render(<Parent />)
    })

    expect(root).toMatchRenderedOutput('Child')
    await act(async () => {
      root.render(null)
    })
    expect(Scheduler).toHaveYielded('Unmount parent')
	});
});
```

```js
function App() {
	return (
		<>
			<Child />
			<div>hello world</div>
		</>
	);
}

function Child() {
	return 'Child';
}
```

经由Noop-Renderer渲染后得到树状结构如下

```json
{
	"rootID": 0,
	"children": [
		{
			"text": "Child",
			"id": 0,
			"parent": 0
		},
		{
			"id": 2,
			"type": "div",
			"children": [
				{
					"text": "hello world",
					"id": 1,
					"parent": "2"
				}
			],
			"parentId": 0,
			"props": {
				"children": "hello world"
			}
		}
	]
}
```

## 完善Reconciler测试环境

需要思考的问题：如何在并发环境测试运行结果？比如：

- 如何控制异步执行的时间？ 使用mock timer
- 如何记录并发情况下预期的执行顺序

### 完善并发测试环境

安装并发的测试上下文环境

```
pnpm i -w jest-react
```

### 安装matchers

reactTestMatchers.js

### 当前我们为测试做的准备

- 针对ReactDOM宿主环境： ReactTestUtils
- 针对Reconsiler的测试： React-Noop-Renderer
- 针对并发环境的测试：jest-react,Scheduler,React-Noop-Renderer配合使用

## 并发更新的原理

本节课对标《React设计原理》 5.1节
思考问题：我们当前的实现是如何驱动的1.交互触发更新2.调度阶段微任务调度（ensureRootIsScheduled方法）3.微任务调度结束，进入render阶段
4.render阶段结束，进入commit阶段
5.commit阶段结束，调度阶段微任务调度（ensureRootIsScheduled）
整体是个大的任务循环，循环的驱动力是【微任务调度模块】

### 同步示例

              插入work     workList
    交互       ---→   [work1  work2 ...] ---   取出work
               ---→  scheduler          ←--
    执行完，   |        ↓调度出work，交给perform
    继续调度    ----  perform

示例在两种情况喜爱会造成阻塞

- work.count数量太多
- 单个work.count工作量太大

并发更新的理论基础
并发更新的基础是【时间切片】

### 改造示例

如果我们想在宏任务中完成任务调度，本质上是个大的宏任务循环，循环的驱动力是Scheduler

> > 理论基础参考《React设计原理》
> > 在微任务调度中，没有[优先级]的概念，对于Scheduler存在5中优先级

- ImmeduatePriority
- UserBlockingPriority
- NormalPriority
- LowPriority
- IdlePriority

需要考虑的情况

### 工作过程仅有一个work

如果仅有一个work，scheduler有个优化路径：如果调度的回调函数的返回是函数，则会继续调度返回的函数

### 工作过程中产生相同优先级的work

如果优先级相同，则不需要开启新的调度

### 工作过程中产生更低/高优先级的work

把握一个原则，我们每次选出的都是优先级最高的work

## 实现并发更新

要实现并发更新，需要做的改动包括

- Lane模型增加更多优先级
- 交互与优先级对应
- 调度阶段引入Scheduler，新增调度策略逻辑
- render阶段可中断
- 根据update计算state的算法需要修改

### 拓展交互

思考一个问题，优先级从何而来
答案：不同交互对应不同优先级
可以根据【触发更新的上下文环境】赋予不同优先级，比如：

- 点击事件需要同步处理
- 滚动事件优先级再低点
- 。。。
  更进一步，还能推广到任何【可以触发更新的上下文环境】比如：
- useEffect create回调中触发更新的优先级
- 首屏渲染的优先级

下一个问题：这些优先级的改动如何影响更新？
答案：只要优先级能影响update，就能影响更新。
当前我们掌握的与优先级相关的信息，包括

- Scheduler的5种优先级
- React中的lane模型
  也就是说，运行流程在React时，使用的是Lane模型，运行流程在Scheduler时，使用的是优先级，所以需要实现两者的转换
- lanesToSchedulerPriority
- schedulerPriorityToLane

### 扩展调度阶段

主要是在同步更新（微任务调度）的基础上扩展并发更新(Scheduler调度)，主要包括

- 将Demo中的调度策略移到项目中
- render阶段变为【可中断】
  梳理两种典型场景
- 时间切片
- 高优先级更新打断低优先级更新

### 扩展state计算机制

扩展【根据lane对应update计算state】的机制，主要包括

- 通过update计算state时可以跳过【优先级不够的update】
- 由于【高优先级任务打断低优先级任务】，同一个组件中【根据update计算state】的流程可能会多次执行，所以需要保存update

### 跳过update需要考虑的问题

如何比较【优先级是否足够】？
lane数值大小的直接比较不够灵活
如何同时兼顾【update的连续性】与【update的优先级】

```js
// u0
{
  action: num => num + 1,
  lane: DefaultLane
}

// u1
{
  action: 1,
  lane: SyncLane
}
// u2
{
  action: num => num + 10,
  lane: DefaultLane
}

// state = 0; updateLane = DefaultLane
// 只考虑优先级情况下的结果 11
// 只考虑连续性情况下的结果 13


```

新增baseStaet、baseQueue字段

- baseState是本地更新参与计算的初始state，memoizedState是上次更新计算最终state
- 如果本地更新没有update被跳过，则下次更新开始时baseState===memoizedState
- 如果本地更新有update被跳过，则本地更新计算出的memoizedState为【考虑优先级】情况下计算的结果，baseState为【最后一个没有被跳过的update计算后的等结果】，下次更新开始时baseState !== memoizedState
- 本次更新【被跳过的update及其后面的所有update】都会被保存在baseQueue中参与下次state计算
- 本地更新【参与计算但保存在baseQueue中的update】，优先级会降低到NoLane

```js
// u0
{
  action: num => num + 1,
  lane: DefaultLane
}

// u1
{
  action: 1,
  lane: SyncLane
}
// u2
{
  action: num => num + 10,
  lane: DefaultLane
}

第一次render
baseState=0 memoizedState=0
baseQueue = null updateLane =Default
第一次render 第一次计算
baseState=1 memoizedState=1
baseQueue - null
第一次render 第二次计算
baseState=1 memoizedState=1
baseQueue - u1
第一次render 第三次计算
baseState=1 memoizedState=11
baseQueue - u1 -> u2(NoLane)

第二次render
baseState=1 memoizedState=11
baseQueue=u1 -> u2(NoLane) updateLane=SyncLane
第二次render 第一次计算
baseState=1 memoizedState=3
第二次render 第二次计算
baseState=13 memoizedState=13



```

### 保存update的问题

考虑将update保存到current中，只要不进入commit阶段，current与wip不会互换，所以保存在current中，即使多次执行render阶段，，只要不进入commit阶段，都能从current中恢复数据

### 课后思考

TODO 扩展renderLane的灵活性 将其扩展为renderLanes 更好利用Lanes这一数据结构能够表示多种lane的集合的能力
