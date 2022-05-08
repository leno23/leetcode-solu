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
  match(s){
    let ret = [],cnt = 0
    for(let i=0;i<s.length;i++){
      let p =this.root
      cnt++
      for(let j=i;s[j];j++){
        let ind = s[j].charCodeAt()-97
        if(p.next[ind]==null) break
        p=p.next[ind]
        cnt++
        if(p.flag) ret.push(s.substr(i,j-i+1))
      }
    }
    console.log('total operator:',cnt)
    return ret
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
t.insert("say");
t.insert("she");
t.insert("shr");
t.insert("he");
t.insert("her");

// console.log(t.search("hello"));
// console.log(JSON.stringify(t, null, 2));
console.log(t.match("sasherhs"));
// console.log(JSON.stringify(t, null, 2))
// console.log(t.search('hell'))
// t.output()
