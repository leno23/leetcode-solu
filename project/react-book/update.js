/* eslint-disable */
const effectStack = []
function useState(value) {
  const subs = new Set()
  function getter() {
    let effect = effectStack[effectStack.length - 1]
    if (effect) {
      subscribe(effect, subs)
    }
    return value
  }
  function setter(newVal) {
    value = newVal
    for (let eff of [...subs]) {
      eff.execute()
    }
  }
  return [getter, setter]
}

function useEffect(callback) {
  const execute = () => {
    cleanup(effect)
    effectStack.push(effect)
    try {
      callback()
    } finally {
      effectStack.pop()
    }
  }
  const effect = {
    execute,
    deps: new Set()
  }
  execute()
}
// 将某个effect移除掉
function cleanup(effect) {
  for (let dep of effect.deps) {
    dep.delete(effect)
  }
  effect.deps.clear()
}

function subscribe(effect, subs) {
  effect.deps.add(subs)
  subs.add(effect)
}

function useMemo(callback) {
  // 生成一个state
  const [s, set] = useState()
  // 执行callback触发依赖收集，让他依赖的state订阅一个setter的effect
  useEffect(() => set(callback()))
  // 最终返回getter
  return {
    get value() {
      return s()
    }
  }
}

const [num, setNum] = useState(1)
useEffect(() => {
  console.log(num())
})
const computed = useMemo(() => num() * 2)
console.log(computed.value)
setNum(2)
