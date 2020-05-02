import { mergeOptions } from '@/utils/model'

const path = './images/Plants/'
const name = '${name}.gif'
const list: string[] = [
  'PB01',
  'PB10',
  'PB-10'
]
const options: anyObject = mergeOptions(path, name, list, {})
const zombie = {
  path,
  name,
  list,
  options
}
export default zombie