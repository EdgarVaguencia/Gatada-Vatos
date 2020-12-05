import { temporadaType } from '@/typings'
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
    ADD_Temporada (state, temporadaDoc:temporadaType) {
      let temporada = state.temporadas.find(s => s.Uuid === temporadaDoc.Uuid)

      if (!temporada) state.temporadas.push(temporadaDoc)
    },
    UPDATE_TEMPORADA (state, temporadaDoc) {
      let temporada = state.temporadas.find((s:temporadaType) => s.Uuid === temporadaDoc.data.Uuid)

      if (temporada) {
        temporada.Nombre = temporadaDoc.data.Nombre
        temporada.Descripcion = temporadaDoc.data.Description
        temporada.Delete = temporadaDoc.data.Delete
        temporada.Actual = temporadaDoc.data.Actual
      }
    },
    REMOVE_TEMPORADA (state, index:number) {
      state.temporadas.splice(index, 1)
    },
    SET_CURRENT_TEMPORADA (state, temporadaName:string) {
      if (temporadaName !== state.nombreTemporada) state.nombreTemporada = temporadaName
    }
  },
  actions: {
    fetchTemporadas ({ commit, dispatch }) {
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
              commit('UPDATE_TEMPORADA', { data: data, temporada: newIndex })
              dispatch('addNotificacion', { text: 'Temporada Actualizada', type: 'success' })
            } else if (type === 'removed') {
              commit('REMOVE_TEMPORADA', oldIndex)
            }
          })
        })
    },
    saveTemporada ({ dispatch }, info:temporadaType) {
      if (info.Uuid && info.Uuid.length > 0) {
        return dispatch('updateTemporada', info)
      }
      return firebase.firestore().collection('sedes').add(info)
        .then(docId => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo crear la temporada', type: 'error' })
          return false
        })
    },
    updateTemporada ({ dispatch }, temporada:temporadaType) {
      let temporadaDoc = firebase.firestore().collection('sedes').doc(temporada.Uuid)

      return temporadaDoc.update({
        Nombre: temporada.Nombre,
        Descripcion: temporada.Descripcion,
        Ganador: temporada.Ganador
      })
        .then(data => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo actualizar la temporada', type: 'error' })
          return false
        })
    },
    removeTemporada ({ dispatch }, temporadaUuid:string) {
      let temporadaDoc = firebase.firestore().collection('sedes').doc(temporadaUuid)

      temporadaDoc.update({
        Delete: true
      })
        .then(data => {
          dispatch('addNotificacion', { text: 'Temporada eliminada', type: 'warning' })
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo eliminar la temporada', type: 'error' })
        })
    },
    setTemporada( { commit }, temporada:string) {
      commit('SET_CURRENT_TEMPORADA', temporada)
    }
  },
  getters: {
    getTemporadas: state => {
      return state.temporadas.filter(s => {
        return s.Delete === false
      })
    },
    getTemporadaActual: state => {
      return state.temporadas.find(s => s.Actual === true)
    },
    getTemporada: (state, getters) => {
      if (state.nombreTemporada && state.nombreTemporada.length > 0) return state.temporadas.find(t => t.Nombre === state.nombreTemporada.replaceAll('-', ' '))
      return getters.getTemporadaActual
    }
  }
}
