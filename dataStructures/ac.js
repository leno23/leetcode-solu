const BASE = 26;
class Node {
    constructor() {
        this.next = [];
        this.flag = false;
        this.s = "";
        this.fail = null;
        for (let i = 0; i < BASE; i++) this.next[i] = null;
    }
}
class Automaton {
    constructor() {
        this.root = new Node();
    }
    insert(word) {
        let p = this.root;
        for (let x of word) {
            let ind = x.charCodeAt() - 97;
            if (p.next[ind] == null) p.next[ind] = new Node();
            p = p.next[ind];
        }
        p.flag = true;
        // flag代表是否是第一次插入单词
        return true;
    }
    match(s) {
      let cnt =0
        let ret = [],p=this.root,k
        for (let i = 0; i < s.length; i++) {
          // 状态转移
          let ind = s[i].charCodeAt()-97
          while(p && p.next[ind] == null) {
            p=p.fail,cnt++
          }
          if(p) p=p.next[ind]
          else p=this.root,cnt++
          // 提取结果
          k=p;
          while(k){
            if(k.flag) ret.push(k.s)
            k=k.fail
          }
        }
        console.log('total:',cnt)
        return ret;
    }
    build_ac() {
        let q = [];
        for (let i = 0; i < BASE; i++) {
            if (this.root.next[i] == null) continue;
            this.root.next[i].fail = this.root;
            q.push(this.root.next[i]);
        }
        while (q.length) {
            let now = q.shift();
            for (let i = 0; i < BASE; i++) {
                if (now.next[i] == null) continue;
                p = now.fail;
                while (p && p.next[i] == null) p = p.fail;
                if (p) p = p.next[i];
                else p = this.root;
                now.next[i].fail = p;
                q.push(now.next[i]);
            }
        }
    }
    search(word) {
        let p = this.root;
        for (let x of word) {
            let ind = x.charCodeAt() - 97;
            p = p.next[ind];
            if (p == null) return false;
        }
        return p.flag;
    }
    __output(root, s) {
        if (root == null) return;
        if (root.flag) console.log(`find:  ${s}`);
        for (let i = 0; i < BASE; i++) {
            this.__output(root.next[i], s + String.fromCharCode(97 + i));
        }
    }
    output() {
        let s = ""; // 当前节点的前缀路径f
        this.__output(this.root, s);
    }
}
let t = new Automaton();
// console.log(t.search("a"));
t.insert("say");
t.insert("she");
t.insert("shr");
t.insert("he");
t.insert("her");

// console.log(t.search("hello"));
// console.log(JSON.stringify(t, null, 2));
console.log(t.match("sasherhs"));
// t.output();
