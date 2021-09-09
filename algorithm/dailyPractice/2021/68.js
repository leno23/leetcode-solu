/*
68. 文本左右对齐

给定一个单词数组和一个长度 maxWidth，重新排版单词，使其成为每行恰好有 maxWidth 个字符，且左右两端对齐的文本。

你应该使用“贪心算法”来放置给定的单词；也就是说，尽可能多地往每行中放置单词。必要时可用空格 ' ' 填充，使得每行恰好有 maxWidth 个字符。

要求尽可能均匀分配单词间的空格数量。如果某一行单词间的空格不能均匀分配，则左侧放置的空格数要多于右侧的空格数。

文本的最后一行应为左对齐，且单词之间不插入额外的空格。

说明:
单词是指由非空格字符组成的字符序列。
每个单词的长度大于 0，小于等于 maxWidth。
输入单词数组 words 至少包含一个单词。

*/
const fullJustify = (words, maxWidth) => {
    const ans = [];
    let right = 0,
        n = words.length;
    while (true) {
        const left = right; // 当前行的第一个单词在 words 的位置
        let sumLen = 0; // 统计这一行单词长度之和
        while (
            right < n &&
            sumLen + words[right].length + right - left <= maxWidth
        ) {
            sumLen += words[right].length;
            right++;
        }

        // 当前行是最后一行：单词左对齐，且单词之间应只有一个空格，在行末填充剩余空格
        if (right === n) {
            const s = words.slice(left).join(" ");
            ans.push(s + blank(maxWidth - s.length));
            break;
        }
        const numWords = right - left;
        const numSpaces = maxWidth - sumLen;

        // 当前行只有一个单词：该单词左对齐，在行末填充空格
        if (numWords === 1) {
            ans.push(words[left] + blank(numSpaces));
            continue;
        }

        // 当前行不只一个单词
        const avgSpaces = Math.floor(numSpaces / (numWords - 1));
        const extraSpaces = numSpaces % (numWords - 1);
        const s1 = words
            .slice(left, left + extraSpaces + 1)
            .join(blank(avgSpaces + 1)); // 拼接额外加一个空格的单词
        const s2 = words
            .slice(left + extraSpaces + 1, right)
            .join(blank(avgSpaces)); // 拼接其余单词
        ans.push(s1 + blank(avgSpaces) + s2);
    }
    return ans;
};

const blank = (n) => {
    return new Array(n).fill(" ").join("");
};
