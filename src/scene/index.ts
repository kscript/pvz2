import Com from '@/com'
import Model from '@/com/model'
import user from '@/user'
import { isEmpty, rand } from '@/utils'
import { Task } from '@/utils/task'
import { hitTest, hitTest2, isCollide, drawHitArea } from '@/utils/hit'
import { GifCanvas, offlineCanvas, OfflineCanvas } from '@/utils/canvas'
import Flow from './flow'
import { sendMessage } from '@/utils/message'
const defaultConfig = {
  width: 1200,
  height: 700
}
const others: Model[] = []
const plants: Model[] = []
const bullets: Model[] = []
const zombies: Model[] = []
const cards: Model[] = []
const suns: Model[] = []
const dyings: Model[] = []

const coms: anyObject<Model[]> = {
  plants,
  zombies,
  bullets,
  cards,
  others,
  suns
}
export default class Scene {
  [prop: string]: any
  public config: anyObject
  public container: HTMLCanvasElement
  public context: CanvasContextEx
  public state = ''
  public task = new Task
  public coms: Model[] = []
  public comsMounted: Model[] = []
  public comsMountedMap: anyObject<Model> = {}
  public comMap: anyObject<Model> = {}
  public comGroup: anyObject<Model[]> = coms
  public loadCount = 0
  public hitCom: anyObject<Model[]> = {}
  public mod: number = 0
  public row: number = 5
  public sun: number = 100
  // 行高和列宽
  public rowH: number = 0
  public colW: number = 0
  public rowScale: number = .935
  public colScale: number = .925
  public stop: boolean = false
  public user: anyObject = {}
  public sounds: anyObject = {}
  public imageDatas: anyObject<ImageData> = {}
  public offlineCanvas: OfflineCanvas = offlineCanvas
  public cardBar?: Model
  public useCard: Model[] = []
  public mountCard: Model[] = []
  public dragCom: anyObject = {
    com: null,
    event: null
  }
  public validArea: number[] = []
  public flow: Flow | null = null
  public auxiliary: anyObject = {
    // hitArea: 'red',
    // attackArea: 'blue',
    // attackArea2: 'white'
  }
  public pos: string[][] = []
  public refreshTime: number = 0
  public refreshFps: number = 32
  public layers: anyObject[] = []
  public layerIndex = 0
  constructor(container: HTMLCanvasElement, config: anyObject = {}) {
    this.container = container
    config = this.config = Object.assign({}, defaultConfig, config)
    if (config.size === 'fullScreen') {
      config.width = window.screen.width
      config.height = window.screen.height
    }
    this.container.width = config.width
    this.container.height = config.height
    config.scaleX = config.width / defaultConfig.width
    config.scaleY = config.height / defaultConfig.height
    this.context = <CanvasContextEx>container.getContext('2d')
    this.colW = config.width / 14
    // row 可能是5或者是6
    this.rowH = config.height / (this.row + 1)
    this.formatUser()
    this.initLayer()
  }
  async beforeInit() {

  }
  async init() {
    const sound = this.toggleMusic()
    sound.loop = true
    await this.loadResource()
    await this.addEvents()
    // 需要等待用户点击开始
    await this.task.init('init')
  }
  initLayer() {
    const el = this.container
    const parent = el.parentElement as HTMLElement
    parent.style.position = 'relative'
    this.layers.push({
      selected: false,
      context: this.context
    })
    Array(5).fill('').forEach((item, index) => {
      const elCopy = el.cloneNode(true) as HTMLCanvasElement
      elCopy.style.cssText = 'pointer-events: none;position: absolute; top: 0; left: 0;z-index: ' + index * 10000
      parent.prepend(elCopy)
      this.layers.push({
        selected: false,
        context: <CanvasContextEx>elCopy.getContext('2d')
      })
    })
  }
  selectContext(com: Model | {
    layerIndex: number
  }) {
    const layer = this.layers[com.layerIndex]
    if (layer) {
      layer.selected = true
      return layer.context
    }
    return this.context
  }
  resolveInit() {
    this.task.resolve('init')
  }
  async mount() {
    this.clearCanvas()
    this.clearMounted()
    await this.setBackground()
    await this.loadMenu()
    await this.task.init('mount')
  }
  async resolveMount(index: number) {
    this.mod = index
    await this.task.resolve('mount')
  }
  async beforePlay() {
    this.clearCanvas()
    this.clearMounted()
  }
  getFlowStep() {
    return [
      [5 * 1e3, '开始'],
      [20 * 1e3, 1, 2],
      [35 * 1e3, 1, 2],
      [50 * 1e3, 1, 3],
      [60 * 1e3, 1, 3],

      [70 * 1e3, '一大波僵尸正在靠近'],
      
      [85 * 1e3, 2, 3],
      [100 * 1e3, 2, 3],
      [115 * 1e3, 1, 4],
      
      [125 * 1e3, 1, 4],
      [135 * 1e3, 2, 4],

      [150* 1e3, '一大波僵尸正在靠近'],
      [155* 1e3, '最后一波'],

      [165 * 1e3, 2, 4],
      [175 * 1e3, 2, 5],
      [190 * 1e3, 3, 5]
    ]
  }
  async play() {
    this.flow = new Flow(this, this.getFlowStep(), {})
    const com = await this.getCom('background1.jpg')
    com.init()
    this.setValidArea()
    const imageData = offlineCanvas.getImageData(com.img, com.width, this.config.height)
    this.selectContext(this).putImageData(imageData, 0, 0)
    const useComs = (await this.mountGameZombies()).map(com => {
      return {
        com,
        x: com.x
      }
    })
    await this.wobble({
      start: 0,
      left: .1,
      right: .15,
      change: .002,
      time: 25
    }, ({
      start
    }: anyObject) => {
      this.clearCanvas()
      this.selectContext(this).putImageData(imageData, 0 - start * this.config.width, 0)
      this.imageDatas.bg = this.selectContext(this).getImageData(0, 0, this.config.width, this.config.width)
      useComs.forEach(({ com, x }) => {
        com.x = x - (start + .1) * this.config.width
        com.draw()
      })
    })
    // useComs.forEach(({ com, x }) => {
    //   com.x = x
    // })
  }

