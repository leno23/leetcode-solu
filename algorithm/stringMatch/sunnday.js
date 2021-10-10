function sunday(text, pattern) {
    let n = text.length,
        m,
        last_pos = Array(256).fill(-1);
    for (m = 0; pattern[m]; ++m) last_pos[pattern[m].charCodeAt()] = m;
    for (
        let i = 0;
        i + m <= n;
        i += m - last_pos[text[i + m] ? text[i + m].charCodeAt() : 0]
    ) {
        let flag = 1;
        for (let j = 0; pattern[j]; ++j) {
            if (text[i + j] == pattern[j]) continue;
            flag = 0;
            break;
        }
        if (flag) return i;
    }
    return -1;
}
