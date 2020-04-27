
export class Task {
  public state: string = 'resolved'
  resolve: (value?: {} | PromiseLike<{}> | undefined) => any = Promise.resolve
  reject:  (reason?: any) => void = Promise.reject
  async init() {
    if (this.state !== 'pending') {
      this.state = 'pending'
      return new Promise((resolve, reject)=> {
        this.resolve = () => {
          this.state = 'resolved'
          resolve()
        }
        this.reject =  () => {
          this.state = 'rejected'
          reject()
        }
      })
    } else {
      throw new Error('有任务正在执行, 请先调用实例方法resolve/reject结束它')
    }
  }
}

export const execHook = async (source: anyObject, hook: string, ...rest: any[]) => {
  source.state = hook
  if (typeof source[hook] === 'function') {
    await source[hook](...rest)
  }
}