  async beforeGame() {
    this.resetAttackArea()
    await this.mountCardBar()
    await this.selectGameCard()
    await this.mountGameCard()
    const Menu = Com.Menu
    const car = this.getCom('LawnCleaner.png')
    // scene应该要有一个开始row的属性, 后期加
    const start = 0
    this.mountCom(
      await Promise.all(
        Array(this.row).fill('').map(async (item, index) => {
          const carCopy = new Menu(car.name, Object.assign({}, car.options, {
            pos: [0, start + index]
          }))
          await carCopy.init()
          return carCopy
        })
      )
    )
  }
  async startGame() {
    this.flow?.init()
    this.refresh()
    return new Promise(resolve => resolve)
  }
  async afterGame() {

  }
  async mountCardBar() {
    const header = this.getCom('bgHeader.jpg')
    const body = this.getCom('bgBody.jpg')
    const footer = this.getCom('bgFooter.jpg')
    header.group.push(body, footer)
    this.mountCom(header, true)
    return this.cardBar = header
  }
  rowFunc(min: number = 0, max: number = 4) {
    return rand(min, max)
  }
  async mountGameZombies(random: number = 0, useComs: Model[] = []) {
    random = ~~random
    useComs = useComs.length ? useComs : this.coms.filter(com => {
      return com.type === 'zombie' && com.level <= this.user.level
    })
    return this.mountCom(
      await Promise.all(
        random > 0 
        ? Array(random).fill('').map(() => {
            let index = ~~(Math.random() * useComs.length)
            return this.mountGameZombie(useComs[index])
          })
        : useComs.map(this.mountGameZombie.bind(this))
      )
    )
  }
  async mountGameZombie(item: Model) {
    const [l, t, w, h, width, height] = this.validArea
    const Zombie = Com.Zombie
    const zombie = new Zombie(item.name, item.options)
    zombie.x = this.config.width * .95
    // y固定, x是后期动态设置的
    zombie.pos = [10, this.rowFunc()]
    zombie.y = t + (zombie.pos[1] + 1) * height - item.height
    await zombie.init()
    return zombie
  }
  async mountSun(options: anyObject = {}) {
    const Menu = Com.Menu
    const com = this.getCom('Sun.gif')
    const comCopy = new Menu(com.name, Object.assign({}, com.options, {
      hitAble: true,
      sun2: 25,
      personal: {
        coords: null,
        end: null,
        easing: ''
      }
    }, options))
    comCopy.init()
    this.mountCom(comCopy)
    return comCopy
  }
  async selectGameCard() {
    this.cardBar && this.cardBar.drawGroup()
    this.useCard = [
      'Sun.gif',
      'SunFlower',
      'Peashooter',
      // 'Blover',
      // 'Cactus',
      // 'CherryBomb',
      // 'Chomper',
      // 'CoffeeBean',
      // 'DoomShroom',
      // 'FlowerPot',
      // 'FumeShroom',
    ].map(name => this.getCom(name))
  }
  async mountGameCard() {
    const Plant = Com.Plant
    const Menu = Com.Menu
    const cardBar = this.cardBar as Model
    const useComs = this.coms.filter(com => {
      return com.type === 'plant' && com.level <= this.user.level
    })
    return this.mountCard = this.mountCom(await Promise.all(this.useCard.map(async (comSource, index) => {
      const Card = comSource.type === 'menu' ? Menu : Plant
      const com = new Card(comSource.name, Object.assign({}, comSource.options, {
        type: 'card',
        reload: true,
        static: true
      }))
      com.x = cardBar.x + cardBar.height / 2 + (cardBar.width / 10 + 3 + cardBar.height / 2) * index
      com.y = cardBar.y + cardBar.height / 2
      com.padding = Array(4).fill(cardBar.height / 2)
      await com.init()
      com.width = cardBar.width / 10 * .9
      com.height = cardBar.width / 10 * .9
      return com
    })))
  }
  
