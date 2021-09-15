/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
    let used = {},
        ret = [];
    const dfs = (path) => {
        if (path.length == nums.length) {
            ret.push([...path]);
            return;
        }
        for (let v of nums) {
            if (used[v]) continue;
            used[v] = true;
            path.push(v);
            dfs(path);
            used[v] = false;
            path.pop();
        }
    };
    dfs([]);
    return ret;
};
