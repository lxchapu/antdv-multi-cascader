import { RightOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { ref, defineComponent, PropType, watch, onMounted } from 'vue'
import type { Option, Menu } from '/#/MultiCascader'
import styles from './Popup.module.scss'

export default defineComponent({
  name: 'Popup',
  components: {
    RightOutlined,
    LoadingOutlined
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    // 传入的选中选项
    selected: {
      type: Array as PropType<string[]>,
      required: true
    },
    // 传入的选项
    data: {
      type: Array as PropType<Option[]>,
      required: true
    },
    // 加载子选项的回调
    loadData: {
      type: Function as PropType<(selectedOptions: Option) => void>,
      required: true
    }
  },
  emits: ['change', 'close'],
  setup(props, { emit }) {
    // 选项列表
    const menus = ref<Menu[]>([])
    // 是否有选项在加载
    const isLoadData = ref<boolean>(false)
    // 激活的选项
    const activeItems = ref<number[]>([])
    // 点击选项
    const handleClickColumnItem = async (menuIndex: number, index: number) => {
      if (isLoadData.value) {
        return
      }
      isLoadData.value = true
      activeItems.value.splice(menuIndex, activeItems.value.length, index)
      let selectedOptions = menus.value[menuIndex][index]
      menus.value.splice(menuIndex + 1)
      if (!selectedOptions.children && !selectedOptions.isLeaf) {
        selectedOptions.isLoading = true
        await props.loadData(selectedOptions)
        selectedOptions.isLoading = false
        delete selectedOptions.isLoading
      }
      if (selectedOptions.children) {
        if (selectedOptions.isChecked) {
          updateChildrenState(selectedOptions)
        }
        menus.value.push(selectedOptions.children)
      }
      isLoadData.value = false
    }
    // 选中选项
    const handleChangeCheckbox = (menuIndex: number, index: number) => {
      let selectedOptions = menus.value[menuIndex][index]
      selectedOptions.isChecked = !selectedOptions.isChecked
      updateChildrenState(selectedOptions)
      updateParentState(menuIndex, index)
    }
    // 检查是否为半选的状态
    const getIndeterminate = (menuIndex: number, index: number) => {
      let selectedOptions = menus.value[menuIndex][index]
      if (selectedOptions.isLeaf) {
        return false
      } else if (selectedOptions.children) {
        let length = 0
        selectedOptions.children?.forEach((item) => {
          if (item.isChecked) length += 1
        })
        return length > 0 && length < selectedOptions.children?.length
      } else {
        return false
      }
    }
    // 更新子节点状态
    const updateChildrenState = (selectedOptions: Option) => {
      if (selectedOptions.children) {
        selectedOptions.children.forEach((item) => {
          item.isChecked = selectedOptions.isChecked
          updateChildrenState(item)
        })
      }
    }
    // 更新父节点状态
    const updateParentState = (menuIndex: number, index: number) => {
      if (menuIndex === 0) return
      let parent = menus.value[menuIndex - 1][activeItems.value[menuIndex - 1]]
      let length = 0
      menus.value[menuIndex].forEach((item) => {
        if (item.isChecked) length += 1
      })
      parent.isChecked = length === menus.value[menuIndex].length
      updateParentState(menuIndex - 1, activeItems.value[menuIndex - 1])
    }
    // 获取选中选项
    const getSelected = (options: Option[]) => {
      let selected: string[] = []
      options.forEach((item) => {
        if (item.isChecked) {
          selected.push(item.value)
        } else if (item.children) {
          selected.push.apply(selected, getSelected(item.children))
        }
      })
      return selected
    }
    // 选项回复到初始状态
    const resetOption = (options: Option[]) => {
      options.forEach((item) => {
        item.isChecked = props.selected.includes(item.value)
        if (item.children) {
          resetOption(item.children)
        }
      })
    }
    // 初始化
    const init = () => {
      resetOption(props.data)
      menus.value = [props.data]
      activeItems.value = []
    }
    // 点击确认
    const handleConfirm = () => {
      let selected = getSelected(props.data)
      emit('change', selected)
      handleCancel()
    }
    // 点击取消
    const handleCancel = () => {
      emit('close')
    }
    // watch
    watch(
      () => props.visible,
      (nVal) => {
        if (nVal) {
          init()
        }
      }
    )
    // lifecycle
    onMounted(() => {
      init()
    })
    return {
      menus,
      isLoadData,
      activeItems,
      handleClickColumnItem,
      handleChangeCheckbox,
      getIndeterminate,
      handleConfirm,
      handleCancel
    }
  },
  render(ctx: any) {
    return (
      <div class={styles['multi-cascader-popup']}>
        <div class={styles['multi-cascader-menu']}>
          {ctx.menus.map((menu: Menu, menuIndex: number) => {
            return (
              <ul class={styles['multi-cascader-column']} key={menuIndex}>
                {menu.map((item: Option, index: number) => {
                  return (
                    <li
                      key={index}
                      onClick={() => ctx.handleClickColumnItem(menuIndex, index)}
                      class={
                        index === ctx.activeItems[menuIndex]
                          ? [styles['multi-cascader-column-item'], styles['active']]
                          : styles['multi-cascader-column-item']
                      }>
                      <a-checkbox
                        value={item.value}
                        checked={item.isChecked}
                        indeterminate={ctx.getIndeterminate(menuIndex, index)}
                        onClick={(e: Event) => {
                          e.stopPropagation()
                          ctx.handleChangeCheckbox(menuIndex, index)
                        }}></a-checkbox>
                      <p class={styles['multi-cascader-column-item-label']}>{item.label}</p>
                      {item.isLoading ? (
                        <LoadingOutlined class={styles['multi-cascader-column-item-icon']} />
                      ) : !item.isLeaf ? (
                        <RightOutlined class={styles['multi-cascader-column-item-icon']} />
                      ) : (
                        ''
                      )}
                    </li>
                  )
                })}
              </ul>
            )
          })}
        </div>
        <div class={styles['multi-cascader-popup-footer']}>
          <div class={styles['multi-cascader-popup-buttons']}>
            <a-button size="small" onClick={ctx.handleCancel}>
              取消
            </a-button>
            <a-button type="primary" size="small" class={styles['ml8']} onClick={ctx.handleConfirm}>
              确认
            </a-button>
          </div>
        </div>
      </div>
    )
  }
})
