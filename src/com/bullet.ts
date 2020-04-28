import Model from './model'

export default class Bullet extends Model {
  public options: anyObject = {}
  constructor(name: string, options: anyObject = {}) {
    super()
    this.name = name
    this.type = 'menu'
    this.options = options
    Object.assign(this, {
      hitAble: true
    }, options)
  }
}