function createStatementData(invoice, plays) {
  function enrichPerformance(aPerformance) {
    const calculator = createPerformCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits
    return result
  }

  function createPerformCalculator(aPerformance, plays) {
    let factory = {
      tragedy: TragedyCalculator,
      comedy: ComedyCalculator
    }
    let Calculator = factory[aPerformance.play.type]
    if (!Calculator) {
      throw new Error(`unknown type: ${aPerformance.play.type}`)
    }
    return new Calculator(aPerformance, plays)
  }
  //   演出计算器
  class PerformanceCalculator {
    constructor(aPerformance, plays) {
      this.performance = aPerformance
      this.plays = plays
    }
    get play() {
      return playFor(this.performance)
    }
    get amount() {
      throw new Error('子类必须实现 amount 方法')
    }
    get volumeCredits() {
      return Math.max(this.performance.audience - 30, 0)
    }
  }
  class TragedyCalculator extends PerformanceCalculator {
    get amount() {
      let result = 40000
      if (this.performance.audience > 30) {
        result += 1000 * (this.performance.audience - 30)
      }
      return result
    }
  }

  class ComedyCalculator extends PerformanceCalculator {
    get amount() {
      let result = 30000
      if (this.performance.audience > 20) {
        result += 10000 + 500 * (this.performance.audience - 20)
      }
      result += 300 * this.performance.audience
      return result
    }
    get volumeCredits() {
      return super.volumeCredits + Math.floor(this.performance.audience / 5)
    }
  }

  // 管道取代循环
  function totalAmount(data) {
    return data.performances.reduce((pre, cur) => cur.amount + pre, 0)
  }

  function totalVolumnCredits(data) {
    return data.performances.reduce((pre, cur) => cur.volumeCredits + pre, 0)
  }

  // 以查询取代临时变量
  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(data.performances.reduce((pre, cur) => cur.amount + pre, 0))
  statementData.totalVolumnCredits = totalVolumnCredits(statementData)
  return statementData
}

export { createStatementData }
