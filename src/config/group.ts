import Model from '@/com/model'
import { mergeOptions, getSize } from '@/utils/model'

const path = './images/interface/'
const name = '${name}'
const list: string[] = [
  'bgHeader.jpg',
  'bgBody.jpg',
  'bgFooter.jpg',
  'dialog_header.png',
  'dialog_topleft.png',
  'dialog_topmiddle.png',
  'dialog_topright.png',
  'dialog_centerleft.png',
  'dialog_centermiddle.png',
  'dialog_centerright.png',
  'dialog_bottomleft.png',
  'dialog_bottommiddle.png',
  'dialog_bottomright.png'
]
const options: anyObject = mergeOptions(path, name, list, {
  'bgHeader.jpg': {
    personal: {
    },
    draw() {
      let { img, width, height } = this
      let x = this.scene.config.height * .01
      let y = x
      img && this.scene.context.drawImage(img, x, y, width, height)
      return { x, y, width, height }
    }
  },
  'bgBody.jpg': {
    draw(data: anyObject) {
      const { 'bgHeader.jpg': header  } = data
      let x = header.x
      let y = header.y + header.height
      let { img, width, height } = this
      this.height = height = width / 10 - 1 - header.height
      img && this.scene.context.drawImage(img, x, y, width, height)
      return { x, y, width, height }
    }
  },
  'bgFooter.jpg': {
    draw(data: anyObject) {
      const { 'bgBody.jpg': body  } = data
      let x = body.x
      let y = body.y + body.height
      let { img, width, height } = this
      img && this.scene.context.drawImage(img, x, y, width, height)
      return { x, y, width, height }
    }
  },
  'dialog_header.png': {
    medias: {
      tl: 'dialog_topleft.png',
      tm: 'dialog_topmiddle.png',
      tr: 'dialog_topright.png',
      cl: 'dialog_centerleft.png',
      cm: 'dialog_centermiddle.png',
      cr: 'dialog_centerright.png',
      bl: 'dialog_bottomleft.png',
      bm: 'dialog_bottommiddle.png',
      br: 'dialog_bottomright.png'
    },
    async draw() {
      let { img, width, height } = this
      let x = (this.scene.config.width - width ) / 2
      let y = this.scene.config.height * .2
      let startX = x - width * 2.5
      let startY = y + height
      let iw = 0
      let ih = 0
      let gifs = await [
        'tl', 'tm', 'tr',
        'cl', 'cm', 'cr',
        'bl', 'bm', 'br'
      ].map(async (item, index) => {
        let gif = this.gifs[item]
        let img = await gif.currentImg()
        if (index % 3 === 0) {
          startX = x - width
          if (index) {
            startY += ih
          }
        } else {
          startX += iw
        }
        iw = img.width
        ih = img.height
        if (index % 3 === 1) {
          iw = width * 2
        }
        if (~~(index / 3) === 1) {
          ih = height * 3
        }
        this.scene.context.drawImage(img, startX, startY, iw, ih)
        return gif
      })
      img && this.scene.context.drawImage(img, x, y, width, height)
    }
  }
})
const group = {
  path,
  name,
  list,
  options
}
export default group