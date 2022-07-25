/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    var res = nums[0];
    var sum = 0;
    nums.forEach((num) => {
        if (sum > 0) {
            sum += num;
        } else {
            sum = num;
        }
        res = Math.max(res, sum);
    });
    return res;
};
