import { mergeOptions } from '@/utils/model'
import Model from '@/com/model'

const path = './images/Zombies/'
const name = '${name}/${name}.gif'
const list: string[] = [
  'BackupDancer',
  'BucketheadZombie',
  'ConeheadZombie',
  'DancingZombie',
  'FlagZombie',
  'FootballZombie',
  'Imp',
  'JackinTheBoxZombie',
  'NewspaperZombie',
  'PoleVaultingZombie',
  'ScreenDoorZombie',
  'SnorkelZombie',
  'Zombie',
  'Zomboni'
]
const options: anyObject = mergeOptions(path, name, list, {
  Zombie: {
    level: 1,
    medias: {
      attack: '${name}/${name}Attack.gif'
    }
  },
  ConeheadZombie: {
    level: 1,
    medias: {
      attack: '${name}/${name}Attack.gif'
    }
  }
})

for(let key in options) {
  if (options.hasOwnProperty(key)) {
    options[key] = Object.assign({
      moveSpeedX: -.5,
      akSpeed: 3e3,
      restore() {
        // @ts-ignore
        const self: Model = this
        if (self.target && self.target.hp <= 0) {
          self.pending = false
          self.moveSpeedX = -.5
          self.gif = self.gifs.default
          self.target = null
        }
      },
      async attack(com: Model) {
        // @ts-ignore
        const self: Model = this
        // self.pending = true
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