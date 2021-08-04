/*
146. LRU 缓存机制

运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制 。
实现 LRUCache 类：

LRUCache(int capacity) 以正整数作为容量 capacity 初始化 LRU 缓存
int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
void put(int key, int value) 如果关键字已经存在，则变更其数据值；
如果关键字不存在，则插入该组「关键字-值」。当缓存容量达到上限时，
它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。

进阶：你是否可以在 O(1) 时间复杂度内完成这两种操作？

*/
// 双向链表
class DoubleLinkedListNode {
  constructor(key, value) {
      this.key = key
      this.value = value
      this.prev = null
      this.next = null
  }
}
// 双向链表+hashMap
class LRUCache {
  constructor(capacity) {
      // 容量
      this.capacity = capacity
      // 已使用的空间
      this.usedSpace = 0
      // Mappings of key->node.
      this.hashmap = {}
      // 虚拟头结点
      this.dummyHead = new DoubleLinkedListNode(null, null)
      // 虚拟尾节点
      this.dummyTail = new DoubleLinkedListNode(null, null)
      this.dummyHead.next = this.dummyTail
      this.dummyTail.prev = this.dummyHead
  }

  _isFull() {
      return this.usedSpace === this.capacity
  }

  _removeNode(node) {
      node.prev.next = node.next
      node.next.prev = node.prev
      node.prev = null
      node.next = null
      return node
  }

  _addToHead(node) {
      const head = this.dummyHead.next
      node.next = head
      head.prev = node
      node.prev = this.dummyHead
      this.dummyHead.next = node
  }

  get(key) {
      if (key in this.hashmap) {
          const node = this.hashmap[key]
          this._addToHead(this._removeNode(node))
          return node.value
      }
      else {
          return -1
      }
  }

  put(key, value) {
      if (key in this.hashmap) {
          // If key exists, update the corresponding node and move it to the head.
          const node = this.hashmap[key]
          node.value = value
          this._addToHead(this._removeNode(node))
      }
      else {
      // If it's a new key.
          if (this._isFull()) {
              // If the cache is full, remove the tail node.
              const node = this.dummyTail.prev
              delete this.hashmap[node.key]
              this._removeNode(node)
              this.usedSpace--
          }
          // Create a new node and add it to the head.
          const node = new DoubleLinkedListNode(key, value)
          this.hashmap[key] = node
          this._addToHead(node)
          this.usedSpace++
      }
  }
}

/**
* Your LRUCache object will be instantiated and called as such:
* var obj = new LRUCache(capacity)
* var param_1 = obj.get(key)
* obj.put(key,value)
*/