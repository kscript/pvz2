import Com from '@/com'
import Model from '@/com/model'
import { Task, hitTest, isCollide } from '@/utils'
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
  public comMap: anyObject<Model> = {}
  public loadCount = 0
  public hitCom: Model[] = []
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
    await this.loadMenu()
    this.setBackground()
  }
  async mount() {
    await this.showMenu()
    await this.selectMenu()
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
      await Promise.all(this.coms.map(async instance => {
        return instance.init(this.stateChange.bind(this))
      }))
    } catch (err) {
      console.log(err)
    }
  }
  async loading() {
    const com = this.getCom('popcap_logo.png')
    await com.init(this.stateChange.bind(this))
    await com.draw()
  }
  stateChange(type: string, url: string, index: number, gif: GifCanvas) {
    const count = this.coms.length
    if (index === gif.imageUrls.length -1) {
      this.loadCount++
      console.log('已加载:' + (this.loadCount / count * 100).toFixed(2) + '%')
    }
  }
  async setBackground(name: string = 'Surface.jpg') {
    const com = this.getCom(name || '')
    if (com) {
      com.draw()
    }
  }

  async addEvents() {
    this.container.addEventListener('mousedown', (event: Event) => {
      this.hitExec(true, this.hitTest(event),(com) => {
        console.log(com)
      })
    })
    this.container.addEventListener('mouseup', (event: Event) => {

    })
    this.container.addEventListener('mousemove', (event: Event) => {

    })
    this.container.addEventListener('mouseout', (event: Event) => {

    })
  }
  // 碰撞到组件时执行
  hitExec(one: boolean = false, hitCom: Model[] = this.hitCom, func: (com: Model) => any) {
    const coms = hitCom.slice(0).sort((a, b) => {
      return a.index - b.index
    })
    if (one) {
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
    this.coms.map(com => {
      // 如果没有指定当前环节要碰撞检测, 且默认不检测, 则跳过
      if (!com.hitState.hasOwnProperty(this.state) && !com.hitAble) {
        return
      }
      if (com.hitArea.length === 4) {
        if (hitTest.apply(null, [x, y].concat(com.hitArea))) {
          hit.push(com)
        }
      } else if(com.hitArea.length){
        if (isCollide([x, y, x + 1, y, x + 1, y + 1], com.hitArea)) {
          hit.push(com)
        }
      }
    })
    return this.hitCom = hit
  }
  getCom(name?: string, type?: string) {
    const key = (type ? type + '_' : '') + name
    const com = this.comMap[key]
    !com && console.log('未能找到 ' + key + ' 组件')
    return com
  }
  async loadMenu() {
  }
  async showMenu() {}
  async selectMenu() {}
}