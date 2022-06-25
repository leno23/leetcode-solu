```js
/**
 * @param {number[][]} costs
 * @return {number}
 */
var minCost = function (costs) {
    let { min } = Math
    for (let i = 1; i < costs.length; i++) {
        costs[i][0] += min(costs[i - 1][1], costs[i - 1][2]);
        costs[i][1] += min(costs[i - 1][0], costs[i - 1][2]);
        costs[i][2] += min(costs[i - 1][0], costs[i - 1][1]);
    }
    return min(costs[costs.length - 1][0], min(costs[costs.length - 1][1], costs[costs.length - 1][2]));
};

```