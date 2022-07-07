// 前缀树/字典树 的js写法

// 使用字面量{} 表示一个字典树节点
let root = {}
function add(dict){
  for(let d of dict){
    let node = root
    for(let c of d){
      if(!node[c]) node[c] = {}
      node  = node[c] 
    }
    node.isLeaf = true
  }
}
// 在字典树中找单词的前缀
function search(word){
  let node = root,index = 0
  for(let x of word){
    // 找到叶子节点，找到前缀了
    if(node.isLeaf) return word.slice(0,index)
    // 找不到下个字母了
    if(node[x] ==null) return ''
    index++
    node = node[x]
  }
  // 整个单词匹配上了
  console.log('整个单词匹配上');
  return word
}
let dictionary = ['cat','bat','rat']
add(dictionary)
console.log(search('cattle'));

console.log(search('cat'));
// test