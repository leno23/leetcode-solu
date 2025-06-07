import { createStatementData } from './createStatementData.js'

let invoice = {
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

let plays = {
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  othello: { name: 'Othello', type: 'tragedy' },
  'as-like': {
    name: 'As Like',
    type: 'comedy'
  }
}
// 变量改为函数声明，并改变函数名
function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(aNumber / 100)
}

const createData = () => {
  return createStatementData(invoice, plays)
}
// 移除参数，因为play这个参数不会改变
function statement() {
  let text = renderPlainText(createData())
  console.log(text)
}
function htmlStatement() {
  return renderHtml(createData())
}

function renderPlainText(data) {
  let result = `演出：${data.customer}\n`
  for (let perf of data.performances) {
    result += `-${perf.play.name}: ${usd(perf.amount)} (${perf.audience}个座位)\n`
  }
  result += `总共的费用：${usd(data.totalAmount)}\n`
  result += `赚了：${data.totalVolumnCredits} 个积分\n`
  return result
}

function renderHtml(data) {
  let html = `
  <h1>演出：${data.customer}</h1>
  <table border style="border-collapse: collapse;"><tr>
    <td>演员</td>
    <td>费用</td>
    <td>观众数</td>
  </tr>
  ${data.performances.reduce(
    (pre, cur) =>
      pre +
      `<tr>
        <td>${cur.play.name}</td>
        <td>${cur.amount}</td>
        <td>${cur.audience}</td>
    </tr>`,
    ''
  )}
  </table>
  <p>总共的费用：${usd(data.totalAmount)}</p>
  <p>赚了：${usd(data.totalVolumnCredits)}个积分/p>`
  let div = document.createElement('div')
  div.innerHTML = html
  document.body.appendChild(div)
}
htmlStatement(invoice, plays)
statement()
