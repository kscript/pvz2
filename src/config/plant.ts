import { mergeOptions } from '@/utils/model'

const path = './images/Plants/'
const name = '${name}/0.gif'
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

const options: anyObject = mergeOptions(path, name, list, {})
const plant = {
  path,
  name,
  list,
  options
}
export default plant