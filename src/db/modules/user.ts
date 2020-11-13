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
    getUser ({ commit, dispatch }) {
      firebase.auth().onAuthStateChanged(isUser => {
        if (isUser && isUser !== null) {
          commit('SET_USER', isUser.toJSON())
          dispatch('fectchGatadas')
          dispatch('fetchGatadores')
        }
      })
    },
    logIn ({ dispatch }, params) {
      return firebase.auth().setPersistence(auth.Auth.Persistence.LOCAL)
        .then(_ => {
          return auth().signInWithEmailAndPassword(params.email, params.password)
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
    logOut ({ commit, dispatch }) {
      firebase.auth().signOut()
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
    isLogin: state => {
      if (state.user.uid && state.user.uid.length) return true
      return false
    }
  }
}
