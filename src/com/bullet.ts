import Model from './model'

export default class Bullet extends Model {
  public options: anyObject = {}
  public source: Model | null =  null
  constructor(name: string, options: anyObject = {}) {
    super()
    this.name = name
    this.type = 'bullet'
    this.options = options
    this.layerIndex = 3
    Object.assign(this, {
      attackAble: true,
      hitAble: false
    }, options)
    this.source = this.options.source || null
  }
  computeAttackArea() {
    this.attackArea[0] = this.x
    this.attackArea2[0] = this.x
  }
}