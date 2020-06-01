import * as path from 'path'
import Scene from '@/scene'
import { GifCanvas, offlineCanvas, OfflineCanvas } from '@/utils/canvas'
import { drawHitArea } from '@/utils/hit'
import { isEmpty } from '@/utils'
import { sendMessage } from '@/utils/message'
// @ts-ignore
import Tween from 'tween.js'
import Control from '@/utils/control'
import { Clock } from '@/utils/clock'

const info: anyObject = {
  plant: '植物',
  bullet: '子弹',
  zombie: '僵尸',
  card: '卡片',
  menu: '菜单/背景',
  group: '群组'
}
const messageText: anyObject = {
  initProp: {
    plant: '已安放',
    bullet: '装填完毕',
    zombie: '正在靠近'
  }
}
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
  public sun: number = 50
  // 产生阳光值
  public sun2: number = 0
  // 等级
  public level: number = 1
  // 生命值
  public hp: number = 100
  // 攻击力
  public ak: number = 25
  // 防御力
  public dfe: number = 10
  public akEffect: number = 1
  public dfeEffect: number = 1
  
  // 装载速度
  public loadSpeed: number = 1e4
  public moveSpeedX: number = 0
  
  // 触发攻击的范围
  public akX: number = 1
  public akY: number = 1
  
  // 攻击速度
  public attackSpeed: number = 3e3
  public attackTime: number = +new Date
  public attackMoveX: number = 1.5
  public attackMoveY: number = 0
  public attackX: number = 0
  public attackY: number = 0

  // 所处的层级
  public index: number = 1
  
  // 帧频
  public fps: number = 6
  
  public id: string = ''
  // 类型
  public type: string = ''
  // 名称
  public name: string = ''
  // 创建时间
  public time: number = 0
  // 方向: 'left,right'
  public direction: string = ''

  public static: boolean = false
  // 死亡
  public die: boolean = false
  public dying: boolean | void = false
  // 暂停
  public paused: boolean = false
  // 水生类型
  public aquatic: boolean = false
  public gif: GifCanvas | null = null
  // 额外的一些资源
  public medias: anyObject<string> | anyObject = {}
  // 额外资源解析结果
  public gifs: anyObject<GifCanvas> = {}
  // 所有资源总计帧数
  public total: number = 0

  public img: HTMLImageElement | void = void 0
  public image: anyObject = {
  }
  public hitArea: number[] = []
  public attackArea: number[] = []
  // 被攻击范围
  public attackArea2: number[] = []
  // 放入场景后的位置
  public pos: number[] = [0, 0]
  // 繁忙状态
  public pending = false
  // scene处于哪些state时, 允许碰撞检测
  public hitState: anyObject<boolean> = {}
  // 默认是否要进行碰撞检测
  public hitAble: boolean = false
  public attackAble: boolean = false
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
  public options: anyObject = {}
  public bullets: Model[] = []
  public target: Model | null = null
  public source: Model | null = null
  public bulletName = ''
  public opacity: number = 1
  public padding =  []
  public reload: boolean = false
  public draging: boolean = false
  public reTime: number = +new Date
  public tween: Tween | null = null
  public complete: boolean = false
  public controls: anyObject<Control> = {}
  public clocks: anyObject<Clock> = {}
  public layerIndex = 0
  constructor() {}
  get canUse() {
    if (this.reload) {
      if (this.scene.sun < this.sun || +new Date - this.loadSpeed < this.reTime) {
        return false
      }
    }
    return true
  }
  public async init(stateChange?: (type: string, url: string, index: number, gif: GifCanvas, total?: number) => void) {
    if (this.state > 0) { return }
    this.state = 1
    this.initProp()
    if (this.initBefore()) {
      // gif和img属性可以缓存到options里, 如果要复制组件, 可以直接复用或手动重置
      if (!this.gif) {
        this.gif = await this.initGif()
        await this.gif.toBlobUrl()
      }
      this.gif.start = () => {
        this.gifStart()
      }
      const gifs: GifCanvas[] = []
      if (!isEmpty(this.medias) && isEmpty(this.gifs)) {
        await Promise.all(Object.keys(this.medias).map(async (key: string) => {
          let name = this.medias[key]
          let imgPath = this.image.path
          let options = {}
          if (this.medias[key] instanceof Object) {
            name =  this.medias[key].name
            imgPath = this.medias[key].path || imgPath
            options = this.medias[key].options instanceof Object ? this.medias[key].options : {}
          }
          if (name && typeof name === 'string') {
            gifs.push(this.gifs[key] = await new GifCanvas(path.join(imgPath, name), this, Object.assign({ key }, options)))
            await this.gifs[key].toBlobUrl()
          }
          return this.gifs[key]
        }))
        let len = 0
        await Promise.all(gifs.map(gif => {
          gif.loadImage((type, url, index, gif) => {
            if (index === gif.imageUrls.length - 1) {
              sendMessage(info[this.type] + this.id + '资源' + gif.options.key +'加载完成!', {
                type: 'Model::init',
                source: this
              })
              typeof stateChange === 'function' && stateChange(type, url, len++, gif, gifs.length + gif.imageUrls.length - 1)
            }
          })
        }))
        this.gifs['default'] = this.gif
      }
      if (!this.img) {
        let total = gifs.length + this.gif.imageUrls.length - 1
        this.img = (await this.gif.loadImage((type, url, index, gif) => {
          typeof stateChange === 'function' && stateChange(type, url, gifs.length + index, gif, total)
          if (gifs.length + index === total) {
            sendMessage(info[this.type] + this.id + '加载完成!', {
              type: 'Model::init',
              source: this
            })
          }
        }))[0]
      }
      await this.setHitArea()
      Object.assign(this.options, {
        gif: this.gif,
        img: this.img,
        gifs: this.gifs,
        medias: this.medias
      })
      Object.assign(this.controls, this.initControl())
    }
  }
  public initBefore() {
    return true
  }
  public initControl() {}
  public initProp() {
    if (!this.id) {
      this.time = +new Date
      this.id = [this.type, this.name, Math.floor(Math.random() * 1e8).toString(36)].join('/')
      this.moveSpeedX = (this.personal || this).moveSpeedX || 0
      sendMessage(info[this.type] + ':' + this.id + (this.scene.state === 'init' ? '准备加载' : messageText.initProp[this.type] || '创建成功!'), {
        type: 'Model::initProp',
        source: this
      })
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
      let img = await this.gif.currentImg(this.static)
      img && this.scene.selectContext(this).drawImage(img, this.x, this.y, this.width, this.height)
    }
  }
  public drag(event: Event, oldEvent: Event) {}
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
  public run() {
    if (this.gif) {
      this.x += this.moveSpeedX / this.gif.length
    }
  }
  public gifStart() {
    // this.x += this.moveSpeedX
  }
  public async dyingEffect(){
    await this.dieEffect()
  }
  public async dieEffect() {
    await this.fadeOut()
  }
  public restore(){
    this.pending = false
  }
  public async beforeDestory() {}
  public async afterDestory() {}
  // 不建议重写, 如果需要在销毁时做一些事, beforeDestory 和 afterDestory 就足够了
  public async destroy() {
    await this.beforeDestory()
    this.die = true
    // this.clear()
    await this.afterDestory()
  }
  public clear() {
    for(let k in this) {
      if (this.hasOwnProperty(k) && this[k] instanceof Object) {
        delete this[k]
      }
    }
  }
  public async fadeOut(gif?: GifCanvas, img?: HTMLImageElement, num: number = .025) {
    const context = this.scene.selectContext(this)
    if (this.opacity >= 0) {
      this.opacity -= num
      if (this.opacity <= 0) {
        await this.destroy()
      } else {
        gif = gif || this.gif || this.gifs.default
        if (img || gif) {
          img = img || await gif.currentImg(this.static)
          if (img) {
            context.globalAlpha = this.opacity
            context.drawImage(img, this.x, this.y, this.width, this.height)
            context.globalAlpha = 1
          }
        }
      }
    } else {
      await this.destroy()
    }
  }
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
    this.setAttackArea()
  }
  public setAttackArea() {
    let { akX, akY, pos } = this
    let  { colScale, rowScale } = this.scene
    let [l, t, w, h, width, height] = this.scene.validArea
    // -2是为了不出现正好两边相交的情况
    if (this.type === 'plant') {
      this.attackArea = [l + (pos[0] * colScale - .75) * width, t  + pos[1] * rowScale * height, akX * width, akY * height - 2]
      this.attackArea2 = [l + (pos[0] * colScale - .75) * width, t  + pos[1] * rowScale * height, width, height - 2]
    } else if (this.type === 'bullet') {
      this.attackArea = [0, t  + pos[1] * height, this.width, this.height]
      this.attackArea2 = [0, t  + pos[1] * height, this.width, this.height]
    } else {
      this.attackArea = [l + pos[0] * width, t  + pos[1] * height, akX * width, akY * height - 2]
      this.attackArea2 = [0, t + pos[1] * height, width, height - 2]
    }
  }
  public drawHitArea(color = 'red', cxt = this.scene.selectContext(this), area = this.hitArea) {
    let len = area.length
    if (len === 4) {
      drawHitArea(color, cxt, [this.x, this.y, area[2], area[3]])
    } else if (len && len > 4 && len % 2 === 0){
      drawHitArea(color, cxt, area)
    }
  }
  public trigger(type: string, event?: Event) {}
  public async setAttackResult(com: Model){
    const num = this.ak * this.akEffect - com.dfe * com.dfeEffect
    com.hp -= num >= 0 ? num : 0
    sendMessage([info[this.type], this.id, '击中', info[com.type], com.id, '造成了' + num + '伤害', '剩余' + com.hp].join(''), {
      type: 'Model::setAttackResult',
      source: this,
      target:com,
    })
    if (com.hp <= 0) {
      com.dying = true
    }
  }
}