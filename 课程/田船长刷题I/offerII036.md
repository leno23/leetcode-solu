剑指 Offer II 036. 后缀表达式

根据 逆波兰表示法，求该后缀表达式的计算结果。

有效的算符包括 +、-、*、/ 。每个运算对象可以是整数，也可以是另一个逆波兰表达式。

 

说明：

整数除法只保留整数部分。
给定逆波兰表达式总是有效的。换句话说，表达式总会得出有效数值且不存在除数为 0 的情况。
 

示例 1：

输入：tokens = ["2","1","+","3","*"]
输出：9
解释：该算式转化为常见的中缀算术表达式为：((2 + 1) * 3) = 9
```js
var evalRPN = function (tokens) {
    let st = []
    const calc = (a, b, op) => {
        if (op == '+') return +a + +b
        if (op == '-') return a - b
        if (op == '*') return a * b
        if (op == '/') return a / b | 0
    }
    for (let x of tokens) {
        if (!isNaN(+x)) {
            st.push(x)
        } else {
            let a = st.pop(), b = st.pop()
            let r = calc(b, a, x)
            st.push(r)
        }
    }
    return st[0]
};