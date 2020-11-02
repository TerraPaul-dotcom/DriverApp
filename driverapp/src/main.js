import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store/index.js'
import vueGeolocation from 'vue-browser-geolocation'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  vueGeolocation,
  store,
  render: h => h(App)
}).$mount('#app')
