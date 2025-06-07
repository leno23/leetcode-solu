let invoice = [
  {
    customer: 'Bingo',
    performances: [
      {
        playID: 'hamlet',
        audience: 55
      },
      {
        playID: 'as-like',
        audience: 35
      },
      {
        playID: 'othello',
        audience: 40
      }
    ]
  }
]

let plays = {
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  othello: { name: 'Othello', type: 'tragedy' },
  'as-like': {
    name: 'As Like',
    type: 'comedy'
  }
}
// This is a refactored version of the original code to improve readability and maintainability.
// 移除参数，因为play这个参数不会改变
function statement(invoice) {
  // Initialize variables for total amount and volume credits
  let totalAmount = 0
  let volumeCredits = 0
  let result = `演出：${invoice.customer}\n`
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format

  for (let perf of invoice.performances) {
    // 内联变量
    // 观众超过30个的会奖励积分
    volumeCredits += Math.max(
      perf.audience - 30,
      0
    )
    // 喜剧每五个观众额外奖励一个积分
    if ('comedy' === playFor(perf).type) {
      volumeCredits += Math.floor(
        perf.audience / 5
      )
    }

    // print line for this order
    result += ` ${playFor(perf).name}: ${format(
      amountFor(perf) / 100
    )} (${perf.audience}个座位)\n`
    totalAmount += amountFor(perf)
  }
  result += `总共的费用：${format(
    totalAmount / 100
  )}\n`
  result += `赚了：${volumeCredits} 个积分\n`
  return result
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
  switch (playFor(aPerformance).type) {
    case 'tragedy':
      result = 40000
      if (aPerformance.audience > 30) {
        result +=
          1000 * (aPerformance.audience - 30)
      }
      break
    case 'comedy':
      result = 30000
      if (aPerformance.audience > 20) {
        result +=
          10000 +
          500 * (aPerformance.audience - 20)
      }
      result += 300 * aPerformance.audience
      break
    default:
      throw new Error(
        `unknown type: ${
          playFor(aPerformance).type
        }`
      )
  }
  return result
}
for (let item of invoice) {
  console.log(statement(item, plays))
}
