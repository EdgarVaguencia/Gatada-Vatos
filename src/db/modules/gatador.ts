import { gatadorType, temporadaType } from '@/typings'
import firebase from 'firebase'

export default {
  state: {
    gatadores: [],
    gatador: {},
    selectGatador: 0
  },
  mutations: {
    RESET_GATADORES (state) {
      state.gatadores = []
    },
    ADD_GATADOR (state, gatador: gatadorType) {
      const gato: gatadorType = state.gatadores.find((g: gatadorType) => g.Id === gatador.Id)

      if (gatador.Redes !== null) gatador.Redes = {}

      if (gato === null) state.gatadores.push(gatador)
    },
    UPDATE_GATADOR (state, info) {
      const gatador: gatadorType = state.gatadores.find((g: gatadorType) => g.Id === info.data.Id)

      if (gatador !== null) {
        gatador.Nombre = info.data.Nombre
        gatador.Imagen = info.data.Imagen
        gatador.Activo = info.data.Activo
        gatador.Redes = info.data.Redes ? info.data.Redes : {}
        gatador.Temporadas = info.data.Temporadas
      }
    },
    REMOVE_GATADOR (state, index: number) {
      state.gatadores.splice(index, 1)
    },
    SET_GATADOR (state, gatador: gatadorType) {
      state.gatador = gatador
    },
    SET_CURRENT_GATADOR (state, gatadorObj) {
      state.selectGatador = parseInt(gatadorObj.id)
    }
  },
  actions: {
    fetchGatadores ({ commit }) {
      commit('RESET_GATADORES')
      firebase.firestore().collection('gatadores')
        .onSnapshot(query => {
          query.docChanges().forEach(change => {
            const { newIndex, oldIndex, doc, type } = change
            const data = doc.data()
            data.Uuid = doc.id
            if (type === 'added') {
              commit('ADD_GATADOR', data)
            } else if (type === 'modified') {
              commit('UPDATE_GATADOR', { data: data, gatador: newIndex })
            } else if (type === 'removed') {
              commit('REMOVE_GATADOR', oldIndex)
            }
          })
        })
    },
    async fetchGatador ({ commit, dispatch }, idGatador: number) {
      return firebase.firestore().collection('gatadores')
        .where('Id', '==', idGatador)
        .onSnapshot(query => {
          query.docChanges().forEach(change => {
            const { newIndex, oldIndex, doc, type } = change
            const data = doc.data()
            data.Uuid = doc.id
            if (type === 'added') {
              commit('SET_GATADOR', data)
            } else if (type === 'modified') {
              dispatch('addNotificacion', { text: 'Gatador Actualizado', type: 'success' })
              commit('UPDATE_GATADOR', { data: data, gatador: newIndex })
            } else if (type === 'removed') {
              commit('REMOVE_GATADOR', oldIndex)
            }
          })
        })
    },
    async updateGatador ({ dispatch }, gatador: gatadorType) {
      const gatadorDoc = firebase.firestore().collection('gatadores').doc(gatador.Uuid)

      return await gatadorDoc.update(
        {
          Nombre: gatador.Nombre,
          Imagen: gatador.Imagen,
          Activo: gatador.Activo,
          Redes: gatador.Redes,
          Temporadas: gatador.Temporadas
        }
      )
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo actualizar el gatador', type: 'error' })
          return false
        })
    },
    async saveGatador ({ dispatch }, gatador: gatadorType) {
      return await firebase.firestore().collection('gatadores').add(gatador)
        .then(data => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se puedo crear la gatada', type: 'error' })
          return false
        })
    },
    setGatador ({ commit }, data: gatadorType) {
      commit('SET_CURRENT_GATADOR', data)
    }
  },
  getters: {
    getGatadores: (state): gatadorType[] => {
      return state.gatadores
    },
    getGatador: (state, getters) => (idGatador: number = 0): gatadorType => {
      const idBusqueda: number = idGatador !== 0 ? idGatador : getters.getSelected
      return state.gatadores.find((gat: gatadorType) => gat.Id === idBusqueda)
    },
    getGatadoresTemporada: (state, getters) => (uuid?: string, nombre?: string): gatadorType[] => {
      let temporada: temporadaType
      if (uuid?.length > 0) {
        temporada = getters.getTemporada.find((t: temporadaType) => t.Uuid === uuid)
      } else if (nombre?.length > 0) {
        temporada = getters.getTemporada.find((t: temporadaType) => t.Nombre === nombre)
      } else {
        temporada = getters.getTemporadaActual
      }
      if (temporada !== null) {
        return state.gatadores.filter((g: gatadorType) => {
          return g.Temporadas.includes(temporada.Uuid)
        })
      }
      return getters.getGatadores
    },
    getSelected: (state): number => {
      return state.selectGatador
    }
  }
}
