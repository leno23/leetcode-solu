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
```