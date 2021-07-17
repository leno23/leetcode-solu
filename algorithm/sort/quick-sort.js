function quick_sort_v1(arr, l, r) {
  // 首位指针重合时返回
  if (l >= r) return
  let x = l, y = r, base = arr[l]
  // 保证左右指针的顺序
  while (x < y) {
    // 找到一个小于base的右指针位置
    while (x < y && arr[y] >= base) y--
    // 将小于基准值的数字partation到左侧，左指针右移
    if (x < y) arr[x++] = arr[y]
    // 找到一个大于base的左指针位置
    while (x < y && arr[x] < base) x++
    // 将大于基准值的数字partation到右侧，右指针左移
    if (x < y) arr[y--] = arr[x]
  }
  // 复原base的值
  arr[x] = base
  // 此时，以x为界限，左边都是小于base的值，右边都是大于base的值
  // 分别让左右区域重复上述partation过程，完成排序
  quick_sort_v1(arr, l, x - 1)
  quick_sort_v1(arr, x + 1, r)
}
function quick_sort_v2(arr, l, r) {
  while (l < r) {
    let x = l, y = r, base = arr[l]
    while (x < y) {
      while (x < y && arr[y] >= base) y--
      if (x < y) arr[x++] = arr[y]
      while (x < y && arr[x] < base) x++
      if (x < y) arr[y--] = arr[x]
    }
    arr[x] = base
    quick_sort_v2(arr, x + 1, r)
    r = x - 1
  }
  return
}


const arr = [7, 5, 6, 9, 8, 3, 2, 0, 1, 4]
quick_sort_v1(arr, 0, 9)
console.log(arr)

const arr2 = [7, 5, 6, 9, 8, 3, 2, 0, 1, 4]
quick_sort_v2(arr2, 0, 9)
console.log(arr2)


/*****************************************/

function quick_sort_v3(arr, l, r) {
  // 划分区间的范围
  const threshold = 16
  function __quick_sort_v3(arr, l, r) {
    while (r - l > threshold) {
      let x = l, y = r, base = getmid(arr[l], arr[l + r] / 2, arr[r])
      do {
        while (arr[x] < base) x++
        while (arr[y] > base) y--
        if (x <= y) {
          swap(arr[x], arr[y])
          x++, y--
        }
      } while (x <= y)
      __quick_sort_v3(arr, x, r)
      r = y
    }
    return
  }
  function swap(a, b) {
    const tmp = a
    a = b
    b = tmp
  }
  function final_insert_sort(arr, l, r) {
    let ind = l
    for (let i = l + 1; i <= r; i++) {
      if (arr[i] < arr[ind]) ind = i
    }
    while (ind > l) {
      swap(arr[ind], arr[ind - 1])
      ind--
    }
    for (let i = l + 2; i <= r; i++) {
      let j = i
      while (arr[j] < arr[j - 1]) {
        swap(arr[j], arr[j - 1])
        j--
      }
    }
    return
  }
  function getmid(a, b, c) {
    if (a > b) swap(a, b)
    if (a > c) swap(a, c)
    if (b > c) swap(b, c)
    return b

  }
  __quick_sort_v3(arr, l, r)
  final_insert_sort(arr, l, r)
}
const arr3 = [7, 5, 6, 9, 8, 3, 2, 0, 1, 4]
quick_sort_v3(arr2, 0, 9)
console.log(arr3)
