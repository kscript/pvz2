import { mergeOptions } from '@/utils/model'
import Model from '@/com/model'

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
    hp: 150,
    dfe: 11,
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
      die: {
        state: 0
      }
    },
    async beforeDie() {
      const die = this.personal.die
      if (die.state === 0) {
        let lostHead = await this.gifs.lostHead.currentImg()
        lostHead && this.scene.context.drawImage(lostHead, this.x, this.y, lostHead.width, lostHead.height)
        let head = await this.gifs.head.currentImg()
        head && this.scene.context.drawImage(head, this.x + head.width / 2, this.y, head.width, head.height)
        if (this.gifs.lostHead.length === this.gifs.lostHead.index + 1) {
          die.state += 1
        }
      } else if(die.state === 1) {
        if (this.target) {
          let img = await this.gifs.lostHeadAttack.currentImg()
          img && this.scene.context.drawImage(img, this.x, this.y, img.width, img.height)
          if (this.gifs.lostHeadAttack.length === this.gifs.lostHeadAttack.index + 1) {
            die.state += 1
          }
        } else{
          die.state += 1
        }
      } else if (die.state === 2){
        let img = await this.gifs.die.currentImg()
        img && this.scene.context.drawImage(img, this.x, this.y, img.width, img.height)
        if (this.gifs.die.length === this.gifs.die.index + 1) {
          die.state += 1
          this.die = true
        }
      }
    }
  },
  ConeheadZombie: {
    level: 1,
    hp: 200,
    dfe: 12,
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
  restore() {
    if (!this.die && !this.dying && this.target && this.target.hp <= 0) {
      this.pending = false
      this.moveSpeedX = (this.personal || this).moveSpeedX
      this.gif = this.gifs.default
      this.target = null
    }
  },
  async beforeDie() {
    this.die = true
  },
  async draw(...rest: any[]) {
    if (!this.dying && this.gif) {
      let img = await this.gif.currentImg(this.static)
      img && this.scene.context.drawImage(img, this.x, this.y, this.width, this.height)
    } else {
      this.beforeDie()
    }
  },
  async destory() {
    this.attackAble = false
    this.dying = true
    this.gif = null
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
      this.setAttackResult(com)
    }
  }
}

for(let key in options) {
  if (options.hasOwnProperty(key)) {
    options[key] = Object.assign({}, baseOption, options[key])
  }
}
console.log(options)
const zombie = {
  path,
  name,
  list,
  options
}
export default zombie