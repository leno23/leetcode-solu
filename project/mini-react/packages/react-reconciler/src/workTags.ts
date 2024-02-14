
// 当前FiberNode的类型
export type WorkTag = typeof FunctionComponent | typeof HostRoot | typeof HostComponent | typeof HostText
export const FunctionComponent = 0
// 项目挂载的dom节点对应的fiber
export const HostRoot = 3;

// 组件类型
export const HostComponent = 5;

// 文本节点
export const HostText = 6;