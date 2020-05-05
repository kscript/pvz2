import * as path from 'path'
import Scene from '@/scene'
import { GifCanvas, offlineCanvas, OfflineCanvas } from '@/utils/canvas'
import { drawHitArea } from '@/utils/hit'
export default class Model {
  // 坐标
  public x: number = 0
  public y: number = 0

  // 偏移量
  public ox: number = 0
  public oy: number = 0

  // 宽高
  public width: number = 0
  public height: number = 0
  // 缩放比例
  public scaleX: number = 1
  public scaleY: number = 1

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
  public fps: number = 12
  
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
  public img: HTMLImageElement | void = void 0
  public image: anyObject = {
  }
  public hitArea: number[] = []
  // scene处于哪些state时, 允许碰撞检测
  public hitState: anyObject<boolean> = {}
  // 默认是否要进行碰撞检测
  public hitAble: boolean = false
  public state: number = 0
  // @ts-ignore
  public scene: Scene
  public col: number = 0
  public row: number = 0
  public ctype: string = ''
  // 矩形左上方顺时针四个顶点
  // 使用正负值作为方向
  public tilt1: number = 0
  public tilt2: number = 0
  public tilt3: number = 0
  public tilt4: number = 0
  // 坐标偏移
  public tiltX: number = 1
  public tiltY: number = 1
  // 大小
  public tiltW: number = 1
  public tiltH: number = 1
  // 剪切图像
  public startX: number = 0
  public startY: number = 0
  public personal: anyObject = {}
  public data: anyObject = {}
  public group: Model[] = []
  public imageData: ImageData | void = void 0
  public offlineCanvas: OfflineCanvas = offlineCanvas
  public coms: Model[] = []
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
  public createImageData(img?: HTMLImageElement) {
    if (img || this.img) {
      return this.imageData = offlineCanvas.getImageData(img || this.img, this.width, this.height)
    }
    return new ImageData(1, 1)
  }
  public async draw(...rest: any[]) {
    if (this.gif) {
      let img = await this.gif.currentImg()
      img && this.scene.context.drawImage(img, this.x, this.y, this.width, this.height)
    }
  }
  public async drawGroup(...rest: any[]) {
    const res = await this.draw(...rest)
    this.group.reduce(async (prev: anyObject, curr: Model) => {
      const data = await prev
      const res = await curr.draw(data)
      return Object.assign(data, {
        [curr.name]: res !== void 0 ? res : curr
      })
    }, Promise.resolve({
      [this.name]: res !== void 0 ? res : this
    }))
  }
  public async animate(...rest: any[]) {}
  public attack(...rest: any[]) {}
  public stop() {}
  public destory() {}
  public async setHitArea(refresh: boolean = false) {
    if ((!this.hitArea.length || refresh) && this.gif) {
      let img = this.img || (await this.gif.imgElems)[0]
      let { x, y, scaleX, scaleY, tilt1, tilt2, tilt3, tilt4, tiltX, tiltY, tiltW, tiltH } = this
      if (!refresh) {
        this.width = img.width * this.scene.config.scaleX
        this.height = img.height * this.scene.config.scaleY
      }
      if ([tilt1, tilt2, tilt3, tilt4].some(item => item !== 0) || tiltX !== 1 || tiltY !== 1) {
        const strength = new Array(8)
        ~[tilt1, tilt2, tilt3, tilt4].forEach((item, index) => {
          const num = index % 2 + ~~(index / 2)
          strength[num * 2 + index] = item
          strength[(num * 2 + index + 2) % 8] = item
        })
        const width = this.width * tiltW
        const height = this.height * tiltH
        // 计算倾斜时的hitArea
        this.hitArea = [
          x, y,
          x + width * scaleX, y,
          x + width * scaleX, y + height * scaleY,
          x, y + height * scaleY
        ].map((item, index) => {
          item *= (index % 2 ? tiltY : tiltX)
          return item * (1 + strength[index])
        })
      } else {
        this.hitArea = [x, y, this.width * scaleX, this.height * scaleY]
      }
    }
  }
  public drawHitArea(color = 'red', cxt = this.scene.context, area = this.hitArea) {
    let len = area.length
    if (len === 4) {
      drawHitArea(color, cxt, [this.x, this.y, area[2], area[3]])
    } else if (len && len > 4 && len % 2 === 0){
      drawHitArea(color, cxt, area)
    }
  }
  public trigger(type: string, event?: Event) {}
}