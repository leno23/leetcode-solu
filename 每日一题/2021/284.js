/*
284. 顶端迭代器

请你设计一个迭代器，除了支持 hasNext 和 next 操作外，还支持 peek 操作。

实现 PeekingIterator 类：

PeekingIterator(int[] nums) 使用指定整数数组 nums 初始化迭代器。
int next() 返回数组中的下一个元素，并将指针移动到下个元素处。
bool hasNext() 如果数组中存在下一个元素，返回 true ；否则，返回 false 。
int peek() 返回数组中的下一个元素，但 不 移动指针。
*/
var PeekingIterator = function (iterator) {
    this.iterator = iterator;
    this.nextElement = this.iterator.next();
};

PeekingIterator.prototype.peek = function () {
    return this.nextElement;
};

PeekingIterator.prototype.next = function () {
    const ret = this.nextElement;
    this.nextElement = this.iterator.hasNext() ? this.iterator.next() : null;
    return ret;
};

PeekingIterator.prototype.hasNext = function () {
    return this.nextElement != null;
};
