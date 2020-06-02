import Model from '@/com/model'

export class Control {
  public queue: Function[][] = []
  public index = 0
  public eveny: Function | void
  public paused: boolean = false
  public id: string = ''
  public source: Model
  constructor(source: Model, eveny?: Function) {
    this.source = source
    this.eveny = eveny
    this.id = (~~(Math.random() * 1e9)).toString(36)
  }
  pause() {
    this.paused = true
    return this
  }
  play() {
    this.paused = false
    return this
  }
  async exec(...rest: any[]) {
    if (this.paused || this.eveny && this.eveny(this, ...rest) === false) {
      return
    }
    const current = this.queue[this.index] || []
    const exec = current[0]
    return exec && await exec(...rest)
  }
  add(fn: Function, done: Function = () => {}) {
    return this.queue.push([fn, done])
  }
  batch(func: (control: Control) => Function[][]) {
    this.queue.push.apply(this.queue, func(this))
    return this
  }
  async next() {
    const current = this.queue[this.index]
    if (current[1]) {
      await current[1]()
    }
    this.index++
  }
}
export default Control