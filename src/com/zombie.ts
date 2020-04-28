import Model from './model'

export default class Zombie extends Model {
  public options: anyObject = {}
  constructor(name: string, options: anyObject = {}) {
    super()
    this.name = name
    this.type = 'zombie'
    this.options = options
    Object.assign(this, {
      hitAble: true
    }, options)
  }
}