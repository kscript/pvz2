import Com from '@/com'
import { Task } from '@/utils'

export default class Scene {
  [prop:string]: any
  public config: anyObject
  public container: HTMLCanvasElement

  public state = ''
  public task = new Task
  public coms: Com[] = []
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
    return this.task.init()
  }
  async addEvents() {}
  async loadMenu() {}
  async showMenu() {}
  async selectMenu() {}
}