  setValidArea(row: number = 0, num: number = 0) {
    // 横向14份
    // 纵向7/6份
    // 左边距1.25份
    // 右边距3.75份
    // 上边距.5份
    // 下边距.5份
    const width = this.config.width / 14
    const height = this.config.height / (this.row + 1)
    row = row < 0 || row > this.row ? 0 : row
    num = num < 0 || num > this.row ? 0 : num
    this.validArea = [
      1.25  * width,
      (row + .5) * height,
      9 * width,
      (this.row - num) * height,
      width,
      height
    ]
  }
  resetAttackArea() {
    this.comsMounted.forEach(com => {
      com.setAttackArea()
    })
  }
  async dragStart(com: Model, event: MouseEvent) {
    if (!com.canUse) {return }
    const Plant = Com.Plant
    const comCopy = new Plant(com.name, Object.assign({}, com.options, {
      type: 'card',
      x: com.x,
      y: com.y,
      reload: false,
      static: true
    }))
    comCopy.source = com
    com.draging = true
    await comCopy.init()
    this.mountCom(comCopy)
    this.toggleMusic('./sound/plant1.mp3', false)
    Object.assign(this.dragCom, {
      com: comCopy,
      event,
      source: {
        x: com.x,
        y: com.y
      }
    })
  }
  async dragEnd(com: Model, event: MouseEvent) {
    const pos = this.validDrag(com, event)
    const [l, t, w, h, width, height] = this.validArea
    if (!pos.length || this.hasPos(pos)) {
      this.dumpCom(com)
    } else{
      this.setPos(pos, com.id)
      com.x = l + width * this.colScale * pos[0] + width / 2
      com.y = t + height * this.rowScale * pos[1] + height / 2
      com.hitAble = false
      com.static = false
      com.type = 'plant'
      com.pos.splice(0, 2, ...pos)
      com.setAttackArea()
      this.findAttackCom()
      if (com.source) {
        com.source.reTime = +new Date
        this.sun -= com.sun
      }
    }
    if (com.source) {
      com.source.draging = false
    }
    this.toggleMusic('./sound/plant2.mp3', false)
    Object.assign(this.dragCom, {
      com: null,
      event: null,
      source: null
    })
  }
  validDrag(com: Model, event: MouseEvent) {
    const x = event.offsetX
    const y = event.offsetY
    const [l, t, w, h, width, height] = this.validArea
    if (x >= l && x <= l + w && y >= t && y <= t + h) {
      return [~~((x - l) / width), ~~((y - t) / height)]
    }
    return []
  }
  formatUser() {
    if (user.active && user.data.hasOwnProperty(user.active)) {
      this.user = user.data[user.active]
    }
  }
  async loadResource() {
    const coms = this.config.coms
    let list: any[] = []
    for (let key in coms) {
      const Ctor = Com[key]
      list = list.concat(coms[key].list.map((item: string) => {
        return new Promise(async (resolve) => {
          if (Ctor && this.comMap[item]) {
            console.log('Map中 ' + item + ' 属性将被覆盖')
          }
          if (Ctor) {
            const config = Object.assign({
              scene: this,
              context: this.context,
              container: this.container,
            }, coms[key].options[item])
            const instance = new Ctor(item, config)
            return resolve(this.comMap[key + '_' + item] = this.comMap[item] = instance)
          }
          resolve()
        })
      }))
    }
    try {
      this.coms = await Promise.all(list)
      await this.loading()
      await Promise.all(this.coms.map(instance => {
        return instance.init(this.stateChange.bind(this))
      }))
    } catch (err) {
      console.log(err)
    }
  }
  async loading() {
    const coms: Model[] = ['popcap_logo.png', 'SodRollCap.png', 'LoadBar.png'].map(item => this.getCom(item))
    this.loadCount++
    await coms[0].init()
    this.mountCom(coms[0])
    await coms[0].draw()
    await Promise.all(coms.slice(1).map(async com => {
      if (com) {
        this.loadCount++
        await com.init()
        this.mountCom(coms)
        return com
      }
    }))
  }
  loadAnimate(rate: number) {
    this.clearCanvas()
    const SodRollCap = this.getCom('SodRollCap.png')
    const LoadBar = this.getCom('LoadBar.png')
    LoadBar.draw(~~rate)
    SodRollCap.draw(~~rate, LoadBar)
    sendMessage('已加载:' + rate.toFixed(2) + '%', {
      type: 'Scene::loadAnimate',
      source: this
    })
  }
  stateChange(type: string, url: string, index: number, gif: GifCanvas, total: number = 0) {
    const count = this.coms.length
    const loadComplete = total ? index === total : index === gif.imageUrls.length - 1
    if (loadComplete) {
      this.loadCount++
      const rate = this.loadCount / count * 100
      this.loadAnimate(rate)
    }
  }
  async addEvents() {
    this.container.addEventListener('mousedown', (event: Event) => {
      this.hitExec(true, this.hitCom['click'] = this.hitTest(event), (com) => {
        com.trigger('click', event)
      })
    })
    this.container.addEventListener('mouseup', (event: Event) => {
      this.hitExec(true, this.hitCom['mouseup'] = this.hitTest(event), (com) => {
        com.trigger('mouseup', event)
      })
    })
    this.container.addEventListener('mousemove', (event: Event) => {
      const com = this.dragCom.com as Model
      if (!com) {
        let old = this.hitCom.hover || []
        let hover = this.hitCom.hover = this.hitTest(event)
        this.hitExec(true, hover.slice(0), (com) => {
          // 如果在旧数组找不到, 则触发hover
          if (!old.some(item => item.id === com.id)) {
            com.trigger('hover', event)
          }
        })
        // 如果在新数组找不到, 则触发leave
        old.forEach(com => {
          if (!hover.some(item => item.id === com.id)) {
            com.trigger('leave', event)
          }
        })
      } else {
        com.drag(event, this.dragCom.event)
      }
    })
    this.container.addEventListener('mouseleave', (event: Event) => {
      const hover = this.hitCom['hover']
      if (hover && hover.length) {
        hover.map(com => {
          com.trigger('leave', event)
        })
        hover.splice(0)
      }
    })
  }
  async loadMenu() {
    const coms: Model[] = [
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
      'SelectorScreenStartAdventur.png'
    ].map(item => {
      const com = this.getCom(item)
      this.mountCom(com)
      com.draw()
      com.setHitArea(true)
      // com.drawHitArea()
      return com
    })
  }
  async selectAfter() {
    const sound = this.toggleMusic('./sound/evillaugh.mp3')
    const com = this.getCom('ZombieHand.png')
    this.mountCom(com)
    this.save()
    await new Promise(async resolve => {
      sound.onended = () => {
        resolve()
      }
      await com.animate(async () => {
        this.clearCanvas(this.selectContext(com))
        this.restore()
        com.draw()
      })
    })
    this.toggleMusic('./sound/readysetplant.mp3')
  }
  gameover(win: boolean = true) {
    this.stop = true
    sendMessage('成功通过关卡!', {
      type: 'Scene::gameover',
      source: this
    })
  }
  refresh() {
    requestAnimationFrame(async () => {
      const now = +new Date
      if (now - this.refreshTime < 1e3 / this.refreshFps) {
        return this.refresh()
      }
      if (!this.stop) {
        this.clearCanvas()
        this.layers.forEach(item => {
          item.selected = false
        })
        this.flow?.refresh()
        this.selectContext(this).putImageData(this.imageDatas.bg, 0, 0)
        let queue = Promise.resolve()
        this.order().forEach(async com => {
          queue = queue.then(async () => {
            com.run()
            if (this.auxiliary['hitArae_' + com.type]) {
              com.drawHitArea(this.auxiliary['hitArae_' + com.type].hitArea)
            }
            com.group.length ? await com.drawGroup() : await com.draw()
          })
        })
        dyings.forEach(com => {
          if (com.dying) {
            com.dyingEffect()
          }
          if (com.die) {
            com.destroy()
          }
        })
        await queue
        this.attackTest()
        this.refresh()
      }
    })
  }
  order() {
    return plants.concat(bullets, zombies, others, cards, suns)
  }
  attackTest() {
    const context = this.selectContext(this)
    zombies.slice(0).forEach((com2, i2) => {
      if (com2.x <= this.config.width) {
        // 移动 攻击/被攻击 边界, 只改变x
        com2.attackArea[0] = com2.x
        com2.attackArea2[0] = com2.x
        if (this.auxiliary.attackArea_com2) {
          com2.drawHitArea(this.auxiliary.attackArea_com2, context, com2.attackArea)
        }
        if (this.auxiliary.attackArea2_com2) {
          com2.drawHitArea(this.auxiliary.attackArea2_com2, context, com2.attackArea2)
        }
        plants.concat(bullets).slice(0).forEach((com1, i1) => {
          if (com1.type === 'bullet') {
            com1.attackArea[0] = com1.x - com1.width * 2
            com1.attackArea2[0] = com1.x
          }
          if (i2 < 1) {
            if (this.auxiliary.attackArea_com1) {
              com1.drawHitArea(this.auxiliary.attackArea_com1, context, com1.attackArea)
            }
            if (this.auxiliary.attackArea2_com1) {
              com1.drawHitArea(this.auxiliary.attackArea2_com1, context, com1.attackArea2)
            }
          }
          if (com1.pos[1] === com2.pos[1]) {
            if (com1.id !== com2.id && com2.type === 'zombie') {
              if(!com1.pending && com1.attackAble) {
                if (hitTest2(com1.attackArea, com2.attackArea2)) {
                  com1.attack(com2)
                }
              }
              if(com1.type !== 'bullet' && !com2.pending && com2.attackAble) {
                if (hitTest2(com2.attackArea, com1.attackArea2)) {
                  com2.attack(com1)
                }
              }
              this.needDump(com2, false)
              this.needDump(com1, false)
            }
          }
        })
        com2.restore()
      }
    })
    this.findAttackCom()
  }

