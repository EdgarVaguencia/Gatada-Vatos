import firebase, { auth } from 'firebase'

export default {
  state: {
    user: {}
  },
  mutations: {
    SET_USER (state, usuario) {
      state.user = usuario
    },
    RESET_USER (state) {
      state.user = {}
    }
  },
  actions: {
    getUser ({ commit }) {
      firebase.auth().onAuthStateChanged(isUser => {
        if (isUser !== null) {
          commit('SET_USER', isUser.toJSON())
        }
      })
    },
    async logIn ({ dispatch }, params) {
      return await firebase.auth().setPersistence(auth.Auth.Persistence.LOCAL)
        .then(async () => {
          return await auth().signInWithEmailAndPassword(params.email, params.password)
            .then(_ => {
              dispatch('addNotificacion', { text: 'Bienvenido', type: 'success' })
              dispatch('getUser')
              return true
            })
            .catch(err => {
              dispatch('addNotificacion', { text: err.message, type: 'error' })
              return false
            })
        })
        .catch(err => {
          dispatch('addNotificacion', { text: err.message, type: 'error' })
          return false
        })
    },
    async logOut ({ commit, dispatch }) {
      return await firebase.auth().signOut()
        .then(_ => {
          commit('RESET_USER')
          commit('RESET_GATADAS')
          commit('RESET_GATADORES')
          dispatch('addNotificacion', { text: 'Nos vemos', type: 'success' })
        })
        .catch(err => {
          dispatch('addNotificacion', { text: err, type: 'error' })
        })
    }
  },
  getters: {
    isLogin: (state): boolean | null => {
      return state.user.uid?.length
    }
  }
}
