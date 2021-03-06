
export const hitTest = (...rest: number[]) => {
  const [x1, y1, x, y, w, h] = rest
  return x1 >= x && x1 <= x + w && y1 >= y && y1 <= y + h
}
export const hitTest2 = (a: number[], b: number[]) => {
  const [x1, y1, w1, h1] = a
  const [x2, y2, w2, h2] = b
  return isCollide([
    x1, y1, x1 + w1, y1, x1 + w1, y1 + h1, x1, y1 + h1
  ], [
    x2, y2, x2 + w2, y2, x2 + w2, y2 + h2, x2, y2 + h2
  ])
}
const dotV2 = (v1: anyObject<number>, v2: anyObject<number>) => {
  return v1.x * v2.x + v1.y * v2.y
}
const calcProj = (axis: anyObject<number>, polyArr: number[]) => {
  let v = { "x": polyArr[0], "y": polyArr[1] }
  let d, min, max
  min = max = dotV2(axis, v)
  for (let i = 2; i < polyArr.length - 1; i += 2) {
      v.x = polyArr[i]
      v.y = polyArr[i + 1]
      d = dotV2(axis, v)
      min = (d < min) ? d : min
      max = (d > max) ? d : max
  }
  return [min, max]
}
const segDist = (min1: number, max1: number, min2: number, max2: number) => {
  if (min1 < min2) {
      return min2 - max1
  } else {
      return min1 - max2
  }
}
export const isCollide = (p1: number[], p2: number[]) => {
  let e = { "x": 0, "y": 0 }
  let p = p1, idx = 0, len1 = p1.length, len2 = p2.length, px, py
  for (let i = 0, len = len1 + len2; i < len - 1; i += 2)
  {
      idx = i
      if (i > len1) {
          p = p2
          idx = (i - len1)
      }
      if (i === p.length - 2) {
          px = p[0] - p[idx]
          py = p[1] - p[idx + 1]
      } else {
          px = p[idx + 2] - p[idx]
          py = p[idx + 3] - p[idx + 1]
      }
      e.x = -py
      e.y = px
      let pp1 = calcProj(e, p1)
      let pp2 = calcProj(e, p2)
      if (segDist(pp1[0], pp1[1], pp2[0], pp2[1]) > 0) {
          return false
      }
  }
  return true
}
export const drawHitArea = (color = 'red', cxt: CanvasContextEx, area: number[] = []) => {
  let len = area.length
  cxt.strokeStyle = color
  if (len === 4) {
    // @ts-ignore
    cxt.strokeRect.apply(cxt, area)
  } else if (len && len > 4 && len % 2 === 0){
    cxt.beginPath()
    cxt.moveTo(area[0], area[1])
    for(let i = 2; i < len; i += 2) {
      cxt.lineTo(area[i], area[i+1])
    }
    cxt.closePath()
    cxt.stroke()
  }
}

export default {
  hitTest,
  isCollide,
  drawHitArea
}