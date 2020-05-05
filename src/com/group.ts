import Model from './model'

export default class Group extends Model {
  public options: anyObject = {}
  constructor(name: string, options: anyObject = {}) {
    super()
    this.name = name
    this.type = 'group'
    this.options = options
    Object.assign(this, options)
  }
}