import { defineComponent, PropType } from 'vue'
import Popup from './Popup'
import { ref } from 'vue'
import type { Option } from '/#/MultiCascader'
import styles from './MultiCascader.module.scss'

export default defineComponent({
  name: 'MultiCascader',
  inheritAttrs: false,
  components: {
    Popup
  },
  props: {
    value: {
      type: Array as PropType<string[]>,
      required: true
    },
    placeholder: String,
    data: {
      type: Array as PropType<Option[]>,
      required: true
    },
    loadData: {
      type: Function as PropType<(selectedOptions: Option) => void>,
      required: true
    },
    style: [String, Object]
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const visible = ref<boolean>(false)
    // 选择事件
    const handleSelected = (selected: string[]) => {
      emit('update:value', selected)
    }
    // 修改选择事件
    const handleChangeSelect = (value: string[]) => {
      emit('update:value', value)
    }
    return {
      visible,
      handleSelected,
      handleChangeSelect
    }
  },
  render(ctx: any) {
    return (
      <a-dropdown
        v-model:visible={ctx.visible}
        trigger={['click']}
        overlayStyle={{ boxShadow: '0 2px 8px rgb(0 0 0 / 15%)', backgroundColor: '#fff' }}>
        {{
          default: () => (
            <a-select
              class={styles['ant-select']}
              value={ctx.value}
              placeholder={ctx.placeholder}
              mode="multiple"
              open={false}
              style={ctx.style}
              onChange={ctx.handleChangeSelect}></a-select>
          ),
          overlay: () => {
            if (ctx.data.length === 0)
              return (
                <div class={styles['no-data']}>
                  <a-empty class={styles['ant-empty']} />
                </div>
              )
            else
              return (
                <popup
                  visible={ctx.visible}
                  selected={ctx.value}
                  data={ctx.data}
                  loadData={ctx.loadData}
                  onChange={ctx.handleSelected}
                  onClose={() => (ctx.visible = false)}></popup>
              )
          }
        }}
      </a-dropdown>
    )
  }
})
