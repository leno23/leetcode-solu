function merge_sort(arr, l, r) {
  if (l >= r) return
  let mid = (l + r) >> 1
  merge_sort(arr, l, mid)
  merge_sort(arr, mid + 1, r)
  let tmp = Array(r - l + 1).fill()
  let p1 = l, p2 = mid + 1, k = 0
  while (p1 <= mid || p2 <= r) {
    if (p2 > r || (p1 <= mid && arr[p1] < arr[p2])) {
      tmp[k++] = arr[p1++]
    } else {
      tmp[k++] = arr[p2++]
    }
  }
  for (let i = l; i <= r; i++)arr[i] = tmp[i - l]
  return
}

let arr = [12, 11, 10, 6, 7, 9, 3, 4, 5, 2]
merge_sort(arr, 0, 9)
console.log(arr)