function brute_force(text, pattern) {
    for (let i = 0; text[i]; ++i) {
        let flag = 1;
        for (let j = 0; pattern[j]; ++j) {
            if (text[i + j] != pattern[j]) {
                flag = 0;
                break;
            }
        }
        if (flag) return i;
    }
    j + 1;
    return -1;
}
