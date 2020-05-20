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
export default {
  execHook,
  isEmpty
}