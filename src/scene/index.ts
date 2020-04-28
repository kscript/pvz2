import Com from '@/com'
import Model from '@/com/model'
import { Task } from '@/utils'
import { GifCanvas } from '@/utils/canvas'

export default class Scene {
  [prop:string]: any
  public config: anyObject
  public container: HTMLCanvasElement

  public state = ''
  public task = new Task
  public coms: Model[] = []
  public loadCount = 0
  constructor(container: HTMLCanvasElement, config: anyObject = {}) {
    this.container = container
    this.config = config
  }
  async init() {
    await this.loadResource()
    await this.addEvents()
    await this.loadMenu()
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
          if (Ctor) return resolve(new Ctor(item, coms[key].options[item]))
          resolve()
        })
      }))
    }
    try {
      this.coms = await Promise.all(list)
      await Promise.all(this.coms.map(async instance => {
        return instance.init(this.stateChange.bind(this))
      }))
    } catch (err) {
      console.log(err)
    }
  }
  stateChange(type: string, url: string, index: number, gif: GifCanvas) {
    const count = this.coms.length
    if (index === gif.imageUrls.length -1) {
      this.loadCount++
    }
    console.log('已加载:' + (this.loadCount / count * 100).toFixed(2) + '%')
  }
  async addEvents() {}
  async loadMenu() {}
  async showMenu() {}
  async selectMenu() {}
}