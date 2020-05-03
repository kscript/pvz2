import Model from '@/com/model'
import { mergeOptions, getSize } from '@/utils/model'

const path = './images/interface/'
const name = '${name}'
const list: string[] = [
  'bgHeader.jpg',
  'bgBody.jpg',
  'bgFooter.jpg'
]
const options: anyObject = mergeOptions(path, name, list, {
  'bgHeader.jpg': {
    personal: {
    },
    draw() {
      let { img, width, height } = this
      let x = this.scene.config.height * .01
      let y = x
      let { vw, vh } = getSize(this, width, height)
      img && this.scene.context.drawImage(img, x, y, vw, vh)
      return { x, y, width: vw, height: vh }
    }
  },
  'bgBody.jpg': {
    draw(data: anyObject) {
      const { 'bgHeader.jpg': header  } = data
      let x = header.x
      let y = header.y + header.height
      let { img, width, height } = this
      this.height = height = (width - 1) / 10 - header.height
      let { vw, vh } = getSize(this, width, height)
      img && this.scene.context.drawImage(img, x, y, vw, vh)
      return { x, y, width: vw, height: vh }
    }
  },
  'bgFooter.jpg': {
    draw(data: anyObject) {
      const { 'bgBody.jpg': body  } = data
      let x = body.x
      let y = body.y + body.height
      let { img, width, height } = this
      let { vw, vh } = getSize(this, width, height)
      img && this.scene.context.drawImage(img, x, y, vw, vh)
      return { x, y, width: vw, height: vh }
    }
  },
})
const group = {
  path,
  name,
  list,
  options
}
export default group