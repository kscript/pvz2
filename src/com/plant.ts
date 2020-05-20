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
}