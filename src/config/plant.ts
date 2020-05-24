import { mergeOptions } from '@/utils/model'
import Model from '@/com/model'

const path = './images/Plants/'
const name = '${name}/${name}.gif'
const list: string[] = [
  // 'Blover',
  // 'Cactus',
  // 'CherryBomb',
  // 'Chomper',
  // 'CoffeeBean',
  // 'DoomShroom',
  // 'FlowerPot',
  // 'FumeShroom',
  // 'Garlic',
  // 'GatlingPea',
  // 'GloomShroom',
  // 'GraveBuster',
  // 'HypnoShroom',
  // 'IceShroom',
  // 'Jalapeno',
  // 'LilyPad',
  'Peashooter',
  // 'Plantern',
  // 'PotatoMine',
  // 'PuffShroom',
  // 'PumpkinHead',
  // 'Repeater',
  // 'ScaredyShroom',
  // 'SeaShroom',
  // 'SnowPea',
  // 'Spikerock',
  // 'Spikeweed',
  // 'SplitPea',
  // 'Squash',
  // 'Starfruit',
  'SunFlower',
  // 'SunShroom',
  // 'TallNut',
  // 'TangleKlep',
  // 'Threepeater',
  // 'Torchwood',
  // 'TwinSunflower',
  // 'WallNut'
]

const cardSelect = (com: Model, type: string, event: MouseEvent) => {
  const state = com.scene.state
  if (state === 'startGame') {
    if (type === 'click') {
      if(!com.scene.dragCom.com && com.type === 'card') {
        com.scene.dragStart(com, event)
      }
    }
    else if (type === 'mouseup') {
      if(com.scene.dragCom.com) {
        com.scene.dragEnd(com.scene.dragCom.com, event)
      }
    }
  }
}
const cradDrag = (com: Model, event: MouseEvent, oldEvent: MouseEvent) => {
  const dragCom = com.scene.dragCom
  if (dragCom.com) {
    com.x = dragCom.source.x + event.offsetX - oldEvent.offsetX 
    com.y = dragCom.source.y + event.offsetY - oldEvent.offsetY
  }
}
const options: anyObject = mergeOptions(path, name, list, {
  SunFlower: {
    async draw () {
      let img = await this.gif.currentImg()
      img && this.scene.context.drawImage(img, this.x, this.y, img.width, img.height)
      if (this.reload) {
        this.scene.context.fillStyle = 'rgba(0, 0, 0, .1)'
        this.scene.context.fillRect(this.x, this.y, img.width, img.height)
        this.scene.context.fillStyle = 'rgba(0, 0, 0, 0)'
      }
    }
  },
  Peashooter: {
    attackSpeed: 5e3,
    attackAble: true,
    bulletName: 'PB01',
    // medias: {
    //   attack: 'PB01.gif'
    // }
  }
})

const baseOption: anyObject = {
  trigger(type: string, event: MouseEvent) {
    cardSelect(this as Model, type, event)
  },
  drag(event: MouseEvent, oldEvent: MouseEvent) {
    cradDrag(this as Model, event, oldEvent)
  },
  async attack(com: Model) {
    const now = +new Date
    if (!this.attackTime || now - this.attackSpeed > this.attackTime) {
      this.target = com
      this.attackTime = now
      if (this.bulletName) {
        const bullet = this.scene.comMap[this.bulletName]
        // @ts-ignore
        const Bullet = bullet.__proto__.constructor
        const {
          x, y, width, pos, attackMoveX, attackMoveY
        } = this
        const bulletCopy = new Bullet(bullet.name, Object.assign({}, bullet.options, {
          target: com,
          x: x + width, y, pos, attackMoveX, attackMoveY, source: this
        }))
        await bulletCopy.init()
        this.scene.mountCom(bulletCopy)
        this.bullets.push(bulletCopy)
      } else {
        this.setAttackResult(com)
      }
    }
  }
}
for(let key in options) {
  if (options.hasOwnProperty(key)) {
    options[key] = Object.assign({}, baseOption, options[key])
  }
}
const plant = {
  path,
  name,
  list,
  options
}
export default plant