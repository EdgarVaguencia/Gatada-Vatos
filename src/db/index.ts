import Vue from 'vue'
import Vuex from 'vuex'
import gatador from '@/db/modules/gatador'
import gatadas from '@/db/modules/gatadas'
import notificacion from '@/db/modules/notificacion'
import user from '@/db/modules/user'
import temporada from '@/db/modules/sedes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    gatador,
    gatadas,
    notificacion,
    user,
    temporada
  }
})
