function insert_sort(arr) {
  let base
  for (let i = 0; i < arr.length; i++) {
    base = arr[i]
    let left = 0, right = i - 1
    while (left <= right) {
      let mid = (left + right) >> 1
      if (arr[mid] >= arr[i]) {
        right = mid - 1
      } else {
        left = mid + 1
      }
    }
    for (let j = i - 1; j >= left; j--)arr[j + 1] = arr[j]
    arr[left] = base
  }
}

const arr = [8, 7, 6, 5, 9, 2, 0, 3, 1, 4]
insert_sort(arr)
console.log(arr)