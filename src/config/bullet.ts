import { replaceTpl } from '@/utils'

const path = './images/Plants/'
const name = '${name}.gif'
const list: string[] = [
  'PB01',
  'PB10',
  'PB-10'
]
const mergeOptions = (options: anyObject) => {
  list.forEach(item => {
    if (!(options[item] instanceof Object)) {
      options[item] = {}
    }
    options[item].image = Object.assign({
      path,
      name: replaceTpl(name, {
        name: item
      })
    }, options[item].image instanceof Object ? options[item].image : {})
  })
  return options
}
const options: anyObject = mergeOptions({})
const zombie = {
  path,
  name,
  list,
  options
}
export default zombie