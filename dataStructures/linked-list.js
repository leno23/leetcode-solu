class ListNode {
    constructor(val, next) {
        this.val = val;
        this.next = next || null;
    }
}

let n = new ListNode(1);
n.next = new ListNode(2);
n.next.next = new ListNode(3);
n.next.next.next = new ListNode(4);
console.log(JSON.stringify(n));
let tmp = n,
    ret = "";
while (tmp) {
    ret += tmp.val + "->";
    tmp = tmp.next;
}
console.log(ret);
console.log("------------------------------------------------------------");
let data = Array(10).fill(0); // 数据域
let next = Array(10).fill(0); // 指针域
// 在ind节点后添加节点p，值为val
const add = (ind, p, val) => {
    next[p] = next[ind];
    next[ind] = p;
    data[p] = val;
    return;
};

let head = 3;
data[3] = 0;
add(3, 5, 1);
add(5, 2, 2);
add(2, 7, 3);
add(7, 9, 100);
add(5, 6, 123);
let p = head,
    res = "";
while (p) {
    res += data[p] + "->";
    p = next[p];
}
console.log(res);
