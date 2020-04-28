import { replaceTpl } from '@/utils'

const path = './images/Zombies/'
const name = '${name}/0.gif'
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
const options: anyObject = mergeOptions({})
const zombie = {
  path,
  name,
  list,
  options
}
export default zombie