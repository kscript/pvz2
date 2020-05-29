import Model from "@/com/model"
interface Options {
    once?: boolean
    // 所有步骤调用完(或到达指定结束点)后的回调, once为false时, 继续调用next时也会触发回调
    done?: Function
    // 每次exec被调用前都会被调用的函数
    every?: Function
}
export class Control {
    private source: Model
    private options: Options
    private step: string[] = []
    private stepMap: anyObject<anyObject<Function>> = {}
    private active: string = ''
    private index: number = 0
    private tid: number = 0
    private complete: boolean = false
    private endName: string = ''
    constructor(source: Model,  options: Options = {}) {
        this.source = source
        this.options = options
    }
    get current() {
        return this.stepMap[this.step[this.index]]
    }
    /**
     * 添加一个步骤
     * @param name 步骤名
     * @param exec 处于当前步骤时执行的方法
     * @param done 当前步骤被完成后执行的方法
     * @param over 同名是否覆盖
     */
    add(name: string, exec: Function = () => {}, done: Function = () => {}, over: boolean = true) {
        if (over && this.stepMap[name]) {
            console.log('存在同名步骤, 原有步骤将被覆盖')
        }
        this.tid++
        if (!name) {
            name = 'step' + this.tid
        }
        this.stepMap[name] = {
            exec,
            done
        }
        this.step.push(name)
        return name
    }
    remove(name: string) {
        if (this.stepMap[name]) {
            let index = this.step.indexOf(name)
            this.step.splice(index, 1)
            delete this.stepMap[name]
            return true
        }
        return false
    }
    gotoName(name: string) {
        if (this.stepMap[name]) {
            let index = this.step.indexOf(name)
            if (index >= 0) {
                this.active = name
                this.index = index
                return
            }
        }
        console.log('未找到步骤' + name)
    }
    gotoIndex(index: number) {
        index = ~~index
        if (index >= 0 && this.index + index < this.step.length){
            this.index += index
            this.active = this.step[this.index]
        } else if(index < 0 && this.index + index >= 0){
            this.index += index
            this.active = this.step[this.index]
        } else {
            console.log('index值' + index + '无效, 不能跳转到' + (this.index + index))
        }
    }
    // 手动设置结束点
    end(name: string) {
        this.endName = name
    }
    // 将complete状态重新置为false
    incompleted() {
        this.complete = false
    }
    async done() {
        if (this.options.done) {
            return await this.options.done()
        }
    }
    // 当前步骤调用完时, 手动调用下一步
    async next() {
        if (this.complete) {
            if (!this.options.once) {
                await this.done()
            }
            return
        }
        await this.current.done()
        this.index++
        if (this.index >= this.step.length || this.endName === this.step[this.index]) {
            this.complete = true
            await this.done()
        }
    }
    // 执行当前步骤
    async exec(...rest: any[]) {
        if (this.complete) return
        if (this.options.every && this.options.every() !== false) {
            return await this.current?.exec(...rest)
        }
    }
}
export default Control