import { mergeOptions } from '@/utils/model'

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
const options: anyObject = mergeOptions(path, name, list, {})
const zombie = {
  path,
  name,
  list,
  options
}
export default zombie