import Vue from 'vue'
import Vuex from 'vuex'
import gatador from '@/db/modules/gatador'
import gatadas from '@/db/modules/gatadas'
import notificacion from '@/db/modules/notificacion'
import user from '@/db/modules/user'
import sedes from '@/db/modules/sedes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectGatador: 0
  },
  mutations: {
    SET_CURRENT_GATADOR (state, gatadorObj) {
      state.selectGatador = parseInt(gatadorObj.id)
    }
  },
  actions: {},
  getters: {
    getSelected: (state) => {
      return state.selectGatador
    }
  },
  modules: {
    gatador,
    gatadas,
    notificacion,
    user,
    sedes
  }
})
