#include <bits/stdc++.h>
#define rep(i, n) for (int i = 0; i < (n); ++i)

using std::cin;
using std::cout;
using std::max;
using std::vector;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n);
    rep(i, n) cin >> a[i];

    int mx = 0, sum = 0;
    rep(i, n) {
        mx = max(mx, a[i]);
        sum += a[i];
    }

    if (mx == 0) {
        puts("0");
        return;
    }

    auto check = [&](int y) {
        int tsum = 0;
        rep(i, n) {
            tsum += a[i];
            if (tsum == y) { // 当前 + a[i] = y
                tsum = 0;
            }
            else if (tsum > y) { // 当前 + a[i] > y 说明不能合并为石子数量全为 y 的石子堆
                return false;
            }
        }
        return true;
    };

    // 枚举 y 
    for (int y = mx; y <= sum; ++y) {
        if (sum % y == 0) { // 判断 y 是否是 sum 的因子
            if (check(y)) {
                cout << n - sum/y << '\n';
                return;
            }
        }
    }
}

int main() {
    int t;
    cin >> t;

    while (t--) solve();

    return 0;
}