import Scene from '.'
import { sendMessage } from '@/utils/message'

export class Flow {
    public scene: Scene
    public time: number = +new Date
    public step: (string | number)[][] = []
    public index: number = 0
    constructor(scene: Scene, step: (string | number)[][], options: anyObject) {
        this.scene = scene
        this.step = step
    }
    init() {
        this.scene.comGroup.zombies.splice(0).map(com => {
            this.scene.dumpCom(com)
        })
    }
    refresh() {
        const now = +new Date
        const curr = this.step[this.index]
        if (curr && curr.length) {
            if (now - this.time > curr[0]) {
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
            this.scene.gameover(true)
        }
    }
}
export default Flow