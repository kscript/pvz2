import { replaceTpl } from '@/utils'

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
const plant = {
  path,
  name,
  list,
  options
}
export default plant