import MultiCascader from './MultiCascader'
import type { App } from 'vue'

MultiCascader.install = (app: App) => {
  app.component(MultiCascader.name, MultiCascader)
}
export default MultiCascader
