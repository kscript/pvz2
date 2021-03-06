import pixelGif from 'pixel-gif'
import { toPng } from '@rgba-image/png'
import Model from '@/com/model'
import * as path from 'path'
export class OfflineCanvas {
    public width: number
    public height: number
    public context: CanvasContextEx
    public canvas: HTMLCanvasElement
    public imageData: ImageData | null = null
    constructor(width: number = 100, height: number = 100) {
        this.width = width
        this.height = height
        this.canvas = document.createElement('canvas')
        this.context = <CanvasContextEx>this.canvas.getContext('2d')
        return this
    }
    drawImage(img: HTMLImageElement) {
        this.context.drawImage(img, 0, 0, this.width, this.height)
        return this
    }
    putImageData(...rest: any[]) {
        if(!rest.length) return this
        const [imageData, width, height] = rest
        if (rest.length === 3) {
            this.clear().resize(width, height)
        }
        this.imageData = imageData
        return this
    }
    getImageData(...rest: any[]): ImageData {
        const [img, width, height] = rest
        if (rest.length === 1) {
            return this.clear().drawImage(img).getImageData()
        } else if (rest.length === 3) {
            return this.clear().resize(width, height).drawImage(img).getImageData()
        }
        return this.imageData = this.context.getImageData(0, 0, this.width, this.height)
    }
    resize(width: number, height: number) {
        this.canvas.width = this.width = width
        this.canvas.height = this.height = height
        return this
    }
    clear() {
        this.imageData = null
        this.context.clearRect(0, 0, this.width, this.height)
        return this
    }
}
export const offlineCanvas = new OfflineCanvas
export const fileOrBlobToDataURL = (obj:Blob) => {
	const file = new FileReader();
    file.readAsDataURL(obj);
    return new Promise((resolve, reject) => {
        file.onload = (e: ProgressEvent) => {
            // @ts-ignore
            resolve(e.target.result)
        }
        file.onerror = (e: ProgressEvent) => {
            // @ts-ignore
            reject(e)
        }
    })
}
export const loadImg = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img:HTMLImageElement = document.createElement('img')
        img.onload = () => {
            resolve(img)
        }
        img.onerror = (err) => {
            reject(err)
        }
        img.src = url
    })
}
const errImg = document.createElement('img')
export class GifCanvas {
    public url: string = ''
    public options: anyObject = {}
    public imageUrls: string[] = []
    public imgElems: Promise<HTMLImageElement[]> = Promise.resolve([])
    public index: number = 0
    public time: number = +new Date()
    public type: string = 'gif'
    public length: number = 0
    public width: number = 0
    public height: number = 0
    public parent: Model
    public imageDatas: Promise<ImageData[]> | void = void 0
    constructor(url: string, parent: Model, options: anyObject = {}) {
        this.url = url
        const { x, y, fps } = parent
        this.options = Object.assign({
            fps: 6,
            x: 0,
            y: 0
        }, { x, y, fps }, options)
        const type = path.extname(url).slice(1)
        this.width =  this.options.width || this.width
        this.height =  this.options.height || this.height
        this.type = type
        this.parent = parent
    }
    public async parseGif(url: string) {
        if (this.type !== 'gif') {
            return new ImageData(1, 1)
        }
        return pixelGif.parse(url)
    }
    public async toBlobUrl() {
        if (this.type !== 'gif') {
            return this.imageUrls = [this.url]
        }
        this.imageDatas = this.imageDatas || this.parseGif(this.url)
        let datas = await this.imageDatas as ImageData[]
        return this.imageUrls = datas.map(item => {
            let buffer = toPng(item)
            let blob = new Blob([buffer])
            return URL.createObjectURL(blob)
        })
    }
    public async loadImage(stateChange: (type: string, url: string, index: number, gif: GifCanvas) => void = () => {}): Promise<HTMLImageElement[]> {
        let imgs: HTMLImageElement[] = []
        let len = this.length = this.imageUrls.length
        let current = 0
        return this.imgElems = new Promise((resolve, reject) => {
            this.imageUrls.map((url, index) => {
                return loadImg(url).then(img => {
                    this.width = this.width || img.width * this.parent.scene.config.scaleX
                    this.height = this.height || img.height * this.parent.scene.config.scaleY
                    current++
                    imgs[index] = img
                    stateChange('success', url, index, this)
                    if (current === len) {
                        resolve(imgs)
                    }
                }).catch(err => {
                    current++
                    imgs[index] = errImg
                    stateChange('error', url, index, this)
                    if (current === len) {
                        resolve(imgs)
                    }
                })
            })
        })
    }
    public extend(options: anyObject = {}) {
        return Object.assign(this, options)
    }
    public async currentImg(first: boolean = false, index?: number) {
        let elms = await this.imgElems
        let vIndex = typeof index !== 'undefined' ? index : this.index || 0
        if (this.options.once && this.length === this.index + 1) {
            return 
        }
        if (this.type !== 'gif' || first) {
            vIndex = typeof index !== 'undefined' ? index : 0
        } else {
            let now = +new Date
            let time = now - this.time
            if (time >= 1000 / this.options.fps) {
                this.time = now
                let len = this.imageUrls.length
                vIndex = this.index = typeof index !== 'undefined' ? index : (this.index + 1) % len
            }
        }
        if (this.index === 0) {
            this.start()
        }
        return elms[vIndex]
    }
    start() {}
}
export default GifCanvas