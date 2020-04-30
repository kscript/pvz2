import Com from '@/com'
import Model from '@/com/model'
import { Task, hitTest, isCollide, drawHitArea } from '@/utils'
import { GifCanvas } from '@/utils/canvas'
const defaultConfig = {
  width: 1366,
  height: 720
}
export default class Scene {
  [prop:string]: any
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
  public sounds: anyObject = {}
  constructor(container: HTMLCanvasElement, config: anyObject = {}) {
    this.container = container
    config = this.config = Object.assign({}, defaultConfig, config)
    if (config.size === 'fullScreen') {
      config.width = window.screen.width
      config.height = window.screen.height
    }
    this.container.width = config.width
    this.container.height = config.height
    this.context = <CanvasContextEx>container.getContext('2d')
  }
  async beforeInit() {

  }
  async init() {
    await this.loadResource()
    await this.addEvents()
    // 需要等待用户点击开始
    await this.task.init()
    this.toggleMusic()
    this.clearCanvas()
    this.clearMounted()
    await this.setBackground()
    await this.loadMenu()
  }
  async mount() {
    await this.showMenu()
    await this.task.init()
  }
  async play() {}

  async loadResource() {
    const coms = this.config.coms
    let list: any[] = []
    for(let key in coms) {
      const Ctor = Com[key]
      list = list.concat(coms[key].list.map((item: string) => {
        return new Promise(async (resolve) =>{
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
            return resolve(this.comMap[key + '_' + item] = this.comMap[item] = instance )
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
  mountCom(com: Model | Model[]) {
    (Array.isArray(com) ? com : [com]).map(item => {
      this.comsMountedMap[item.id] = item
      this.comsMounted.push(item)
    })
  }
  async loading() {
    const coms: Model[] = ['popcap_logo.png', 'SodRollCap.png', 'LoadBar.png'].map(item => this.getCom(item))
    this.loadCount++
    await coms[0].init()
    this.mountCom(coms[0])
    await coms[0].draw()
    await Promise.all(coms.slice(1).map(async com => {
      if(com) {
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
    if (index === gif.imageUrls.length -1) {
      this.loadCount++
      const rate = this.loadCount / count * 100
      this.loadAnimate(rate)
    }
  }
  async setBackground(name: string = 'Surface.jpg') {
    const com = this.getCom(name || '')
    if (com) {
      com.draw()
    }
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
  async addEvents() {
    this.container.addEventListener('mousedown', (event: Event) => {
      this.hitExec(true, this.hitCom['click'] = this.hitTest(event), (com) => {
        com.trigger('click', event)
      })
    })
    this.container.addEventListener('mouseup', (event: Event) => {
      
    })
    this.container.addEventListener('mousemove', (event: Event) => {
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
      const hitArea = (com.hitArea||[]).slice(0)
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
        } else if(hitArea.length){
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
  async showMenu() {}
  async selectMenu(index: number) {
    this.mod = index
    this.clearCanvas()
    this.clearMounted()
    await this.task.resolve()
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
  
  public toggleMusic(src: string = '/sound/Faster.mp3') {
    this.sounds[src] = this.music(src)
  }
  public music(src: string = '/sound/Faster.mp3') {
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