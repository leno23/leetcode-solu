require('readline').createInterface(process.stdin, process.stdout).on('line', line => {
    if (line) {
        let d = Array(100).fill(0)
        let tmp = 1
        for (let i = 1; i <= 100; i++) {
            tmp *= i
            d[i - 1] = tmp
        }
        // 组合数Cab
        // C42 = 4*3*2*1/(2*1)*(2*1) 
        function comb(a, b) {
            if (a == b) return 1
            return d[a - 1] / d[a - b - 1] / d[b - 1]
        }
        let m = new Map()
        for (let x of line) {
            m.set(x, (m.get(x) || 0) + 1)
        }
        let ret = 1, n = line.length
        for (let x of m.values()) {
            ret *= comb(n, x)
            n -= x
        }
        console.log(ret)
        process.exit()
    }

})