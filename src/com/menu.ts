import Model from './model'
import * as path from 'path'
import { GifCanvas } from '@/utils/canvas'
export default class Menu extends Model {
  public options: anyObject = {}
  constructor(name: string, options: anyObject = {}) {
    super()
    this.name = name
    this.type = 'menu'
    this.options = options
    Object.assign(this, options)
  }
}