import Model from './model'
import * as path from 'path'
import { GifCanvas } from '@/utils/canvas'
export default class Menu extends Model {
  public options: anyObject = {}
  constructor(type: string, options: anyObject = {}) {
    super()
    this.type = type
    this.options = options
    Object.assign(this, options)
  }
}