import { replaceTpl } from '@/utils'
import Model from '@/com/model';

const path = './images/interface/'
const name = '${name}'
const list: string[] = [
  // 游戏场景
  'background1.jpg',
  'background1unsodded.jpg',
  'background1unsodded_1.jpg',
  'background1unsodded2.jpg',
  'background2.jpg',
  'background3.jpg',
  'background4.jpg',
  'background5.jpg',
  'background6boss.jpg',
  // 戴夫
  'Dave.gif',
  'Dave2.gif',
  'Dave3.gif',
  // 菜单背景
  'Surface.jpg',
  // 向日葵
  'Sunflower_trophy8.png',
  // 阳光
  'Sun.gif',
  // 商店
  'SelectorScreen_Store.png',
  // 花园
  'SelectorScreen_ZenGarden.png',
  // 图鉴
  'SelectorScreen_Almanac.png',
  // 冒险
  'SelectorScreenAdventure.png',
  // 解密
  'SelectorScreenChallenges.png',
  // 小游戏
  'SelectorScreenSurvival.png',
  // 开始游戏
  'SelectorScreenStartAdventur.png',

  // logo
  'popcap_logo.png',
  // loading
  'SodRollCap.png',
  'SodRoll.png',
  'LoadBar.png',
  
  'ZombieHand.png',
  'Tombstone_mounds.png'
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
const conf: anyObject = {
  // 菜单项起始位置坐标与场景中尺寸的比例
  // 游戏模式选项
  mod: {
    sx: .535,
    sy: .12,
    // col间距
    sc: 0,
    // row间距
    sr: .13
  },
  // 底部功能选项
  function: {
    sx: .25,
    sy: .75,
    sc: .15,
    sr: 0
  }
}
const getProps = (com: Model) => {
  let type = com.ctype
  let scene = com.scene
  let w = scene.config.width
  let h = scene.config.height
  let info = conf[type] || {}
  let x = w * info.sx
  let y = h * info.sy
  let c = w * info.sc
  let r = h * info.sr
  return { scene, w, h, info, x, y, r, c }
}
const menus: anyObject = {
  selected: null,
  index: 0
}
const menuTrigger = (com: Model, type: string, event?: Event) => {
  if (com.scene.state !== 'mount' || menus.index === com.index) {
    return 
  }
  if (type === 'click'){
    com.scene.container.style.cursor = 'pointer'
    com.startY = .5
    com.draw()
    if (com.name === 'SelectorScreenStartAdventur.png') {
      let index = menus.index
      menus.index = 0
      if (menus.selected) {
        menus.selected.trigger('leave')
      }
      com.scene.selectMenu(index)
    } else {
      menus.index = com.index
      if (menus.selected) {
        menus.selected.trigger('leave')
      }
      menus.selected = com
    }
    return
  }
  
  if (type === 'hover') {
    com.scene.container.style.cursor = 'pointer'
    com.startY = .5
    com.scene.stopMuisc('./sound/mouseclick.wav')
    const sound = com.scene.toggleMusic('./sound/mouseclick.wav', false, true)
    sound.loop = false
  } else if (type === 'leave') {
    com.scene.container.style.cursor = 'auto'
    com.startY = 0
    com.scene.stopMuisc('./sound/mouseclick.wav')
  }
  com.draw()
}
const options: anyObject = mergeOptions({
  'popcap_logo.png': {
    async draw() {
      let iw = this.width
      let ih = this.height
      let sw = this.scene.config.width
      let sh = this.scene.config.height
      return new Promise(resolve => {
        let opacity = 0
        const animate = () => {
          this.scene.clearCanvas()
          this.context.globalAlpha = opacity += .01
          this.context.drawImage(this.img, (sw - iw) / 2, (sh - ih) / 2 , iw, ih)
          if (opacity < .95) {
            setTimeout(animate, 50)
          } else {
            this.scene.clearCanvas()
            resolve()
          }
        }
        animate()
      })
    }
  },
  'Surface.jpg': {
    draw() {
      let w = this.scene.config.width
      let h = this.scene.config.height
      this.context.drawImage(this.img, 0, 0, w, h)
    }
  },
  'SodRollCap.png': {
    draw(rate: number, LoadBar: Model) {
      let offsetY = 200
      let x = this.scene.config.width / 2
      let y = this.scene.config.height / 2 + offsetY
      let lw = ~~(LoadBar.width * rate / 100)
      this.context.save()
      this.context.translate(x + lw - LoadBar.width / 2 - 10, y - LoadBar.height / 2 + 10)
      this.context.rotate(rate * 10.8 * Math.PI / 180)
      this.context.drawImage(this.img, -this.width / 2, -this.height / 2)
      this.context.restore()
    }
  },
  // 加载进度条
  'LoadBar.png': {
    hitAble: true,
    draw(rate: number) {
      let offsetY = 200
      let x = this.scene.config.width / 2
      let y = this.scene.config.height / 2 + offsetY
      let lw = ~~(this.width * rate / 100)
      // 如果需要进行碰撞检测的话, 每次画之前要设置好左上角
      this.x = x - this.width / 2
      this.y = y - this.height / 2
      this.context.drawImage(this.img, 0, 0, lw, this.height, x - this.width / 2, y - this.height / 2, lw, this.height)
      this.context.globalAlpha = .4
      this.context.drawImage(this.img, x - this.width / 2, y - this.height / 2)
      this.context.globalAlpha = 1
    },
    trigger(type: string, event: Event) {
      if (type === 'click') {
        this.scene.startGame()
      } else {
        this.scene.container.style.cursor = type === 'leave' ? 'auto' : 'pointer'
      }
    }
  },
  // 商店
  'SelectorScreen_Store.png': {
    hitAble: true,
    col: 0,
    row: 0,
    ctype: 'function',
    trigger(type: string, event: Event) {
      if (type === 'click') {
        return 
      }
      if (type === 'hover') {
        this.scene.container.style.cursor = 'pointer'
      } else if (type === 'leave') {
        this.scene.container.style.cursor = 'auto'
      }
      this.draw()
    },
    draw() {
      let { x, y, r, c, scene } = getProps(this)
      this.x = x  + c * this.col
      this.y = y + r * this.row
      this.context.drawImage(this.img, this.x, this.y, this.width * this.scaleX, this.height * this.scaleY)
    }
  },
  // 花园
  'SelectorScreen_ZenGarden.png': {
    hitAble: true,
    col: 1,
    row: 0,
    ctype: 'function',
    trigger(type: string, event: Event) {
      if (type === 'click') {
        return 
      }
      if (type === 'hover') {
        this.scene.container.style.cursor = 'pointer'
      } else if (type === 'leave') {
        this.scene.container.style.cursor = 'auto'
      }
      this.draw()
    },
    draw() {
      let { x, y, r, c, scene } = getProps(this)
      this.x = x  + c * this.col
      this.y = y + r * this.row
      this.context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
  },
  // 图鉴
  'SelectorScreen_Almanac.png': {
    hitAble: true,
    col: 2,
    row: 0,
    ctype: 'function',
    trigger(type: string, event: Event) {
      if (type === 'click') {
        return 
      }
      if (type === 'hover') {
        this.scene.container.style.cursor = 'pointer'
      } else if (type === 'leave') {
        this.scene.container.style.cursor = 'auto'
      }
      this.draw()
    },
    draw() {
      let { x, y, r, c, scene } = getProps(this)
      this.x = x  + c * this.col
      this.y = y + r * this.row
      this.context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
  },
  // 冒险
  'SelectorScreenAdventure.png': {
    hitAble: true,
    col: 0,
    row: 0,
    scaleX: 1.2,
    scaleY: .9,
    ctype: 'mod',
    startX: 0,
    startY: 0,
    tilt1: 0,
    tilt2: .05,
    tilt4: -.08,
    tiltY: 1.1,
    tiltH: .6,
    index: 1,
    trigger(type: string, event: Event) {
      menuTrigger(this, type, event)
    },
    draw() {
      let { x, y, r, c, scene } = getProps(this)
      let { scaleX, scaleY, startX, startY } = this
      let { width, height } = this.img
      this.x = x  + c * this.col
      this.y = y + r * this.row
      this.height = height / 2
      this.context.drawImage(this.img, startX * width, startY * height, width, height / 2, this.x, this.y, width * scaleX, height * scaleY / 2)
    }
  },
  // 解密
  'SelectorScreenChallenges.png': {
    hitAble: true,
    col: 0,
    row: 1,
    scaleX: 1.3,
    scaleY: .96,
    startX: 0,
    startY: 0,
    tilt1: 0,
    tilt2: .05,
    tilt4: -.09,
    tiltY: 1.1,
    tiltH: .66,
    ctype: 'mod',
    index: 2,
    trigger(type: string, event: Event) {
      menuTrigger(this, type, event)
    },
    draw() {
      let { x, y, r, c, scene } = getProps(this)
      let { scaleX, scaleY, startX, startY } = this
      let { width, height } = this.img
      this.x = x  + c * this.col
      this.y = y + r * this.row
      this.height = height / 2
      this.context.drawImage(this.img, startX * width, startY * height, width, height / 2, this.x, this.y, width * scaleX, height * scaleY / 2)
    }
  },
  // 小游戏
  'SelectorScreenSurvival.png': {
    hitAble: true,
    col: 0,
    row: 2,
    scaleX: 1.2,
    scaleY: .9,
    startX: 0,
    startY: 0,
    tilt1: 0,
    tilt2: .02,
    tilt4: -.12,
    tiltY: 1.12,
    tiltH: .66,
    ctype: 'mod',
    index: 3,
    trigger(type: string, event: Event) {
      menuTrigger(this, type, event)
    },
    draw() {
      let { x, y, r, c, scene } = getProps(this)
      let { scaleX, scaleY, startX, startY } = this
      let { width, height } = this.img
      this.x = x  + c * this.col
      this.y = y + r * this.row
      this.height = height / 2
      this.context.drawImage(this.img, startX * width, startY * height, width, height / 2, this.x, this.y, width * scaleX, height * scaleY / 2)
    }
  },
  // 开始游戏
  'SelectorScreenStartAdventur.png': {
    hitAble: true,
    col: 0,
    row: 3,
    // 缩放
    scaleX: 1.1,
    scaleY: .8,
    // 图像截取时位移
    startX: 0,
    startY: 0,
    // 倾斜度(用于计算hitArea)
    tilt1: 0,
    tilt2: 0,
    tilt4: -.1,
    tiltY: 1.08,
    tiltH: .8,
    ctype: 'mod',
    index: 4,
    trigger(type: string, event: Event) {
      menuTrigger(this, type, event)
    },
    draw() {
      let { x, y, r, c, scene } = getProps(this)
      let { scaleX, scaleY, startX, startY } = this
      let { width, height } = this.img
      this.x = x  + c * this.col
      this.y = y + r * this.row * 1.05
      this.height = height / 2
      this.context.drawImage(this.img, startX * width, startY * height, width, height / 2, this.x, this.y, width * scaleX, height * scaleY / 2)
    }
  },
  'ZombieHand.png': {
    ctype: 'function',
    personal: {
      lenX: 7,
      lenY: 1,
      currX: 0,
      currY: 0,
      animateTime: 150
    },
    async animate(render: Function) {
      return new Promise(resolve => {
        const paly = () => {
          if (this.personal.currX < this.personal.lenX) {
            render()
            this.personal.currX++
            setTimeout(paly, this.personal.animateTime)
          } else {
            this.personal.currX = 0
            resolve()
          }
        }
        paly()
      })
    },
    draw() {
      let { x, y, w, h, scene } = getProps(this)
      let { scaleX, scaleY, startX, startY, width, height } = this    
      this.x = x - w * .2
      this.y = y - h * .3
      startX = this.personal.currX % this.personal.lenX
      startY = this.personal.currY % this.personal.lenY
      width = width / this.personal.lenX
      height = height / this.personal.lenY
      this.context.drawImage(this.img, startX * width, startY * height, width, height, this.x, this.y, width * scaleX, height * scaleY)
    }
  }
})
const menu = {
  path,
  name,
  list,
  options
}
export default menu