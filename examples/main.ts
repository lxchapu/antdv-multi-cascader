import { createApp } from 'vue'
import App from './App.vue'
import multiCascader from '../packages'

const app = createApp(App)
app.use(multiCascader)

app.mount('#app')
