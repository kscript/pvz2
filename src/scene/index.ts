import Com from '@/com'
import Model from '@/com/model'
import { Task } from '@/utils/task'
import { hitTest, isCollide, drawHitArea } from '@/utils/hit'
import user from '@/user'
import { GifCanvas, offlineCanvas, OfflineCanvas } from '@/utils/canvas'
const defaultConfig = {
  width: 1200,
  height: 700
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
  public loadCount = 0
  public hitCom: anyObject<Model[]> = {}
  public mod: number = 0
  public row: number = 5
  public stop: boolean = false
  public user: anyObject = {}
  public sounds: anyObject = {}
  public imageDatas: anyObject<ImageData> = {}
  public offlineCanvas: OfflineCanvas = offlineCanvas
  public cardBar?: Model
  public useCard: Model[] = []
  public dragCom: anyObject = {
    com: null,
    event: null
  }
  public validArea: number[] = []
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
    this.formatUser()
  }
  async beforeInit() {

  }
  async init() {
    this.toggleMusic()
    await this.loadResource()
    await this.addEvents()
    // 需要等待用户点击开始
    await this.task.init('init')
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
    await this.selectAfter()
    this.clearCanvas()
    this.clearMounted()
  }
  async play() {
    const com = await this.getCom('background1.jpg')
    com.init()
    const imageData = offlineCanvas.getImageData(com.img, com.width, this.config.height)
    this.context.putImageData(imageData, 0, 0)
    const useComs = (await this.mountGameZombie()).map(com => {
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
      time: 30
    }, ({
      start
    }: anyObject) => {
      this.clearCanvas()
      this.context.putImageData(imageData, 0 - start * this.config.width, 0)
      this.imageDatas.bg = this.context.getImageData(0, 0, this.config.width, this.config.width)
      useComs.forEach(({ com, x }) => {
        com.x = x - start * this.config.width
        com.draw()
      })
    })
    // useComs.forEach(({ com, x }) => {
    //   com.x = x
    // })
    this.setValidArea()
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
  async beforeGame() {
    await this.mountCardBar()
    await this.selectGameCard()
    await this.mountGameCard()
  }
  async startGame() {
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
  rowFunc() {
    return 2
    // return ~~(Math.random() * 5)
  }
  async mountGameZombie() {
    const Zombie = Com.Zombie
    const useComs = this.coms.filter(com => {
      return com.type === 'zombie' && com.level <= this.user.level
    })
    const coms = this.mountCom(Array(10).fill(1).map(() => {
      let zi = Math.floor(Math.random() * useComs.length)
      const zombie = new Zombie(useComs[zi].name, useComs[zi].options)
      zombie.x = this.config.width * .9
      zombie.y = this.config.height / (this.row + .5) * (0.25 + this.rowFunc())
      return zombie
    }))
    return await Promise.all(coms.map(async com => {
      await com.init()
      com.draw()
      return com
    }))
  }
  async selectGameCard() {
    this.cardBar && this.cardBar.drawGroup()
    this.useCard = [
      'SunFlower',
      'Peashooter'
    ].map(name => this.getCom(name))
  }
  async mountGameCard() {
    const Plant = Com.Plant
    const cardBar = this.cardBar as Model
    const useComs = this.coms.filter(com => {
      return com.type === 'plant' && com.level <= this.user.level
    })
    const coms = this.mountCom(this.useCard.map((comSource, index) => {
      const com = new Plant(comSource.name, Object.assign({}, comSource.options, {
        type: 'card',
        static: true
      }))
      com.x = cardBar.x + (cardBar.width / 10 * .95 + 1) * index + cardBar.height / 1.5
      com.y = cardBar.y + cardBar.height
      return com
    }))
    return await Promise.all(coms.map(async com => {
      await com.init()
      com.width = cardBar.width / 10 * .9
      com.height = cardBar.width / 10 * .9
      com.draw()
      return com
    }))
  }
  
  async dragStart(com: Model, event: MouseEvent) {
    const Plant = Com.Plant
    const comCopy = new Plant(com.name, Object.assign({}, com.options, {
      type: 'plant',
      x: com.x,
      y: com.y,
      static: true
    }))
    await comCopy.init()
    this.mountCom(comCopy)
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
    if (!pos.length) {
      this.dumpCom(com)
    } else {
      com.x = l + width * .925 * pos[0] + width / 2
      com.y = t + height * .935 * pos[1] + height / 2
      com.hitAble = false
      com.static = false
    }
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
      return [~~((x - l)/ width), ~~((y - t) / height)]
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
    console.log('已加载:' + rate.toFixed(2) + '%')
  }
  stateChange(type: string, url: string, index: number, gif: GifCanvas) {
    const count = this.coms.length
    if (index === gif.imageUrls.length - 1) {
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
    sound.loop = false
    await new Promise(async resolve => {
      sound.onended = () => {
        resolve()
      }
      await com.animate(async () => {
        this.clearCanvas()
        this.restore()
        com.draw()
      })
    })
    this.toggleMusic('./sound/hugewave.mp3').loop = false
  }
  refresh() {
    requestAnimationFrame(async () => {
      if (!this.stop) {
        this.clearCanvas()
        this.context.putImageData(this.imageDatas.bg, 0, 0)
        let queue = Promise.resolve()
        this.comsMounted.forEach(async com => {
          queue = queue.then(async () => {
            return com.group.length ? await com.drawGroup() : com.draw()
          })
        })
        await queue
        this.refresh()
      }
    })
  }

  // 工具方法

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
    return (Array.isArray(com) ? com : [com]).map(item => {
      this.comsMountedMap[item.id] = item
      if (insert) {
        this.comsMounted.unshift(item)
      } else {
        this.comsMounted.push(item)
      }
      return item
    })
  }
  dumpCom(com: Model) {
    delete this.comsMountedMap[com.id]
    this.comsMounted.slice(0).forEach((item, index) => {
      if (item.id === com.id) {
        this.comsMounted.splice(index, 1)
      }
    })
  }
  clearCanvas() {
    this.context.clearRect(0, 0, this.config.width, this.config.width)
  }
  clearMounted() {
    this.comsMounted.splice(0).forEach(item => {
      delete this.comsMountedMap[item.id]
      item.destory()
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
      // 如果没有指定当前环节要碰撞检测, 且默认不检测, 则跳过
      if (!com.hitState.hasOwnProperty(this.state) && !com.hitAble) {
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
    const imageData = this.context.getImageData(...args)
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
    imageData && this.context.putImageData(imageData, x, y, ...rest)
    return imageData
  }
  recordPath() {
    const pointers: number[] = []
    console.log(pointers)
    this.container.addEventListener('click', (event: Event) => {
      // @ts-ignore
      pointers.push(event.offsetX)
      // @ts-ignore
      pointers.push(event.offsetY)
    })
  }
  public drawHitArea(color: string, cxt: CanvasContextEx = this.context, area: number[] = []) {
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
    sound.loop = true
    sound.onload = () => {
    }
    sound.oncanplay = () => {
      sound.muted = false
      sound.play()
    }
    return sound
  }
}