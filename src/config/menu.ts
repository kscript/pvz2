import { replaceTpl } from '@/utils'

const path = './images/interface/'
const name = '${name}'
const list: string[] = [
  // 游戏场景
  'background1.jpg',
  'background1unsodded.jpg',
  'background1unsodded_1.jpg',
  'background1unsodded2.jpg',
  'background2.jpg',
  'background3.jpg',
  'background4.jpg',
  'background5.jpg',
  'background6boss.jpg',
  // 戴夫
  'Dave.gif',
  'Dave2.gif',
  'Dave3.gif',
  // 菜单背景
  'Surface.jpg',
  // 向日葵
  'Sunflower_trophy8.png',
  // 阳光
  'Sun.gif',
  // 商店
  'SelectorScreen_Store.png',
  // 花园
  'SelectorScreen_ZenGarden.png',
  // 图鉴
  'SelectorScreen_Almanac.png',
  // logo
  'popcap_logo.png'
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
const menu = {
  path,
  name,
  list,
  options
}
export default menu