import { mergeOptions } from '@/utils/model'
import Model from '@/com/model'
import Control  from '@/utils/control'

const path = './images/Zombies/'
const name = '${name}/${name}.gif'
const list: string[] = [
  // 'BackupDancer',
  // 'BucketheadZombie',
  'ConeheadZombie',
  // 'DancingZombie',
  // 'FlagZombie',
  // 'FootballZombie',
  // 'Imp',
  // 'JackinTheBoxZombie',
  // 'NewspaperZombie',
  // 'PoleVaultingZombie',
  // 'ScreenDoorZombie',
  // 'SnorkelZombie',
  'Zombie',
  // 'Zomboni'
]
const options: anyObject = mergeOptions(path, name, list, {
  Zombie: {
    hp: 80,
    dfe: 10,
    level: 1,
    medias: {
      die: '${name}/${name}Die.gif',
      lostHead: '${name}/${name}LostHead.gif',
      lostHeadAttack: {
        name: '${name}/${name}LostHeadAttack.gif',
        path: '',
        options: {
          fps: 6
        }
      },
      head: {
        name: '${name}/${name}Head.gif',
        options: {
          once: true
        }
      },
      attack: '${name}/${name}Attack.gif'
    },
    personal: {
      moveSpeedX: -5,
      img: null,
      dieState:  0
    },
    initControl() {
      return {
        die: new Control().batch((control) => {
          const lostHeadAttack = async () => {
            if (this.target) {
              let head = await this.gifs.head.currentImg()
              head && this.scene.context.drawImage(head, this.x + head.width / 2, this.y, head.width, head.height)
              let img = await this.gifs.lostHeadAttack.currentImg()
              img && this.scene.context.drawImage(img, this.x, this.y, img.width, img.height)
              if (this.gifs.lostHeadAttack.length === this.gifs.lostHeadAttack.index + 1) {
                control.next()
              }
            } else{
              control.next()
            }
          }
          const lostHead = async () => {
            let lostHead = await this.gifs.lostHead.currentImg()
            lostHead && this.scene.context.drawImage(lostHead, this.x, this.y, lostHead.width, lostHead.height)
            if (this.gifs.lostHead.length === this.gifs.lostHead.index + 1) {
              control.next()
            }
          }
          const die = async () => {
            let img = await this.gifs.die.currentImg()
            img && this.scene.context.drawImage(img, this.x, this.y, img.width, img.height)
            if (this.gifs.die.index === this.gifs.die.length - 1) {
              this.personal.img = img
              this.fadeOut(void 0, img)
              control.next()
            }
          }
          return [
            [lostHeadAttack],
            [lostHead],
            [die]
          ]
        })
      }
    },
    async dieEffect() {
      this.controls.die?.exec()
    }
  },
  ConeheadZombie: {
    level: 1,
    hp: 95,
    dfe: 11,
    personal: {
      moveSpeedX: -7
    },
    medias: {
      attack: '${name}/${name}Attack.gif'
    }
  }
})

const baseOption: anyObject = {
  attackSpeed: 3e3,
  personal: {
    opacity: 1
  },
  restore() {
    if (!this.die && !this.dying && this.target && this.target.hp <= 0) {
      this.pending = false
      this.moveSpeedX = (this.personal || this).moveSpeedX
      this.gif = this.gifs.default
      this.target = null
    }
  },
  async draw(...rest: any[]) {
    if (this.gif) {
      let img = await this.gif.currentImg(this.static)
      img && this.scene.context.drawImage(img, this.x, this.y, this.width, this.height)
    }
  },
  async attack(com: Model) {
    if (this.dying) {
      return
    }
    this.moveSpeedX = 0
    if (this.gifs.attack) {
      this.target = com
      this.gif = this.gifs.attack
      // let img = await this.gifs.attack.currentImg()
      // img && this.scene.context.drawImage(img, this.x, this.y, this.width, this.height)
    }
    const now = +new Date
    if (!this.attackTime || now - this.attackSpeed > this.attackTime) {
      this.attackTime = now
      const sound = this.scene.toggleMusic('./sound/chomp.mp3', false)
      this.setAttackResult(com)
    }
  }
}

for(let key in options) {
  if (options.hasOwnProperty(key)) {
    const personal = Object.assign({}, baseOption.personal || {}, options[key].personal || {})
    options[key] = Object.assign({}, baseOption, options[key], {
      personal
    })
  }
}
const zombie = {
  path,
  name,
  list,
  options
}
export default zombie