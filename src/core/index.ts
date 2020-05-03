import Scene from '@/scene'
import config from '@/config'
import { execHook } from '@/utils'

export const Core = async (container: HTMLCanvasElement) => {
  const scene = new Scene(container, config)
  // @ts-ignore
  window.scene = scene
  await execHook(scene, 'beforeInit')
  await execHook(scene, 'init')
  await execHook(scene, 'mount')
  await execHook(scene, 'beforePlay')
  await execHook(scene, 'play')
  await execHook(scene, 'beforeGame')
  await execHook(scene, 'startGame')
  await execHook(scene, 'afterGame')
  await execHook(scene, 'afterPlay')
  return scene
}
export default Core