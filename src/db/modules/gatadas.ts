import firebase from 'firebase'
import { gatadaType } from '@/typings'

export default {
  state: {
    gatadas: []
  },
  mutations: {
    RESET_GATADAS (state) {
      state.gatadas = []
    },
    ADD_GATADA (state, gatadaDoc: gatadaType) {
      const gata: gatadaType | null = state.gatadas.find((g: gatadaType) => g.Uuid === gatadaDoc.Uuid)

      if (gata === null) state.gatadas.push(gatadaDoc)
    },
    UPDATE_GATADA (state, info) {
      const gatada: gatadaType | null = state.gatadas.find((g: gatadaType) => g.Uuid === info.data.Uuid)

      if (gatada !== null) {
        gatada.PrimerGatador = info.data.PrimerGatador
        gatada.SegundoGatador = info.data.SegundoGatador
        gatada.Fecha = info.data.Fecha
        gatada.Resultado = info.data.Resultado
        gatada.Jornada = info.data.Jornada
        gatada.Delete = info.data.Delete
      }
    },
    REMOVE_GATADA (state, index: number) {
      state.gatadas.splice(index, 1)
    }
  },
  actions: {
    fectchGatadas ({ commit, dispatch }) {
      commit('RESET_GATADAS')
      firebase.firestore().collection('gatadas')
        .onSnapshot(query => {
          query.docChanges().forEach(change => {
            const { newIndex, oldIndex, doc, type } = change
            const data = doc.data()
            data.Uuid = doc.id
            if (type === 'added') {
              commit('ADD_GATADA', data)
            } else if (type === 'modified') {
              commit('UPDATE_GATADA', { data: data, gatada: newIndex })
              if (!data.Delete) dispatch('addNotificacion', { text: 'Gatada Actualizada', type: 'success' })
            } else if (type === 'removed') {
              commit('REMOVE_GATADA', oldIndex)
            }
          })
        })
    },
    async saveGatada ({ dispatch }, info: gatadaType) {
      if (info.Uuid?.length > 0) {
        return dispatch('updateGatada', info)
      }
      return await firebase.firestore().collection('gatadas').add(info)
        .then(_ => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se puedo crear la gatada', type: 'error' })
          return false
        })
    },
    async updateGatada ({ dispatch }, gatada: gatadaType) {
      const gatadaDoc = firebase.firestore().collection('gatadas').doc(gatada.Uuid)

      return await gatadaDoc.update({
        PrimerGatador: gatada.PrimerGatador,
        SegundoGatador: gatada.SegundoGatador,
        Fecha: gatada.Fecha,
        Resultado: gatada.Resultado,
        Jornada: gatada.Jornada,
        Temporada: gatada.Temporada
      })
        .then(_ => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo actualizar la gatada', type: 'error' })
          return false
        })
    },
    removeGatada ({ dispatch }, gatadaUuid: string) {
      const gatadaDoc = firebase.firestore().collection('gatadas').doc(gatadaUuid)

      gatadaDoc.update({
        Delete: true
      })
        .then(_ => {
          dispatch('addNotificacion', { text: 'Gatada eliminada', type: 'warning' })
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo eliminar la gatada', type: 'error' })
        })
    }
  },
  getters: {
    getAllGatadas: (state): gatadaType[] => {
      return state.gatadas.filter(g => {
        return g.Delete === false
      })
    },
    getGatadas: (state, getters) => (idGatador: number): gatadaType[] => {
      const temporadaActual = getters.getTemporada
      return state.gatadas.filter((gatada: gatadaType) => {
        return !gatada.Delete && (gatada.PrimerGatador === idGatador || gatada.SegundoGatador === idGatador) && gatada.Temporada === temporadaActual.Uuid
      })
    },
    getNumGatadas: (state, getters): number => {
      const gatadas: gatadaType[] = getters.getGatadas(getters.getSelected)
      return gatadas.length
    },
    getNumGatadasVictoria: (state, getters): number => {
      const gatadas = getters.getGatadas(getters.getSelected).filter((gatada: gatadaType) => {
        return (gatada.PrimerGatador === getters.getSelected && gatada.Resultado.PrimerGatador > gatada.Resultado.SegundoGatador) || (gatada.SegundoGatador === getters.getSelected && gatada.Resultado.SegundoGatador > gatada.Resultado.PrimerGatador)
      })
      return gatadas.length
    },
    getNumGatadasDerrota: (state, getters): number => {
      const gatadas = getters.getGatadas(getters.getSelected).filter((gatada: gatadaType) => {
        return (gatada.PrimerGatador === getters.getSelected && gatada.Resultado.PrimerGatador < gatada.Resultado.SegundoGatador) || (gatada.SegundoGatador === getters.getSelected && gatada.Resultado.SegundoGatador < gatada.Resultado.PrimerGatador)
      })
      return gatadas.length
    },
    getPuntosGatador: (state, getters): number => {
      let puntos: number = 0
      getters.getGatadas(getters.getSelected).forEach((gatada: gatadaType) => {
        if (gatada.PrimerGatador === getters.getSelected) puntos += gatada.Resultado.PrimerGatador
        if (gatada.SegundoGatador === getters.getSelected) puntos += gatada.Resultado.SegundoGatador
      })
      return puntos
    }
  }
}
