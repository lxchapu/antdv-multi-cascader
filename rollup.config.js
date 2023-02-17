import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import { name } from './package.json'
import clear from 'rollup-plugin-clear'
import alias from '@rollup/plugin-alias'
import path from 'path'
import styles from 'rollup-plugin-styles'

export default {
  input: './packages/index.ts',
  output: {
    name,
    dir: 'lib',
    format: 'es',
    globals: {
      vue: 'Vue'
    }
  },
  external: [
    'vue',
    'ant-design-vue',
    '@ant-design/icons-vue',
    'ant-design-vue/dist/antd.css',
    path.resolve(__dirname, 'examples')
  ],
  plugins: [
    clear({
      targets: ['lib'],
      watch: true
    }),
    typescript(),
    babel({ babelHelpers: 'bundled', extensions: ['.ts', '.js', '.tsx'] }),
    styles({
      autoModules: true
    }),
    alias({
      entries: [{ find: '/#/', replacement: path.resolve(__dirname, 'src') }]
    })
  ]
}
