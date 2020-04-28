import Model from './model'

export default class Zombie extends Model {
  public options: anyObject = {}
  constructor(type: string, options: anyObject = {}) {
    super()
    this.type = type
    this.options = options
    Object.assign(this, options)
  }
}