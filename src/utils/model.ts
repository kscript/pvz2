import Model from '@/com/model'

export const replaceTpl = (tpl: string, data: anyObject = {}) => {
  return tpl.replace(/\$\{(.*?)\}/g, (s, $1) => {
    return data[$1] || $1
  })
}

export const mergeOptions = (path: string, name: string, list: string[], options: anyObject, data: anyObject = {}) => {
  list.forEach(item => {
    if (!(options[item] instanceof Object)) {
      options[item] = {}
    }
    options[item].image = Object.assign({
      path,
      name: replaceTpl(name, {
        name: item,
        ...data
      })
    }, options[item].image instanceof Object ? options[item].image : {})
  })
  return options
}

export const getSize = (com: Model, width: number, height: number) => {
  return {
    vw: width / com.scene.config.scaleX,
    vh: height / com.scene.config.scaleY
  }
}
export default {
  getSize,
  replaceTpl,
  mergeOptions
}