/*
797. 所有可能的路径

给你一个有 n 个节点的 有向无环图（DAG），请你找出所有从节点 0 到节点 n-1 的路径并输出（不要求按特定顺序）
二维数组的第 i 个数组中的单元都表示有向图中 i 号节点所能到达的下一些节点，空就是没有下一个结点了。
译者注：有向图是有方向的，即规定了 a→b 你就不能从 b→a 。

*/
/**
 * @param {number[][]} graph
 * @return {number[][]}
 */
var allPathsSourceTarget = function (graph) {
  let res = [],
    tmp = [];
  // 深度优先、回溯
  const dfs = (graph, cur) => {
    if (cur == graph.length - 1) {
      res.push(tmp.slice());
      return;
    }
    if (cur == 0) tmp.push(0);
    for (let g of graph[cur]) {
      tmp.push(g);
      dfs(graph, g);
      tmp.pop();
    }
  };
  dfs(graph, 0);
  return res;
};
