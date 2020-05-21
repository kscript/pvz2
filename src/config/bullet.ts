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
    medias: {
      hit: 'PeaBulletHit.gif'
    },
    attackMoveX: 50,
    async beforeDie(){
      if (this.gifs.hit.length < 2) {
        this.hide(this.gifs.hit, void 0, .25)
      } else {
        if (this.gifs.hit.length > this.gifs.hit.index + 1) {
          let img = await this.gifs.hit.currentImg()
          img && this.scene.context.drawImage(img, this.x, this.y, img.width, img.height)
        } else {
          this.hide()
        }
      }
    },
    async draw() {
      if (!this.dying) {
        if (this.gif) {
          if (this.pending) {
  
          } else {
            this.x += this.attackMoveX
            this.y += this.attackMoveY
          }
          let img = await this.gif.currentImg()
          img && this.scene.context.drawImage(img, this.x, this.y, this.width, this.height)
        }
      } else {
        await this.beforeDie()
      }
      if (this.die || this.x > this.scene.config.width) {
        this.source.dumpBullet(this)
      }
    },
    attack(com: Model) {
      this.pending = true
      this.dying = true
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