function buble_sort(arr) {
  let left = 0, right = arr.length - 1, tmp, j
  while (left < right) {
    for (j = left; j < right; j++) {
      if (arr[j] > arr[j + 1]) {
        tmp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = tmp
      }
    }
    --right
    for (j = right; j > left; j--) {
      if (arr[j] < arr[j - 1]) {
        tmp = arr[j]
        arr[j] = arr[j - 1]
        arr[j - 1] = tmp
      }
    }
    ++left
  }
  return arr
}


let arr = [12, 11, 10, 6, 7, 9, 3, 4, 5, 2, 88]
console.log(buble_sort(arr))