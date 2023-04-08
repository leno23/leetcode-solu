'''
给定一个仅由字母组成的字符串word，现需要对齐按现有顺序截成尽可能多的子串，并保证每两个子串之间无相同的字符（大小写敏感），
最后请以此返回每个子串长度的序列。
子串：字符串中任意个连续的字符组成的子序列称为该串的子串。
示例1：
输入：word = “Kick”
输出：[1,1,1,1]
解释：正好无重复元素，最多可截成4个子串，每个元素为一个子串。注意，第一个K是大写，最后一个是小写。
示例2：
输入：word = “abbcdefb”
输出：[1,7]
解释：最多分成“a”、“bbcdefb”两个子串。其中，把字母b都分到第二个子串中，这样就和第一个子串无相同字符。
示例3：
输入：word = “ijddacfafh”
输出：[1,1,2,5,1]
解释：最多分成“i”、“j”、“dd”、“acfaf”、“h”五个子串。
'''
s=input()
# mask=0
# r=[]
# cnt=1
# for x in s:
#     if mask & (1<<(ord(x)-97)):
#         cnt+=1
#     else:
#         print(x,cnt)
#         r.append(cnt)
#         cnt=1
#         mask=0
#     mask |= 1<<(ord(x)-97)
# print(r)
st=set()
n=len(s)
mp={}
start=0
mp2={}
maxr=0
r=[]
for i in range(n):
    mp2[s[i]]=i
print(mp2)
i=0
while i<n:
    x=s[i]
    if mp2[x]==maxr:
        r.append(maxr-start+1)
        start=i+1
    maxr=max(maxr,mp2[x])
    i+=1
print(r)