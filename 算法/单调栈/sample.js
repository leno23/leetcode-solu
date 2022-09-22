function sample(arr) {
  let pre = [], // 前面第一个小于当前元素的元素下标
    next = [],// 后面第一个小于当前元素的元素下标
    s = []
  for (let i = 0; i < arr.length; i++) {
    while (s.length && arr[i] < arr[s[s.length - 1]]) {
      next[s[s.length - 1]] = i
      s.pop()
    }
    if (s.length == 0) pre[i] = -1
    else pre[i] = s[s.length - 1]
    s.push(i)
  }
  while (s.length) next[s[s.length - 1]] = s.length, s.pop()
  console.log(' ' + JSON.stringify(arr) + ' \n', JSON.stringify(pre) + '\n', JSON.stringify(next))
}
sample([8, 2, 7, 9, 0, 4, 3, 6, 1, 5])
