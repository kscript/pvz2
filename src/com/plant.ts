import Model from './model'
export default class Plant extends Model {
  public options: anyObject = {}
  constructor(name: string, options: anyObject = {}) {
    super()
    this.level = 1
    this.name = name
    this.type = 'plant'
    this.options = options
    Object.assign(this, {
      hitAble: true,
      akX: 15
    }, options)

  }
  public dumpBullet(bullet: Model) {
    this.bullets.slice(0).some((item, index) => {
      if (bullet.id === item.id) {
        this.bullets.splice(index, 1)
        return true
      }
    })
  }
  public async drawCard() {
    if (this.gif) {
      let img = await this.gif.currentImg(this.static)
      if (img) {
        let left = 0
        let top = 0
        if (this.padding.length === 2) {
          top = this.padding[0]
          left = this.padding[1]
        } else if (this.padding.length === 4) {
          top = this.padding[0]
          left = this.padding[3]
        }
        if (this.type === 'card' && this.reload && !this.draging) {
          this.scene.context.drawImage(img, this.x + left, this.y + top, this.width, this.height)
          let now = +new Date
          let rate = (now - this.reTime) / this.loadSpeed
          if (rate > 1) {
            rate = 1
          }
          this.scene.context.fillStyle = 'rgba(0, 0, 0, .1)'
          if (this.scene.sun < this.sun) {
            this.scene.context.fillRect(this.x, this.y, this.width + left * 2, this.height + top * 2)
          }
          this.scene.context.fillRect(this.x, this.y, this.width + left * 2, (this.height  + top * 2 ) * (1 - rate))
          this.scene.context.fillStyle = 'rgba(0, 0, 0, 0)'
        } else {
          if (this.draging) {
            this.scene.context.drawImage(img, this.x + left, this.y + top, this.width, this.height)
          } else {
            this.scene.context.drawImage(img, this.x, this.y, this.width, this.height)
          }
        }
      }
    }
  }
}