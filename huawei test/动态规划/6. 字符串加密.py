'''给你一串未加密的字符串str，通过对字符串的每一个字母进行改变来实现加密，加密方式是在每一个字母str[i]偏移特定数组元素a[i]的量，数组a前三位已经赋值：a[0]=1,a[1]=2,a[2]=4。当i>=3时，数组元素a[i]=a[i-1]+a[i-2]+a[i-3]，
例如：原文 abcde 加密后 bdgkr，其中偏移量分别是1,2,4,7,13。
输入描述:
第一行为一个整数n（1<=n<=1000），表示有n组测试数据，每组数据包含一行，原文str（只含有小写字母，0<长度<=50）。
输出描述:
每组测试数据输出一行，表示字符串的密文
示例1
输入
1
xy
输出
ya
说明
第一个字符x偏移量是1，即为y，第二个字符y偏移量是2，即为a
示例2
输入
2
Xy
abcde
输出
ya
bdgkr
说明
第二行输出字符偏移量分别是1，2，4，7，13
备注
解答要求
时间限制：2000ms，内存限制：64MB

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0213ece2c6cf4182b7992f08da612c07~tplv-k3u1fbpfcp-watermark.image)
'''

m=int(input())
a=[0]*50
a[0]=1
a[1]=2
a[2]=4
for i in range(3,50):
    a[i]=a[i-1]+a[i-2]+a[i-3]
for i in range(m):
    s=input()
    n=len(s)
    r=''
    for i,x in enumerate(s):
        ind =(ord(x)-97+a[i])%26 
        r +=  chr(97 + ind) 
    print(r)

