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
      async attack(com: Model) {
        // @ts-ignore
        const self: Model = this
        // self.pending = true
        self.moveSpeedX = 0
        if (self.gifs.attack) {
          self.gif = self.gifs.attack
          self.setAttackResult(com)
          // let img = await self.gifs.attack.currentImg()
          // img && self.scene.context.drawImage(img, self.x, self.y, self.width, self.height)
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