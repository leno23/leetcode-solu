'''
喊7是一个传统游戏，N个人围成一圈，按顺时针从1到N编号。编号为1的人从1开始喊数，下一个人喊的数字为上一个人的数字加1，但是如果将要喊出的数字是7或者是7的倍数或者数字本身包含7的话，
不能把这个数字直接喊出来，而是要喊“过”。假定玩这个游戏的N个人都没有失误在正确的时机喊了“过”，当喊到数字K时，可以统计每个人喊“过”的次数。

现在给定一个长度为N的数组，存储了打乱顺序的每个人喊“过”的次数，请把它还原成为正确的顺序，即数组的第i个人存储编号i的人喊“过”的次数。

输入描述：
输入为一行数字，代表以空格分隔的喊“过”的次数。注意K的具体值不会作为输入提供，但K肯定不超过200，而数字的个数即为题目中的N的大小。
输出描述：
输出为一行，为顺序正确的喊“过”的次数，也由空格分隔。

示例1：
输入
0 1 0
输出
1 0 0
说明
一共只有一次喊“过”，那只会发生在第一次喊7的时候，按照顺序，编号为1的人会遇到7，所以输出应该为 1 0 0。注意,结束的时候不一定7，也可以是8、9等，这样喊“过”的次数也是1 0 0

示例2：
输入
0 0 0 2 1
输出
0 2 0 1 0
说明
一共三次喊“过”，发生在数字7、14、17上，按顺序，编号为2的人会遇到7、17.编号为4的人会遇到14。所以输出为 0 2 0 1 0
'''

a=[int(x) for x in input().split()]
n=len(a)
sm=sum(a)
r=0
ret=[0]*n
i=1
def check(num):
    if num %7==0: return 1
    while num:
        if num%10==7: return 1
        num//=10
    return 0
while r<sm:
    if check(i): 
        ret[i%n-1]+=1
        r+=1
    i+=1
for x in ret: print(x,end=' ')
