import { mergeOptions } from '@/utils/model'
import Model from '@/com/model'

const path = './images/Plants/'
const name = '${name}.gif'
const list: string[] = [
  'PB01',
  'PB10',
  'PB-10'
]
const options: anyObject = mergeOptions(path, name, list, {
  PB01: {
    async draw() {
      if (this.gif) {
        if (this.pending) {

        } else {
          this.x += this.attackMoveX
          this.y += this.attackMoveY
        }
        let img = await this.gif.currentImg()
        img && this.scene.context.drawImage(img, this.x, this.y, this.width, this.height)
      }
    },
    attack(com: Model) {
      this.pending = true
      this.die = true
      this.setAttackResult(com)
    },
    restore() {}
  }
})
const bullet = {
  path,
  name,
  list,
  options
}
export default bullet