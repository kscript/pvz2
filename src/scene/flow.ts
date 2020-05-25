import Scene from '.'
import { sendMessage } from '@/utils/message'
import { rand } from '@/utils'

export class Flow {
    public scene: Scene
    public time: number = +new Date
    public step: (string | number)[][] = []
    public index: number = 0
    public complete: boolean = false
    public paused: boolean = false
    public stopTime: number = 0
    public stopTimeCount: number = 0
    public sunRefreshTime: number = 0
    constructor(scene: Scene, step: (string | number)[][], options: anyObject) {
        this.scene = scene
        this.step = step
    }
    stop(time: number) {
        this.stopTime = time || +new Date
    }
    play(time: number) {
        time = time || +new Date
        this.stopTimeCount += time - this.stopTime
    }
    refreshSun() {
        const time = rand(25, 45) * 1e3
        setTimeout(() =>{
            if (!this.scene.stop && !this.complete) {
                this.sunRefreshTime = +new Date
                this.scene.mountSun()
                this.refreshSun()
            }
        }, time)
    }
    init() {
        this.scene.toggleMusic('./sound/Mountains.mp3', false)
        this.scene.comGroup.zombies.splice(0).map(com => {
            this.scene.dumpCom(com)
        })
        this.refreshSun()
    }
    refresh() {
        const now = +new Date
        const curr = this.step[this.index]
        if (curr && curr.length) {
            if (now - this.time - this.stopTimeCount > curr[0]) {
                if (this.index === 1) {
                    this.scene.toggleMusic('./sound/awooga.mp3', false)
                }
                if(typeof curr[1] === 'string') {
                    sendMessage(curr[1], {
                        type: 'Flow::refresh',
                        source: this
                    })
                } else {
                    this.scene.mountGameZombies(...curr.slice(1) as number[])
                }
                this.index++
            }
        } else if (this.index > 0 && this.scene.comGroup.zombies.length === 0) {
            this.complete = true
            this.scene.gameover(true)
        }
    }
}
export default Flow