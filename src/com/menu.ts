import Model from './model'
export default class Menu extends Model {
  public options: anyObject = {}
  constructor(name: string, options: anyObject = {}) {
    super()
    this.name = name
    this.type = 'menu'
    this.options = options
    this.layerIndex = 2
    Object.assign(this, options)
  }
}