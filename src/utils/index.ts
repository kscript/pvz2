export const execHook = async (source: anyObject, hook: string, ...rest: any[]) => {
  source.state = hook
  if (typeof source[hook] === 'function') {
    await source[hook](...rest)
  }
}
export const isEmpty = (obj: anyObject) => {
  for(let k in obj) {
    if (obj.hasOwnProperty(k)) {
      return false
    }
  }
  return true
}
export const rand = (min: number = 0, max: number = 4) => {
  if (max < min) {
    throw new Error('max应该大于min')
  }
  return ~~(Math.random() * (max - min + 1)) + ~~min
}
export const timeline = (start: number, end: number, change: number, delay: number) => {
  
}
export default {
  rand,
  execHook,
  isEmpty
}