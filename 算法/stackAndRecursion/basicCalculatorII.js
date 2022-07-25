/*
  227. 基本计算器 II

  给你一个字符串表达式 s ，请你实现一个基本计算器来计算并返回它的值。
  整数除法仅保留整数部分。
  
*/
/**
 * @param {string} s
 * @return {number}
 */
var calculate = function (s) {
  // 指定各个符号的优先级
  function level(op) {
    switch (op) {
      case '@': return -1
      case '+':
      case '-': return 1
      case '*':
      case '/': return 2
    }
    return 0
  }
  // 计算一个表达式的值
  function calc(a, op, b) {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return a / b | 0
    }
  }
  // 记录数字的栈，用于多位数字求和
  // 记录操作符的栈
  let num = [], ops = []
  // 结尾添加开始计算标识符
  s += '@'
  for (let i = 0, n = 0; i < s.length; i++) {
    // 过滤空字符
    if (s[i] == ' ') continue
    // 对数字逐位求和
    if (level(s[i]) == 0) {
      n = n * 10 + +s[i]
      continue
    }
    // 记录上一位数字的值
    num.push(n)
    n = 0 // 数字归零
    // 当前运算符低于上一个运算符优先级时，进行运算
    while (ops.length != 0 && level(s[i]) <= level(ops[ops.length - 1])) {
      let b = num.pop() // 取出运算符后面的数字
      let a = num.pop()// 取出运算符前面的数字
      num.push(calc(a, ops.pop(), b))

    }
    // 运算符入栈
    ops.push(s[i])
  }
  return num[0]
};