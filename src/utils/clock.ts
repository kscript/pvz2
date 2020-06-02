// 手动时间控制
export class Clock {
    private start: number
    private interval: number
    private timeOut: Function
    private changed: boolean
    public id: string = ''
    constructor(start: number, interval: number, timeOut: Function) {
        this.start = start
        this.interval = interval
        this.timeOut = timeOut
        this.changed = false
        this.id = (~~(Math.random() * 1e9)).toString(36)
    }
    assess() {
        const time = +new Date
        if (time >= this.start + this.interval) {
            this.timeOut()
            this.start = time
        }
    }
    change(interval: number) {
        this.changed = true
        this.interval = interval
    }
}
export default Clock