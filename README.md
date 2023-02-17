# antdv-multi-cascader

![Vue](https://img.shields.io/badge/-Vue-34495e?logo=vue.js)
![Vite](https://img.shields.io/badge/-Vite-646cff?logo=vite&logoColor=white)
![Rollup](https://img.shields.io/badge/-Rollup-ef3335?logo=rollup.js&logoColor=white)
[![npm package](https://img.shields.io/npm/v/antdv-multi-cascader.svg)](https://www.npmjs.org/package/antdv-multi-cascader)
![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)

这是`ant-design-vue` 2.x 的级联多选组件。

## 如何使用

```bash
npm i antdv-multi-cascader -D
```

```ts
import multiCascader from 'antdv-multi-cascader'
app.use(multiCascader)
```

```html
<multi-cascader v-model:value="value" placeholder="请输入" :data="options" :loadData="loadData"></multi-cascader>
```

## Props

| 参数           | 说明           | 类型                                | 默认值 | 必填    |
| -------------- | -------------- | ----------------------------------- | ------ | ------- |
| value(v-model) | 选中项         | `string[]`                          | `[]`   | `true`  |
| placeholder    | 输入框占位文本 | `string`                            | -      | `false` |
| data           | 可选项数据源   | <a href="#Option">Option</a>`[]`    | `[]`   | `true`  |
| loadData       | 动态加载选项   | `(selectedOptions: Option) => void` | -      | `true`  |

### <span id="Option">Option</span>

```ts
interface Option {
  value: string
  label: string
  isLeaf: boolean
  isChecked?: boolean
  isLoading?: boolean
  children?: Option[]
}
```
