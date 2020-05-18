import { mergeOptions } from '@/utils/model'
import Model from '@/com/model'

const path = './images/Plants/'
const name = '${name}/${name}.gif'
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

const cardSelect = (com: Model, type: string, event: MouseEvent) => {
  const state = com.scene.state
  if (state === 'startGame') {
    if (type === 'click') {
      if(!com.scene.dragCom.com && com.type === 'card') {
        com.scene.dragStart(com, event)
      }
    }
    else if (type === 'mouseup') {
      if(com.scene.dragCom.com) {
        com.scene.dragEnd(com.scene.dragCom.com, event)
      }
    }
  }
}
const cradDrag = (com: Model, event: MouseEvent, oldEvent: MouseEvent) => {
  const dragCom = com.scene.dragCom
  if (dragCom.com) {
    com.x = dragCom.source.x + event.offsetX - oldEvent.offsetX 
    com.y = dragCom.source.y + event.offsetY - oldEvent.offsetY
  }
}
const options: anyObject = mergeOptions(path, name, list, {
})

for(let key in options) {
  if (options.hasOwnProperty(key)) {
    options[key] = Object.assign({
      trigger(type: string, event: MouseEvent) {
        // @ts-ignore
        cardSelect(this, type, event)
      },
      drag(event: MouseEvent, oldEvent: MouseEvent) {
        // @ts-ignore
        cradDrag(this, event, oldEvent)
      }
    }, options[key])
  }
}
const plant = {
  path,
  name,
  list,
  options
}
export default plant