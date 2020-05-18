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
    level: 1
  },
  ConeheadZombie: {
    level: 1
  }
})

for(let key in options) {
  if (options.hasOwnProperty(key)) {
    options[key] = Object.assign({
      moveSpeedX: -.5,
      attack(com: Model) {
        // @ts-ignore
        this.pending = true
        this.moveSpeedX = 0
        console.log(this, com)
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