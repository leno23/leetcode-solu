831. KMP字符串

-   [   题目](https://www.acwing.com/problem/content/description/833/)
-   [   提交记录](https://www.acwing.com/problem/content/submission/833/)
-   [   讨论](https://www.acwing.com/problem/content/discussion/index/833/1/)
-   [   题解](https://www.acwing.com/problem/content/solution/833/1/)
-   [   视频讲解](https://www.acwing.com/problem/content/video/833/)

  


给定一个字符串 S�，以及一个模式串 P�，所有字符串中只包含大小写英文字母以及阿拉伯数字。

模式串 P� 在字符串 S� 中多次作为子串出现。

求出模式串 P� 在字符串 S� 中所有出现的位置的起始下标。

#### 输入格式

第一行输入整数 N�，表示字符串 P� 的长度。

第二行输入字符串 P�。

第三行输入整数 M�，表示字符串 S� 的长度。

第四行输入字符串 S�。

#### 输出格式

共一行，输出所有出现位置的起始下标（下标从 00 开始计数），整数之间用空格隔开。

#### 数据范围

1≤N≤1051≤�≤105  
1≤M≤1061≤�≤106

#### 输入样例：

```
3
aba
5
ababa
```

#### 输出样例：

```
0 2
```


```py
n=int(input())
# 输入字符向后偏移一位处理
p='!'+input()
m=int(input())
s='!'+input()

nex=[0]*(n+1)
# nex[i]表示p中前i位最长的相同前后缀 
j=0
# 相当于复制一份p，和原来的字符串p进行匹配
# 从文本串的第二位开始匹配，
for i in range(2,n+1):
    # p[j+1]是p中前i位最长相同前后缀的下一位
    # j==0表示当前j向后移动 0~j位都不能匹配成功
    # p[i]!=p[j+1]表示当前p与s失配，但是在前缀0~j中存在一个j'也就是0~j中的最长相同前后缀
    # 可以让j从那一位之后继续开始匹配
    while j and p[i] != p[j+1]: j=nex[j]
    # 当前为匹配成功，模式串指针向后移动
    if p[i]==p[j+1]: j+=1
    # 记录p中前i位的最长相同前后缀长度为j
    nex[i]=j
print(nex)
j=0
for i in range(1,m+1):
    # 递归的思维，找到p中匹配部分的nex[j]之后，查看p中的下一位和s[i]是否相同
    # 如果不相同，递归的查找nex[j]前缀部分的nex值，直到j==0或者p的下一位和s[i]相同
   while j and s[i]!=p[j+1]: j=nex[j]
    # 当前对应位置匹配，j向后移动一位  
   if s[i]==p[j+1]: j+=1
    # 匹配到最后一位，输出结果
   if j==n:
       # 模式串的位置 = 末尾的下标 + 1 - 模式串长度
       print(i-n,end=' ')
        # j跳到下一个匹配的位置
       j=nex[j]
       