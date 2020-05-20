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
      moveSpeedX: -3,
      die: {
        state: 0
      }
    },
    async beforeDie() {
      // @ts-ignore
      const self: Model = this
      const die = self.personal.die
      if (die.state === 0) {
        let lostHead = await self.gifs.lostHead.currentImg()
        lostHead && self.scene.context.drawImage(lostHead, self.x, self.y, lostHead.width, lostHead.height)
        let head = await self.gifs.head.currentImg()
        head && self.scene.context.drawImage(head, self.x + head.width / 2, self.y, head.width, head.height)
        if (self.gifs.lostHead.length === self.gifs.lostHead.index + 1) {
          die.state += 1
        }
      } else if(die.state === 1) {
        if (self.target) {
          let img = await self.gifs.lostHeadAttack.currentImg()
          img && self.scene.context.drawImage(img, self.x, self.y, img.width, img.height)
          if (self.gifs.lostHeadAttack.length === self.gifs.lostHeadAttack.index + 1) {
            die.state += 1
          }
        } else{
          die.state += 1
        }
      } else if (die.state === 2){
        let img = await self.gifs.die.currentImg()
        img && self.scene.context.drawImage(img, self.x, self.y, img.width, img.height)
        if (self.gifs.die.length === self.gifs.die.index + 1) {
          die.state += 1
          self.die = true
        }
      }
    }
  },
  ConeheadZombie: {
    level: 1,
    personal: {
      moveSpeedX: -5
    },
    medias: {
      attack: '${name}/${name}Attack.gif'
    }
  }
})

for(let key in options) {
  if (options.hasOwnProperty(key)) {
    options[key] = Object.assign({
      akSpeed: 3e3,
      restore() {
        // @ts-ignore
        const self: Model = this
        if (!self.die && !self.dying && self.target && self.target.hp <= 0) {
          self.pending = false
          self.moveSpeedX = (self.personal || self).moveSpeedX
          self.gif = self.gifs.default
          self.target = null
        }
      },
      async draw(...rest: any[]) {
        // @ts-ignore
        const self: Model = this
        if (!self.dying && self.gif) {
          let img = await self.gif.currentImg(self.static)
          img && self.scene.context.drawImage(img, self.x, self.y, self.width, self.height)
        } else {
          !self.die && self.beforeDie()
        }
      },
      async destory() {
        // @ts-ignore
        const self: Model = this
        self.attackAble = false
        self.dying = true
        self.gif = null
      },
      async attack(com: Model) {
        // @ts-ignore
        const self: Model = this
        // self.pending = true
        if (self.dying) {
          return
        }
        self.moveSpeedX = 0
        if (self.gifs.attack) {
          self.target = com
          self.gif = self.gifs.attack
          // let img = await self.gifs.attack.currentImg()
          // img && self.scene.context.drawImage(img, self.x, self.y, self.width, self.height)
        }
        const now = +new Date
        if (!self.attackTime || now - self.akSpeed > self.attackTime) {
          self.attackTime = now
          self.setAttackResult(com)
        }
      }
    }, options[key])
  }
}
const zombie = {
  path,
  name,
  list,
  options
}
export default zombie