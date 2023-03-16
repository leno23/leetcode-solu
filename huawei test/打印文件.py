'''
题目描述 
有5台打印机打印文件，每台打印机有自己的待打印队列一。 
因为打印的文件内容有轻重缓急之分，所以队列中的文件有1~10不同的优先级Q，其中数字越大优先级越高。 
打印机会从自己的待打印队列中选择优先级最高的文件来打印。 
如果存在两个优先级—样的文件，则选择最早进入队列的那个文件。 
现在请你来模拟这5台打印机的打印过程。 
输入描述 
每个输入包含1个测试用例，每个测试用例第1行给出发生事件的数量N(0<N <1000)。 接下来有N行，分别表示发生的事件。 
共有如下两种事件: 
IN P NUM，表示有一个拥有优先级NUM的文件放到了打印机Р的待打印队列中。(0<P <5,0<NUM ≤ 10);OUT P，表示打印机Р进行了一次文件打印，同时该文件从待打印队列中取出。(0<P<5)。 
输出描述 
对于每个测试用例，每次OUT P事件，请在一行中输出文件的编号。 
如果此时没有文件可以打印，请输出NULL。 
文件的编号定义为:IN P NUN事件发生第x次，此处待打印文件的编号为x，编号从1开始。 
示例 1 
输入： 
7 
IN 1 1 
IN 1 2 
IN 1 3 
IN 2 1 
OUT 1 
OUT 2 
OUT 2 
输出： 3 4 NULL 
示例 2 
输入： 
5 
IN 1 1 
IN 1 3 
IN 1 1 
IN 1 3 
OUT 1 
输出： 2 
'''

from heapq import heappush,heappop
p=[[]for i in range(6)]
ind=1
n=int(input())
for i in range(n):
    inp=input().split()
    s,a=inp[0],int(inp[1])
    if s=='IN':
        b=int(inp[2])
        heappush(p[a],[-b,ind])
        ind+=1
    else:
        if len(p[a])==0: print('NULL')
        else:
            s,b=heappop(p[a])
            print(b)
