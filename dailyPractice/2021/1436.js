/*
1436. 旅行终点站

给你一份旅游线路图，该线路图中的旅行线路用数组 paths 表示，其中 
paths[i] = [cityAi, cityBi] 表示该线路将会从 cityAi 直接前往 cityBi 。
请你找出这次旅行的终点站，即没有任何可以通往其他城市的线路的城市。

题目数据保证线路图会形成一条不存在循环的线路，因此恰有一个旅行终点站。
*/
/**
 * @param {string[][]} paths
 * @return {string}
 */
var destCity = function (paths) {
    let map = {};
    // 将起始地与目的地的映射存储到map中
    for (let v of paths) {
        map[v[0]] = v[1];
    }
    // 只有目的地 不能 同时是起始地
    for (let v of paths) if (!map[v[1]]) return v[1];
};
