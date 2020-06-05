import Model from './model'

export default class Zombie extends Model {
  public options: anyObject = {}
  constructor(name: string, options: anyObject = {}) {
    super()
    this.level = 2
    this.name = name
    this.type = 'zombie'
    this.options = options
    this.layerIndex = 4
    Object.assign(this, {
      attackAble: true,
      hitAble: false
    }, options)
  }
  computeAttackArea() {
    let [l, t, w, h, width, height] = this.scene.validArea
    this.attackArea[0] = this.x + width
    this.attackArea2[0] = this.x + width
  }
}