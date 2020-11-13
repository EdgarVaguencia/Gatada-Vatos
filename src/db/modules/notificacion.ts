export default {
  state: {
    notificaciones: []
  },
  mutations: {
    ADD_NOTIFICACION (state, notificacion) {
      state.notificaciones.push(notificacion)
    },
    REMOVE_NOTIFICACION (state, index) {
      state.notificaciones.pop(index)
    },
    RESET_NOTIFICACIONES (state) {
      state.notificaciones = []
    }
  },
  actions: {
    addNotificacion ({ commit }, notificacion) {
      commit('ADD_NOTIFICACION', notificacion)
    },
    removeNotificacion ({ commit }, index) {
      commit('REMOVE_NOTIFICACION', index)
    }
  },
  getters: {
    getNotificaciones: state => {
      return state.notificaciones
    }
  }
}
