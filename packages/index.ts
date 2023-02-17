import type { App } from 'vue'
import MultiCascader from './components/index'
import { Select, Dropdown, Empty, Checkbox, Button } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const components = [MultiCascader, Select, Dropdown, Empty, Checkbox, Button]
const install = (app: App) => {
  components.map((component) => {
    component.install(app)
  })
}

export default {
  install,
  MultiCascader
}
