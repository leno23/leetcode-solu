import { foo } from './utils'
foo()
// /*#__PURE__*/ foo() // 调用不会产生副作用，可以放心移除

// rollup input.js -f esm -o boundle.js 
