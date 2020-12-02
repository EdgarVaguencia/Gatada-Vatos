import { sedeType } from '@/typings'
import firebase from 'firebase'

export default {
  state: {
    temporadas: [],
    nombreTemporada: ''
  },
  mutations: {
    RESET_TEMPORADA (state) {
      state.temporadas = []
    },
    ADD_Temporada (state, temporadaDoc) {
      let temporada = state.temporadas.find(s => s.Uuid === temporadaDoc.Uuid)

      if (!temporada) state.temporadas.push(temporadaDoc)
    },
    UPDATE_TEMPORADA (state, temporadaDoc) {
      let temporada = state.temporadas.find((s:sedeType) => s.Uuid === temporadaDoc.Uuid)

      if (temporada) {
        temporada.Nombre = temporadaDoc.Nombre
        temporada.Descripcion = temporadaDoc.Description
        temporada.Delete = temporadaDoc.Delete
        temporada.Actual = temporadaDoc.Actual
      }
    },
    REMOVE_TEMPORADA (state, index) {
      state.temporadas.splice(index, 1)
    },
    SET_CURRENT_TEMPORADA (state, temporadaName:string) {
      if (temporadaName !== state.nombreTemporada) state.nombreTemporada = temporadaName
    }
  },
  actions: {
    fetchSedes ({ commit, dispatch }) {
      commit('RESET_TEMPORADA')
      firebase.firestore().collection('sedes')
        .onSnapshot(query => {
          query.docChanges().forEach(change => {
            const { newIndex, oldIndex, doc, type } = change
            let data = doc.data()
            data['Uuid'] = doc.id
            if (type === 'added') {
              commit('ADD_Temporada', data)
            } else if (type === 'modified') {
              commit('UPDATE_TEMPORADA', { data: data, sede: newIndex })
              dispatch('addNotificacion', { text: 'Sede Actualizada', type: 'success' })
            } else if (type === 'removed') {
              commit('REMOVE_TEMPORADA', oldIndex)
            }
          })
        })
    },
    saveTemporada ({ dispatch }, info) {
      if (info.Uuid && info.Uuid.length > 0) {
        return dispatch('updateTemporada', info)
      }
      return firebase.firestore().collection('sedes').add(info)
        .then(docId => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo crear la sede', type: 'error' })
          return false
        })
    },
    updateTemporada ({ dispatch }, sede) {
      let temporadaDoc = firebase.firestore().collection('sedes').doc(sede.Uuid)

      return temporadaDoc.update({
        Nombre: sede.Nombre,
        Descripcion: sede.Descripcion
      })
        .then(data => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo actualizar la sede', type: 'error' })
          return false
        })
    },
    removeTemporada ({ dispatch }, sedeUuid) {
      let temporadaDoc = firebase.firestore().collection('sedes').doc(sedeUuid)

      temporadaDoc.update({
        Delete: true
      })
        .then(data => {
          dispatch('addNotificacion', { text: 'Sede eliminada', type: 'warning' })
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo eliminar la sede', type: 'error' })
        })
    },
    setTemporada( { commit }, temporada) {
      commit('SET_CURRENT_TEMPORADA', temporada)
    }
  },
  getters: {
    getSedes: state => {
      return state.temporadas.filter(s => {
        return s.Delete === false
      })
    },
    getTemporadaActual: state => {
      return state.temporadas.find(s => s.Actual === true)
    },
    getTemporada: (state, getters) => {
      if (state.nombreTemporada.length > 0) return state.temporadas.find(t => t.Nombre === state.nombreTemporada.replaceAll('-', ' '))
      return getters.getTemporadaActual
    }
  }
}
