import * as path from 'path'
import { GifCanvas } from '@/utils/canvas'
export default class Model {
  // 坐标
  public x: number = 0
  public y: number = 0

  // 剪切图像
  public sx: number = 0
  public sy: number = 0
  public sw: number = 0
  public sh: number = 0
  public dw: number = 0
  public dh: number = 0

  // 偏移量
  public ox: number = 0
  public oy: number = 0

  // 宽高
  public width: number = 0
  public height: number = 0
  // 缩放比例
  public scale: number = 1

  // 需要阳光值
  public sun: number = 0
  // 产生阳光值
  public sun2: number = 0
  // 等级
  public level: number = 1
  // 生命值
  public hp: number = 100
  // 攻击力
  public ak: number = 20
  // 防御力
  public dfe: number = 0
  
  // 装载速度
  public loadSpeed: number = 1e4
  // 攻击速度
  public akSpeed: number = 5e3

  // 触发攻击的范围
  public akX: number = 10
  public akY: number = 1

  // 所处的层级
  public index: number = 1
  
  // 帧频
  public fps: number = 60
  
  public id: string = ''
  // 类型
  public type: string = ''
  // 名称
  public name: string = ''
  // 创建时间
  public time: number = +new Date
  // 方向: 'left,right'
  public direction: string = ''

  // 死亡
  public die: boolean = false
  // 暂停
  public paused: boolean = false
  // 水生类型
  public aquatic: boolean = false
  public gif: GifCanvas | void = void 0
  public img: HTMLElement | void = void 0
  public image: anyObject = {
  }
  public hitArea: number[] = []
  // scene处于哪些state时, 允许碰撞检测
  public hitState: anyObject<boolean> = {}
  // 默认是否要进行碰撞检测
  public hitAble: boolean = false
  public state: number = 0
  constructor() {}
  public async init(stateChange?: (type: string, url: string, index: number, gif: GifCanvas) => void) {
    if (this.state > 0) { return }
    this.state = 1
    this.initProp()
    if (this.initBefore()) {
      this.gif = await this.initGif()
      await this.gif.toBlobUrl()
      this.img = (await this.gif.loadImage(stateChange))[0]
      await this.setHitArea()
    }
  }
  public initBefore() {
    return true
  }
  public initProp() {
    if (!this.id) {
      this.time = +new Date
      this.id = [this.type, this.name, Math.floor(Math.random() * 1e8).toString(36)].join('/')
    }
  }
  public async initGif(src?: string) {
    let image = this.image
    let gif = this.gif || new GifCanvas(src || path.join(image.path, image.name), this)
    return gif
  }
  public async draw(...rest: any[]) {
  }
  public async animate() {}
  public attack(...rest: any[]) {}
  public stop() {}
  public destory() {}
  public async setHitArea() {
    if (!this.hitArea.length && this.gif) {
      let { x, y, scale } = this
      let img = (await this.gif.imgElems)[0]
      this.hitArea = [x, y, img.width * scale, img.height * scale]
      this.width = img.width
      this.height = img.height
    }
  }
  public trigger(type: string, event?: Event) {}
}