77. 翻转单词顺序


输入一个英文句子，**单词之间用一个空格隔开，且句首和句尾没有多余空格**。

翻转句子中单词的顺序，但单词内字符的顺序不变。

为简单起见，标点符号和普通字母一样处理。

例如输入字符串`"I am a student."`，则输出`"student. a am I"`。

#### 数据范围

输入字符串长度 [0,1000][0,1000]。

#### 样例

```
输入："I am a student."

输出："student. a am I"
```


```py
class Solution(object):
    def reverseWords(self, s):
        a=[]
        # 双指针实现split操作
        j=0
        n=len(s)
        for i in range(n):
            if s[i]==' ' : 
                a.append(s[j:i])
                j=i+1
        a.append(s[j:n])
        # 双指针实现reverse操作
        l,r=0,len(a)-1
        while l<r:
            a[l],a[r]=a[r],a[l]
            l+=1
            r-=1
        return ' '.join(a)
            
        