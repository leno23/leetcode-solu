function shift_and(text, pattern) {
    if (pattern == "") return 0;
    let code = Array(256).fill(0);
    let n = 0;
    for (; pattern[n]; n++) code[pattern[n].charCodeAt()] |= 1 << n;
    let p = 0;
    function getNextP(ch, code, p) {
        return ((p << 1) | 1) & code[ch];
    }
    for (let i = 0; text[i]; i++) {
        p = getNextP(text[i].charCodeAt(), code, p);
        if (p & (1 << (n - 1))) return i - n + 1;
    }
    return -1;
}
