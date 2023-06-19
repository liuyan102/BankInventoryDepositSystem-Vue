import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import request from '@/utils/request'

import '@/icons' // icon
import '@/permission' // permission control

import * as echarts from 'echarts'
import Moment from 'moment'
import VueCron from 'vue-cron'
Vue.use(VueCron)
import VCalendar from 'v-calendar'; // 引入日历插件

Vue.use(VCalendar, {
  componentPrefix: 'vc',
});
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
import Calendar from "vue-calendar-component";
export default {
    components: { Calendar },
}
Vue.prototype.req = request
Vue.prototype.$echarts = echarts
// axios.defaults.baseURL = '/api'
Vue.prototype.moment = Moment
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
