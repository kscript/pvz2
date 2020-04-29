import { replaceTpl } from '@/utils'
import Model from '@/com/model';

const path = './images/interface/'
const name = '${name}'
const list: string[] = [
  // 游戏场景
  'background1.jpg',
  'background1unsodded.jpg',
  'background1unsodded_1.jpg',
  'background1unsodded2.jpg',
  'background2.jpg',
  'background3.jpg',
  'background4.jpg',
  'background5.jpg',
  'background6boss.jpg',
  // 戴夫
  'Dave.gif',
  'Dave2.gif',
  'Dave3.gif',
  // 菜单背景
  'Surface.jpg',
  // 向日葵
  'Sunflower_trophy8.png',
  // 阳光
  'Sun.gif',
  // 商店
  'SelectorScreen_Store.png',
  // 花园
  'SelectorScreen_ZenGarden.png',
  // 图鉴
  'SelectorScreen_Almanac.png',
  // logo
  'popcap_logo.png',
  // loading
  'SodRollCap.png',
  'LoadBar.png'
]
const mergeOptions = (options: anyObject) => {
  list.forEach(item => {
    if (!(options[item] instanceof Object)) {
      options[item] = {}
    }
    options[item].image = Object.assign({
      path,
      name: replaceTpl(name, {
        name: item
      })
    }, options[item].image instanceof Object ? options[item].image : {})
  })
  return options
}
const options: anyObject = mergeOptions({
  'popcap_logo.png': {
    async draw() {
      let iw = this.img.width
      let ih = this.img.height
      let sw = this.scene.config.width
      let sh = this.scene.config.height
      return new Promise(resolve => {
        let opacity = 0
        const animate = () => {
          this.scene.clearCanvas()
          this.context.globalAlpha = opacity += .01
          this.context.drawImage(this.img, (sw - iw) / 2, (sh - ih) / 2 , iw, ih)
          if (opacity < .95) {
            setTimeout(animate, 50)
          } else {
            this.scene.clearCanvas()
            resolve()
          }
        }
        animate()
      })
    }
  },
  'Surface.jpg': {
    draw() {
      let w = this.scene.config.width
      let h = this.scene.config.height
      this.context.drawImage(this.img, 0, 0, w, h)
    }
  },
  'SodRollCap.png': {
    draw(rate: number, LoadBar: Model) {
      let offsetY = 200
      let x = this.scene.config.width / 2
      let y = this.scene.config.height / 2 + offsetY
      let lw = ~~(LoadBar.width * rate / 100)
      this.context.save()
      this.context.translate(x + lw - LoadBar.width / 2 - 10, y - LoadBar.height / 2 + 10)
      this.context.rotate(rate * 10.8 * Math.PI / 180)
      this.context.drawImage(this.img, -this.width / 2, -this.height / 2)
      this.context.restore()
    }
  },
  'LoadBar.png': {
    hitAble: true,
    draw(rate: number) {
      let offsetY = 200
      let x = this.scene.config.width / 2
      let y = this.scene.config.height / 2 + offsetY
      let lw = ~~(this.width * rate / 100)
      // 如果需要进行碰撞检测的话, 每次画之前要设置好左上角
      this.x = x - this.width / 2
      this.y = y - this.height / 2
      this.context.drawImage(this.img, 0, 0, lw, this.height, x - this.width / 2, y - this.height / 2, lw, this.height)
      this.context.globalAlpha = .4
      this.context.drawImage(this.img, x - this.width / 2, y - this.height / 2)
      this.context.globalAlpha = 1
    }
  }
})
const menu = {
  path,
  name,
  list,
  options
}
export default menu