let level = Number(localStorage.getItem('level') || 1)
export default {
  default: isNaN(level) || level < 1 ?  1 : ~~level,
}