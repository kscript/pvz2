import { mergeOptions } from '@/utils/model'
import Model from '@/com/model'

const path = './images/Plants/'
const name = '${name}/${name}.gif'
const list: string[] = [
  'Blover',
  'Cactus',
  'CherryBomb',
  'Chomper',
  'CoffeeBean',
  'DoomShroom',
  'FlowerPot',
  'FumeShroom',
  'Garlic',
  'GatlingPea',
  'GloomShroom',
  'GraveBuster',
  'HypnoShroom',
  'IceShroom',
  'Jalapeno',
  'LilyPad',
  'Peashooter',
  'Plantern',
  'PotatoMine',
  'PuffShroom',
  'PumpkinHead',
  'Repeater',
  'ScaredyShroom',
  'SeaShroom',
  'SnowPea',
  'Spikerock',
  'Spikeweed',
  'SplitPea',
  'Squash',
  'Starfruit',
  'SunFlower',
  'SunShroom',
  'TallNut',
  'TangleKlep',
  'Threepeater',
  'Torchwood',
  'TwinSunflower',
  'WallNut'
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
  Peashooter: {
    attackAble: true,
    bulletName: 'PB01',
    // medias: {
    //   attack: 'PB01.gif'
    // }
  }
})

for(let key in options) {
  if (options.hasOwnProperty(key)) {
    options[key] = Object.assign({
      trigger(type: string, event: MouseEvent) {
        // @ts-ignore
        cardSelect(this, type, event)
      },
      drag(event: MouseEvent, oldEvent: MouseEvent) {
        // @ts-ignore
        cradDrag(this, event, oldEvent)
      },
      async attack(com: Model) {
        // @ts-ignore
        const self: Model = this
        // const attack = self.gifs.attack
        const now = +new Date
        if (!self.attackTime || now - self.akSpeed > self.attackTime) {
          self.attackTime = now
          if (self.bulletName) {
            const bullet = self.scene.comMap[self.bulletName]
            // @ts-ignore
            const Bullet = bullet.__proto__.constructor
            const {
              x, y, width, pos, attackMoveX, attackMoveY
            } = self
            const bulletCopy = new Bullet(bullet.name, Object.assign({}, bullet.options, {
              x: x + width, y, pos, attackMoveX, attackMoveY, source: self
            }))
            await bulletCopy.init()
            self.scene.mountCom(bulletCopy)
            self.bullets.push(bulletCopy)
          } else {
            self.setAttackResult(com)
          }
        }
      }
    }, options[key])
  }
}
const plant = {
  path,
  name,
  list,
  options
}
export default plant