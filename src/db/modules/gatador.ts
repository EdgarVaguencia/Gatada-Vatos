import { gatadorType, sedeType } from '@/typings'
import firebase from 'firebase'

export default {
  state: {
    gatadores: [],
    gatador: {}
  },
  mutations: {
    RESET_GATADORES (state) {
      state.gatadores = []
    },
    ADD_GATADOR (state, gatador) {
      let gato = state.gatadores.find(g => g.Id === gatador.Id)

      if (!gatador.Redes) gatador.Redes = {}

      if (!gato) state.gatadores.push(gatador)
    },
    UPDATE_GATADOR (state, info) {
      let gatador = state.gatadores.find(g => g.Id === info.data.Uuid)

      if (gatador) {
        gatador.Nombre = info.data.Nombre
        gatador.Images = info.data.Imagen
        gatador.Activo = info.data.Activo
        gatador.Redes = info.data.Redes ? info.data.Redes : {}
        gatador.Temporadas = info.data.Temporadas
      }
    },
    REMOVE_GATADOR (state, index) {
      state.gatadores.splice(index, 1)
    },
    SET_GATADOR (state, gatador) {
      state.gatador = gatador
    }
  },
  actions: {
    fetchGatadores ({ commit }) {
      commit('RESET_GATADORES')
      firebase.firestore().collection('gatadores')
        .onSnapshot(query => {
          query.docChanges().forEach(change => {
            const { newIndex, oldIndex, doc, type } = change
            let data = doc.data()
            data['Uuid'] = doc.id
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
    fetchGatador ({ commit, dispatch }, idGatador) {
      return firebase.firestore().collection('gatadores')
        .where('Id', '==', parseInt(idGatador))
        .onSnapshot(query => {
          console.info(query)
          query.docChanges().forEach(change => {
            const { newIndex, oldIndex, doc, type } = change
            let data = doc.data()
            data['Uuid'] = doc.id
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
    updateGatador ({ dispatch }, gatador:gatadorType) {
      let gatadorDoc = firebase.firestore().collection('gatadores').doc(gatador.Uuid)

      return gatadorDoc.update(
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
    saveGatador ({ dispatch }, gatador:gatadorType) {
      return firebase.firestore().collection('gatadores').add(gatador)
        .then(data => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se puedo crear la gatada', type: 'error' })
          return false
        })
    }
  },
  getters: {
    getGatadores: state => {
      return state.gatadores
    },
    getGatador: (state, getters) => (idGatador = 0) => {
      let idBusqueda = idGatador !== 0 ? idGatador : getters.getSelected
      return state.gatadores.find(gat => {
        return gat.Id === idBusqueda
      })
    },
    getGatadoresTemporada: (state, getters) => (uuid?:string, nombre?:string) => {
      let temporada:sedeType = undefined
      if (uuid && uuid.length > 0) {
        temporada = getters.getSedes.find(t => t.Uuid === uuid)
      } else if (nombre && nombre.length > 0) {
        temporada = getters.getSedes.find(t => t.Nombre === nombre)
      } else {
        temporada = getters.getSedeActual
      }
      if (temporada) {
        return state.gatadores.filter(g => {
          return g.Temporadas.indexOf(temporada.Uuid) >= 0
        })
      }
      return getters.getGatadores
    }
  }
}
