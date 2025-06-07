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
function statement(invoice, plays) {
    // Initialize variables for total amount and volume credits
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format

  for (let perf of invoice.performances) {
    const play = plays[perf.playID]
    let thisAmount = 0

    // calculate the amount for the performance
    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000
        if (perf.audience > 30) {
          thisAmount +=
            1000 * (perf.audience - 30)
        }
        break
      case 'comedy':
        thisAmount = 30000
        if (perf.audience > 20) {
          thisAmount +=
            10000 + 500 * (perf.audience - 20)
        }
        thisAmount += 300 * perf.audience
        break
      default:
        throw new Error(
          `unknown type: ${play.type}`
        )
    }

    // 观众超过30个的会奖励积分
    volumeCredits += Math.max(
      perf.audience - 30,
      0
    )
    // 喜剧每五个观众额外奖励一个积分
    if ('comedy' === play.type) {
      volumeCredits += Math.floor(
        perf.audience / 5
      )
    }

    // print line for this order
    result += ` ${play.name}: ${format(
      thisAmount / 100
    )} (${perf.audience} seats)\n`
    totalAmount += thisAmount
  }
  result += `Amount owed is ${format(
    totalAmount / 100
  )}\n`
  result += `You earned ${volumeCredits} credits\n`
  return result
}
for (let item of invoice) {
  console.log(statement(item, plays))
}
