function createStatementData(invoice, plays) {
  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumnCredits = totalVolumnCredits(statementData)
  return statementData
  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }

  // 管道取代循环
  function totalAmount(data) {
    return data.performances.reduce((pre, cur) => cur.amount + pre, 0)
  }

  function totalVolumnCredits(data) {
    return data.performances.reduce((pre, cur) => cur.volumeCredits + pre, 0)
  }

  // 提炼函数，将计算积分的逻辑抽离出来
  function volumeCreditsFor(aPerformance) {
    let volumeCredits = 0
    // 观众超过30个的会奖励积分
    volumeCredits += Math.max(aPerformance.audience - 30, 0)
    // 喜剧每五个观众额外奖励一个积分
    if ('comedy' === aPerformance.play.type) {
      volumeCredits += Math.floor(aPerformance.audience / 5)
    }
    return volumeCredits
  }

  // 以查询取代临时变量
  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  // 提炼函数，将计算费用部分的逻辑抽离出来
  function amountFor(aPerformance) {
    // 变量改名 thisAmount -> result
    let result = 0

    // calculate the amount for the performance
    switch (aPerformance.play.type) {
      case 'tragedy':
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20)
        }
        result += 300 * aPerformance.audience
        break
      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`)
    }
    return result
  }
}

export { createStatementData }
