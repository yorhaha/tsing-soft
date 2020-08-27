import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import vuetify from './plugins/vuetify';
import router from './router.js'

import navbar from './components/navbar.vue'
import 'github-markdown-css/github-markdown.css'

import db from "./utils/localstorage"
import { formatDate } from './utils/common'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.db = db
Vue.prototype.formatDate = formatDate

Vue.use(navbar)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
