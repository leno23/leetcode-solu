/*
901. 股票价格跨度

编写一个 StockSpanner 类，它收集某些股票的每日报价，并返回该股票当日价格的跨度。
今天股票价格的跨度被定义为股票价格小于或等于今天价格的最大连续日数
（从今天开始往回数，包括今天）。

例如，如果未来7天股票的价格是 [100, 80, 60, 70, 60, 75, 85]，
那么股票跨度将是 [1, 1, 1, 2, 1, 4, 6]。

*/
var StockSpanner = function () {
  this.t = 0
  this.s = [[10e5, this.t++]]
};

/** 
* @param {number} price
* @return {number}
*/
StockSpanner.prototype.next = function (price) {
  while (this.s.length && price >= this.s[this.s.length - 1][0]) this.s.pop()
  let ret = this.t - this.s[this.s.length - 1][1]
  this.s.push([price, this.t++])
  return ret
};

/**
* Your StockSpanner object will be instantiated and called as such:
* var obj = new StockSpanner()
* var param_1 = obj.next(price)
*/