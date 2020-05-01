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
    public imageDatas: Promise<ImageData[]>
    public imageUrls: string[] = []
    public imgElems: Promise<HTMLImageElement[]> = Promise.resolve([])
    public index: number = 0
    public time: number = +new Date()
    public type: string = 'gif'
    constructor(url: string, parent: Model) {
        this.url = url
        const { x, y, fps } = parent
        this.options = Object.assign({
            fps: 20,
            x: 0,
            y: 0
        }, { x, y, fps })
        const type = path.extname(url).slice(1)
        this.type = type
        this.imageDatas = this.parseGif(url)
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
        let datas = await this.imageDatas as ImageData[]
        return this.imageUrls = datas.map(item => {
            let buffer = toPng(item)
            let blob = new Blob([buffer])
            return URL.createObjectURL(blob)
        })
    }
    public async loadImage(stateChange: (type: string, url: string, index: number, gif: GifCanvas) => void = () => {}): Promise<HTMLImageElement[]> {
        let imgs: HTMLImageElement[] = []
        let len = this.imageUrls.length
        let current = 0
        return this.imgElems = new Promise((resolve, reject) => {
            this.imageUrls.map((url, index) => {
                return loadImg(url).then(img => {
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
    public async currentImg() {
        let elms = await this.imgElems
        if (this.type !== 'gif') {
            return elms[0]
        }
        let time = new Date().getTime() - this.time
        let len = this.imageUrls.length
        let vlen = len * (this.options.alternate ? 2 : 1)
        let index = (~~(time / 1000 * this.options.fps)) % vlen
        let vIndex = index < len ? index : vlen - index - 1
        return elms[vIndex]
    }
}
export default GifCanvas