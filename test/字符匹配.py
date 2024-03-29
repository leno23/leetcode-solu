给你一个字符串数组（每个字符串均由小写字母组成）和一个字符规律（由小写字母和 . 和 * 组成），识别数组中哪些字符串可以匹配到字符规律上。
‘.’匹配任意单个字符，‘*’匹配零个或多个前面的那一个元素，所谓匹配，是要涵盖整个字符串的，而不是部分字符串。

输入描述
第一行为空格分隔的多个字符串，单个字符串长度从1到100，字符串个数从1到100
第二行为字符规律，1<=字符规律长度<=50
不需要考虑异常场景

输出描述：
匹配的字符串在数组中的下标(从0开始)，多个匹配时下标升序并用英文逗号分隔，若均不匹配输出-1.

示例1
输入
ab aab
.*
输出
0,1
说明
ab中a匹配. b匹配* 可以完全匹配；aab中a匹配. ab匹配* 可以完全匹配；输出对应字符串数组下标0,1

示例2
输入
ab aab
a.b
输出
1
说明
aab中第一个a匹配a，第二个a匹配. b匹配b可以全匹配；输出对应的字符串数组下标1


s=input().split()
p=input()
n2,m=len(s),len(p)
print(s,p)
def check(s):
    n=len(s)
    f=[[0]*(m+1) for i in range(n+1)]
    f[0][0]=1
    for i in range(2,m+1,2):
        f[0][i]=p[i-1]=='*' and f[0][i-2]

    for i in range(1,n+1):
        for j in range(1,m+1):
            if p[j-1]=='*':
                if f[i][j-2]: f[i][j]=1
                elif f[i-1][j] and (s[i-1]==p[j-2] or p[j-2]=='.'): f[i][j]=1
            else:
                f[i][j]=f[i-1][j-1] and(s[i-1]==p[j-1] or p[j-1]=='.')
    return f[n][m]
r=[]
for i in range(n2):
    if check(s[i]): r.append(str(i))
print(','.join(r))