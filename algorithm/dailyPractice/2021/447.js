/*
447. 回旋镖的数量
给定平面上 n 对 互不相同 的点 points ，其中 points[i] = [xi, yi] 。
回旋镖 是由点 (i, j, k) 表示的元组 ，其中 i 和 j 之间的距离和 i 和 k 
之间的距离相等（需要考虑元组的顺序）。

返回平面上所有回旋镖的数量。

*/
/**
 * @param {number[][]} points
 * @return {number}
 */
var numberOfBoomerangs = function (points) {
    let res = 0;
    for (let i = 0; i < points.length; i++) {
        let map = new Map();
        for (let j = 0; j < points.length; j++) {
            let dx = points[i][0] - points[j][0];
            let dy = points[i][1] - points[j][1];
            let dis = dx * dx + dy * dy;
            map.set(dis, (map.get(dis) || 0) + 1);
        }
        for (let val of map.values()) {
            res += val * (val - 1);
        }
    }
    return res;
};
