import { mergeOptions } from '@/utils/model'

const path = './images/interface/'
const name = '${name}'
const list: string[] = [
]
const options: anyObject = mergeOptions(path, name, list, {})
const group = {
  path,
  name,
  list,
  options
}
export default group