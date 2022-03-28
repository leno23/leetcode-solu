const BASE = 26
class Node {
  constructor() {
    this.next = []
    this.flag = false
    for (let i = 0; i < BASE; i++)
      this.next[i] = null
  }
}
class Trie {
  constructor() {
    this.root = new Node()
  }
  insert(word) {
    let p = this.root
    for (let x of word) {
      let ind = x.charCodeAt() - 97
      if (p.next[ind] == null)
        p.next[ind] = new Node()
      p = p.next[ind]
    }
    if (p.flag) return false
    p.flag = true
    // flag代表是否是第一次插入单词
    return true
  }
  search(word) {
    let p = this.root
    for (let x of word) {
      let ind = x.charCodeAt() - 97
      p = p.next[ind]
      if (p == null) return false
    }
    return p.flag
  }
  __output(root, s) {
    if (root == null) return
    if (root.flag) console.log(`find:  ${s}`)
    for (let i = 0; i < BASE; i++) {
      this.__output(
        root.next[i],
        s + String.fromCharCode(97 + i)
      )
    }
  }
  output() {
    let s = '' // 当前节点的前缀路径f
    this.__output(this.root, s)
  }
}
let t = new Trie()
console.log(t.search('a'))
t.insert('hello')
t.insert('tom')
t.insert('jack')
t.insert('jac')

console.log(t.search('hello'))
console.log(JSON.stringify(t, null, 0))
console.log(t.search('hell'))
t.output()
