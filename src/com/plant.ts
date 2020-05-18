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
      akX: 9
    }, options)
  }
}