// 二叉搜索树
class Node {
  constructor(key, left = null, right = null) {
    this.key = key;
    this.left = left;
    this.right = right;
  }
  getNewNode(key) {
    console.log(key);
    return new Node(key);
  }
  insert(root, key) {
    if ((root && root.key) == null) return this.getNewNode(key);
    if (root.key == key) return root;
    if (key < root.key) root.left = this.insert(root.left, key);
    else root.right = this.insert(root.right, key);
    return root;
  }
  predeccessor(root) {
    let tmp = root.left;
    while (tmp.right) tmp = tmp.right;
    return tmp;
  }
  erase(root, key) {
    if (root == null) return root;
    if (key < root.key) {
      root.left = this.erase(root.left, key);
    } else if (key > root.key) {
      root.right = this.erase(root.right, key);
    } else {
      if (root.left == null && root.right == null) {
        return null;
      } else if (root.left == null || root.right == null) {
        let tmp = root.left || root.right;
        return tmp;
      } else {
        let tmp = this.predeccessor(root);
        root.key = tmp.key;
        root.left = this.erase(root.left, tmp.key);
      }
    }
    return root;
  }
  clear() {
    if (this == null) return;
    delete this.left;
    delete this.right;
    return;
  }
  output(root) {
    if (root == null) return;
    this.output(root.left);
    console.log("out " + root.key);
    this.output(root.right);
    return;
  }
}
function output(arr){
    let root = new Node();

    arr.forEach((v) => {
      root = root.insert(root, v);
    });
    console.log(JSON.stringify(root, null, 2)  );
    root.output(root);
    root.clear();
}
let arr1 = ["5", "9", "8", "3", "2", "4", "1", "7"]
let arr2 = ["1", "2", "3", "4", "5"]
output(arr1)
output(arr2)
