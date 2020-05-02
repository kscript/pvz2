export const execHook = async (source: anyObject, hook: string, ...rest: any[]) => {
  source.state = hook
  if (typeof source[hook] === 'function') {
    await source[hook](...rest)
  }
}

export default {
  execHook
}