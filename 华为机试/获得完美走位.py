'''
题目描述 
在第一人称射击游戏中，玩家通过键盘的 A、S、D、W 四个按键控制游戏人物分别向左、向后、向右、向前进行移动，从而完成走位。 
假设玩家每按动一次键盘，游戏人物会向某个方向移动一步，如果玩家在操作一定次数的键盘并且各个方向的步数相同时，此时游戏人物必定会回到原点，则称此次走位为完美走位。 
现给定玩家的走位（例如: ASDA) ，请通过更换其中一段连续走位的方式使得原走位能够变成一个完美走位。其中待更换的连续走位可以是相同长度的任何走位。 
请返回待更换的连续走位的最小可能长度，若果原走位本身是一个完美走位，则返回0。 
输入描述 
输入为由键盘字母表示的走位 s，例如：ASDA。 
输出描述 
输出为待更换的连续走位的最小可能长度备注： 
走位长度 1 < s.length ≤ 10^5；s.length 是4的倍数；s 中只含有 A，S ，D，W 四种字符。 
示例 1 
输入： ASDW 
输出： 0 
示例 2 
输入： AASW 
输出： 1 
 
 说明： 最少需要更换一个方向，可以是ADSW或者DASW 
'''
from collections import defaultdict
s=input()
n=len(s)
def sol():
    count = n//4
    target=len(s)
    mp=defaultdict(int)
    for x in 'WASD': mp[x]=0
    for x in s: mp[x]+=1
    num=mp[s[0]]
    sameCount=1
    for x in mp.values():
        if x != num:
            sameCount=0
    # ASWD个数相同不需要计算
    if sameCount: return 0
    # 需要替换的子串l~r
    l,r=0,0
    mp[s[r]]-=1
    # 枚举子串的左边界
    while l<n:
        maxCnt = max(mp.values())
        lack=sum(maxCnt-x for x in mp.values())
        length=r-l+1
        # 要替换子串外的字符中 最多出现的个数
        if length>=lack and (length-lack) %4==0:
            # 更新答案
            target=min(target,length)
            # 缩小子串大小
            mp[s[l]]+=1
            l+=1
        else:
            # 待替换子串的字符数不够 替换
            r+=1
            if r >= n: break
            mp[s[r]]-=1
    
    return target

print(sol())
