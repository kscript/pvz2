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
    attackMoveX: 100,
    async draw() {
      if (this.gif) {
        if (this.pending) {

        } else {
          this.x += this.attackMoveX
          this.y += this.attackMoveY
        }
        let img = await this.gif.currentImg()
        img && this.scene.selectContext(this).drawImage(img, this.x, this.y, this.width, this.height)
      }
    },
    async dieEffect(){
      if (this.gifs.hit.length < 2) {
        this.fadeOut(this.gifs.hit, void 0, .25)
      } else {
        if (this.gifs.hit.length > this.gifs.hit.index + 1) {
          let img = await this.gifs.hit.currentImg()
          img && this.scene.selectContext(this).drawImage(img, this.x, this.y, img.width, img.height)
        } else {
          this.fadeOut()
        }
      }
    },
    beforeDestroy() {
      this.source.dumpBullet(this)
    },
    attack(com: Model) {
      this.pending = true
      this.dying = true
      this.scene.toggleMusic('./sound/splat1.mp3', false)
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