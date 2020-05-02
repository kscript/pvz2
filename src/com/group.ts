import Model from './model'

export default class Group extends Model {
  public options: anyObject = {}
  public group: Model[] = []
  constructor(name: string, options: anyObject = {}) {
    super()
    this.name = name
    this.type = 'group'
    this.options = options
  }
}