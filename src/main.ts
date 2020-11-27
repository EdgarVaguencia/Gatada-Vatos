import Vue from 'vue'
import Vuetify from 'vuetify'
import firebase from 'firebase/app'
import VueMeta from 'vue-meta'
import App from '@/App.vue'
import router from '@/route'
import store from '@/db'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'
import '@/registerServiceWorker'

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})

Vue.use(Vuetify)
Vue.config.productionTip = false

const config = {

}

firebase.initializeApp(config)

let appVue = new Vue ({
  el: '#app',
  router,
  store,
  vuetify: new Vuetify({
    icons: {
      iconfont: 'md'
    }
  }),
  render: h => h(App)
})
