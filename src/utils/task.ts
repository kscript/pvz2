
export class Task {
  public state: string = 'resolved'
  resolve: (value?: {} | PromiseLike<{}> | undefined) => any = Promise.resolve
  reject:  (reason?: any) => void = Promise.reject
  public name: string = ''
  async init(name: string) {
    this.name = name
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
export default Task