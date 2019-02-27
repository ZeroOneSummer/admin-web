import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './icons/iconfont.css'
import 'font-awesome/css/font-awesome.css'
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data

import * as filters from './utils/filters' // global filters
import { Fetch } from './utils/fetch'
import './assets/plugins/jquery.min'
import './assets/plugins/ztree/jquery.ztree.all.min'
import Validator from './utils/validation'
import { hasPermission } from './utils/index'

Vue.use(Validator)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// Vue.prototype.baseURL = 'http://192.168.1.60:8083'
Vue.prototype.baseURL = 'http://47.96.22.102:9990'
Vue.prototype._fetch = Fetch
Vue.prototype._hasPermission = hasPermission

const token = window.localStorage.getItem("token");
const keyword = window.localStorage.getItem("keyword");
var adminEd = localStorage.getItem("adminEd")
Vue.prototype._token = token
Vue.prototype._adminEd = adminEd
Vue.prototype.keyword = keyword

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
