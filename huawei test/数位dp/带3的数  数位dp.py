'''
题目描述
求区间[L,R]范围内有多少带3的数。

所谓带3的数就是这个数的十进制表示中存在至少一位为3。

比如3, 123, 3333,都是带3的数，如12, 456, 1000都是不带3的数

输入描述
输入一行包含两个整数 L,R（1 ≤ L ≤ R ≤ 10^12）。

输出描述
输出一个整数，表示区间[L,R]范围内带3的数的个数。

输入

100 200

输出

19
'''
import math
 

# 从左到右枚举每个位
# 枚举到第level位 
def dfs(level, limit, s):
    n=len(s)
    if level == n:
        return 0
 
    maxV = 9
    if limit: maxV = int(s[level])
    count = 0
 
    for i in range(maxV + 1):
        nex = level + 1
        is_limit = limit and i==maxV
        if i == 3:
            # 枚举到3，则后面位就不需要枚举了，必然含3
            # 统计含3数的个数
            if is_limit :  # 如果当前枚举3是上界值
            # 比如135 第一位枚举1时，第二位枚举到3时，当前13是上届， 满足条件的数字就是0 1 2 ... 5 也就是 s[level:] + 1个
                count += int(s[nex:]) + 1  # 从0计数，因此要加1
            else:
                # 当前枚举的不是上届，那么后面的n-level位 从0~99...(n-level个9) 都可以
                count += 10**(n - nex)
        else:
            count += dfs(nex, is_limit, s)
 
    return count
 
 
def digitSearch(num):
    s = str(num)
    count = dfs(0, True, s)
    return count
 
res = digitSearch(200)-digitSearch(99)
print(res)