<template>
  <multi-cascader
    style="width: 200px"
    v-model:value="value"
    placeholder="请输入"
    :data="options"
    :loadData="loadData"
  ></multi-cascader>
</template>

<script setup lang="ts">
interface Option {
  value: string
  label: string
  isLeaf: boolean
  isChecked?: boolean
  isLoading?: boolean
  children?: Option[]
}
import { onMounted, ref } from 'vue'
const value = ref<string[]>([])
const options = ref<Option[]>([])
// 回调
const loadData = (selectedOptions: Option) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let isLeaf = Math.random() > 0.5
      if (isLeaf) {
        selectedOptions.isLeaf = true
      } else {
        selectedOptions.children = [...new Array(5)].map((item, index) => {
          return {
            value: `${selectedOptions.value} - ${index + 1}`,
            label: `label - ${selectedOptions.value} - ${index + 1}`,
            isLeaf: false
          }
        })
      }
      resolve(null)
    }, 1000)
  })
}
onMounted(() => {
  options.value = [...new Array(10)].map((item, index) => {
    return {
      value: `${index + 1}`,
      label: `label - ${index + 1}`,
      isLeaf: false
    }
  })
})
</script>

<script lang="ts">
export default {
  name: 'DemoMultiCascader'
}
</script>

<style lang="scss" scoped></style>
