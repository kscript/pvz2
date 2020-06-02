import { mergeOptions } from '@/utils/model'
import Model from '@/com/model'
import Control  from '@/utils/control'
import { Clock } from '@/utils/clock'
import { rand } from '@/utils'
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
    sun: 50,
    sunSpeed: 2.5e4,
    medias: {
      head: '${name}/SunFlower1.gif'
    },
    initControl() {
      const newClock = (control: Control, time: number) => {
        return new Clock(+new Date, time, () => {
          control.next()
        })
      }
      const drawControl = new Control(this, () => {
        this.drawCard()
        if (this.type !== 'plant') {
          return false
        }
      }).batch(control => {
        let opacity = 0
        let sunEndClock: Clock | null
        const start = this.sunSpeed + rand(0, 5e3) - 2.5e3
        let sunClock = newClock(control, start)
        const plant = () => {
          sunClock.assess()
        }
        const plantDone = () => {
          sunClock = newClock(control, this.sunSpeed + rand(0, 5e3) - 2.5e3)
        }
        const beforeSun = async () => {
          // opacity为0时, gif的index应该也是0, 如果不是, 那么跳过
          if (!opacity && this.gif.index) {
            return
          }
          opacity += .025
          opacity = opacity > 1 ? 1 : opacity
          let img = await this.gifs.head.currentImg(false, this.gif.index)
          const context = this.scene.selectContext(this)
          context.globalAlpha = opacity
          context.drawImage(img, this.x, this.y, this.gifs.head.width, this.gifs.head.height)
          context.globalAlpha = 1
          if (this.gif.index === this.gif.length - 1) {
            control.next()
          }
        }
        const beforeSunDone = () => {
          opacity = 0
        }
        const mountSun = async () => {
          if (!sunEndClock) {
            sunEndClock = newClock(control, 5e3)
            const sun = this.scene.mountSun({
              x: this.x,
              y: this.y,
              personal: {
                coords: {
                  x: this.x,
                  y: this.y
                },
                end: {
                  x: this.x + this.width,
                  y: this.y + this.height / 2
                },
                easing: ''
              }
            })
            sun.source = this
          }
          sunEndClock.assess()
        }
        const mountSunDone = () => {
          sunEndClock = null
          control.index = -1
        }
        return [
          [plant, plantDone],
          [beforeSun, beforeSunDone],
          [mountSun, mountSunDone]
        ]
      })
      return {
        drawControl
      }
    },
    async draw() {
      this.controls.drawControl?.exec()
    }
  },
  Peashooter: {
    sun: 100,
    attackSpeed: 3e3,
    attackMoveX: 12,
    attackAble: true,
    bulletName: 'PB01',
    // medias: {
    //   attack: 'PB01.gif'
    // }
  }
})

const baseOption: anyObject = {
  draw() {
    this.drawCard()
  },
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