  // 工具方法
  findAttackCom() {
    plants.splice(0)
    zombies.splice(0)
    others.splice(0)
    bullets.splice(0)
    cards.splice(0)
    suns.splice(0)
    dyings.splice(0)
    this.comsMounted.forEach(com => {
      if (!com.die) {
        if (com.dying) {
          dyings.push(com)
        } else {
          if (com.name === "Sun.gif") {
            suns.push(com)
          } else {
            (coms[com.type + 's'] || others).push(com)
          }
        }
      } else {
        this.dumpCom(com, false)
      }
    })
    zombies.sort((a, b) => {
      return a.pos[1] - b.pos[1]
    })
  }
  // 晃动镜头
  wobble(option: anyObject = {}, render: (option: anyObject) => void) {
    let { start, change, left, right, time, ...rest } = option
    const oldStart = start
    let restore = false
    let count = start > left ? 3 : 2
    return new Promise(resolve => {
      const paly = () => {
        if (!count) {
          return resolve()
        }
        start += change
        if (change > 0) {
          // 正向运动完毕
          if (start > right) {
            change *= -1
            count--
            // 复位完毕
          } else if (restore && start > oldStart) {
            return resolve()
          }
        } else {
          // 反向运动完毕
          if (start < left) {
            change *= -1
            count--
            restore = true
          }
        }
        render({
          start, change, left, right, time, ...rest
        })
        setTimeout(paly, time)
      }
      paly()
    })
  }
  mountCom(com: Model | Model[], insert: boolean = false) {
    const coms = (Array.isArray(com) ? com : [com]).map(item => {
      if (!item.id) {
        debugger
      }
      this.comsMountedMap[item.id] = item
      if (insert) {
        this.comsMounted.unshift(item)
      } else {
        this.comsMounted.push(item)
      }
      return item
    })
    this.findAttackCom()
    return coms
  }
  dumpCom(com: Model, autoFind: boolean = true) {
    if (!this.comsMountedMap[com.id]) return 
    if (com.type === 'plant' && this.pos[com.pos[0]]) {
      this.pos[com.pos[0]][com.pos[1]] = ''
    }
    this.comsMountedMap[com.id].destroy()
    delete this.comsMountedMap[com.id]
    this.comsMounted.slice(0).forEach((item, index) => {
      if (item.id === com.id) {
        this.comsMounted.splice(index, 1)
      }
    })
    if(autoFind && (com.type === 'plant' || com.type === 'zombie' || com.type === 'bullet')) {
      this.findAttackCom()
    }
  }
  needDump(com: Model, autoFind: boolean = true) {
    const invalid = com.x > this.config.width || com.x + com.width < 0 || com.y > this.config.height || com.y + com.height < 0
    if (com.die || invalid) { // (com.type === 'bullet' || com.type === 'plant' || com.type === 'zombie' && invalid)) {
      this.dumpCom(com, autoFind)
      return true
    }
    return false
  }
  hasPos([x, y]: number[]) {
    return this.pos[x] && this.pos[x][y]
  }
  setPos([x, y]: number[], val: string) {
    if (!this.pos[x]) {
      this.pos[x] = []
    }
    this.pos[x][y] = val
  }
  clearCanvas(context?: CanvasContextEx) {
    if (context) {
      context.clearRect(0, 0, this.config.width, this.config.width)
    } else {
      this.layers.forEach(({ context, selected }) => {
        selected && context.clearRect(0, 0, this.config.width, this.config.width)
      })
    }
  }
  clearMounted() {
    this.comsMounted.splice(0).forEach(item => {
      delete this.comsMountedMap[item.id]
      item.destroy()
    })
  }
  // 碰撞到组件时执行
  hitExec(one: boolean = false, hitCom: Model[], func: (com: Model) => any) {
    const coms = hitCom.slice(0).sort((a, b) => {
      return a.index - b.index
    })
    if (one) {
      coms.splice(1)
      coms.length && func(coms[0])
    } else {
      coms.map(item => {
        func(item)
      })
    }
  }
  hitTest(event: Event) {
    // @ts-ignore
    const { offsetX: x, offsetY: y } = event
    const hit: Model[] = []
    this.comsMounted.map(com => {
      const hitArea = (com.hitArea || []).slice(0)
      if (!com.hitAble){
        return
      } else if (!isEmpty(com.hitState) && !com.hitState.hasOwnProperty(this.state)){
        return 
      }
      if (hitArea.length) {
        hitArea[0] = com.x
        hitArea[1] = com.y
        if (hitArea.length === 4) {
          if (hitTest.apply(null, [x, y].concat(hitArea))) {
            hit.push(com)
          }
        } else if (hitArea.length) {
          if (isCollide([x, y, x + 1, y, x + 1, y + 1], hitArea)) {
            hit.push(com)
          }
        }
      }
    })
    return hit
  }
  getCom(name?: string, type?: string) {
    const key = (type ? type + '_' : '') + name
    const com = this.comMap[key]
    !com && console.log('未能找到 ' + key + ' 组件')
    return com
  }
  async setBackground(name: string = 'Surface.jpg') {
    const com = this.getCom(name || '')
    if (com) {
      await com.draw()
    }
    return com
  }
  save(name?: string, ...rest: any) {
    const args = rest.concat(0, 0, this.config.width, this.config.height).filter((item: any) => typeof item === 'number').slice(0, 4)
    // @ts-ignore
    const imageData = this.selectContext(this).getImageData(...args)
    if (name) {
      this.imageDatas['_' + name] = imageData
    } else {
      this.imageDatas.active = imageData
    }
    return imageData
  }
  restore(name?: string, x = 0, y = 0, ...rest: number[]) {
    let imageData
    if (name && this.imageDatas[name]) {
      imageData = this.imageDatas[name]
      delete this.imageDatas[name]
    } else {
      imageData = this.imageDatas.active
    }
    // @ts-ignore
    imageData && this.selectContext(this).putImageData(imageData, x, y, ...rest)
    return imageData
  }
  recordPath() {
    const pointers: number[] = []
    this.container.addEventListener('click', (event: Event) => {
      // @ts-ignore
      pointers.push(event.offsetX)
      // @ts-ignore
      pointers.push(event.offsetY)
    })
  }
  public drawHitArea(color: string, cxt: CanvasContextEx = this.selectContext(this), area: number[] = []) {
    // @ts-ignore
    drawHitArea(color, cxt, area)
  }
  public stopMuisc(src?: string) {
    try {
      if (src) {
        this.sounds[src].pause()
      } else {
        for (let key in this.sounds) {
          this.sounds[key].pause()
        }
      }
    } catch (e) { }
  }
  public toggleMusic(src: string = './sound/Faster.mp3', stop: boolean = true, cache: boolean = false) {
    stop && this.stopMuisc()
    if (cache) {
      if (this.sounds[src]) {
        if (this.sounds[src].paused) {
          this.sounds[src].play()
        }
      } else {
        this.sounds[src] = this.music(src)
      }
      return this.sounds[src]
    }
    return this.sounds[src] = this.music(src)
  }
  public music(src: string = './sound/Faster.mp3') {
    const sound = new Audio
    sound.src = src
    sound.muted = true
    sound.autoplay = true
    sound.loop = false
    sound.onload = () => {
    }
    sound.oncanplay = () => {
      sound.muted = false
      sound.play()
    }
    return sound
  }
}