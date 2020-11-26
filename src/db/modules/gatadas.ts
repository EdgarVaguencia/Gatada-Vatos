import firebase from 'firebase'

export default {
  state: {
    gatadas: []
  },
  mutations: {
    RESET_GATADAS (state) {
      state.gatadas = []
    },
    ADD_GATADA (state, gatadaDoc) {
      let gata = state.gatadas.find(g => g.Uuid === gatadaDoc.Uuid)

      if (!gata) state.gatadas.push(gatadaDoc)
    },
    UPDATE_GATADA (state, info) {
      let gatada = state.gatadas.find(g => g.Uuid === info.data.Uuid)

      if (gatada) {
        gatada.PrimerGatador = info.data.PrimerGatador
        gatada.SegundoGatador = info.data.SegundoGatador
        gatada.Fecha = info.data.Fecha
        gatada.Resultado = info.data.Resultado
        gatada.Jornada = info.data.Jornada
        gatada.Delete = info.data.Delete
      }
    },
    REMOVE_GATADA (state, index) {
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
            let data = doc.data()
            data['Uuid'] = doc.id
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
    saveGatada ({ dispatch }, info) {
      if (info.Uuid && info.Uuid.length > 0) {
        return dispatch('updateGatada', info)
      }
      return firebase.firestore().collection('gatadas').add(info)
        .then(docId => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se puedo crear la gatada', type: 'error' })
          return false
        })
    },
    updateGatada ({ dispatch }, gatada) {
      let gatadaDoc = firebase.firestore().collection('gatadas').doc(gatada.Uuid)

      return gatadaDoc.update({
        PrimerGatador: gatada.PrimerGatador,
        SegundoGatador: gatada.SegundoGatador,
        Fecha: gatada.Fecha,
        Resultado: gatada.Resultado,
        Jornada: gatada.Jornada,
        Temporada: gatada.Temporada
      })
        .then(data => {
          return true
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo actualizar la gatada', type: 'error' })
          return false
        })
    },
    removeGatada ({ dispatch }, gatadaUuid) {
      let gatadaDoc = firebase.firestore().collection('gatadas').doc(gatadaUuid)

      gatadaDoc.update({
        Delete: true
      })
        .then(data => {
          dispatch('addNotificacion', { text: 'Gatada eliminada', type: 'warning' })
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo eliminar la gatada', type: 'error' })
        })
    }
  },
  getters: {
    getAllGatadas: (state) => {
      return state.gatadas.filter(g => {
        return g.Delete === false
      })
    },
    getGatadas: (state) => (idGatador) => {
      return state.gatadas.filter(gatada => {
        return gatada.Delete === false && (gatada.PrimerGatador === idGatador || gatada.SegundoGatador === idGatador)
      })
    },
    getNumGatadas: (state, getters) => {
      let gatadas = getters.getGatadas(getters.getSelected)
      return gatadas.length
    },
    getNumGatadasVictoria: (state, getters) => {
      let gatadas = getters.getGatadas(getters.getSelected).filter((gatada) => {
        return (gatada.PrimerGatador === getters.getSelected && gatada.Resultado.PrimerGatador > gatada.Resultado.SegundoGatador) || (gatada.SegundoGatador === getters.getSelected && gatada.Resultado.SegundoGatador > gatada.Resultado.PrimerGatador)
      })
      return gatadas.length
    },
    getNumGatadasDerrota: (state, getters) => {
      let gatadas = getters.getGatadas(getters.getSelected).filter(gatada => {
        return (gatada.PrimerGatador === getters.getSelected && gatada.Resultado.PrimerGatador < gatada.Resultado.SegundoGatador) || (gatada.SegundoGatador === getters.getSelected && gatada.Resultado.SegundoGatador < gatada.Resultado.PrimerGatador)
      })
      return gatadas.length
    },
    getPuntosGatador: (state, getters) => {
      let puntos = 0
      getters.getGatadas(getters.getSelected).forEach(gatada => {
        if (gatada.PrimerGatador === getters.getSelected) puntos += gatada.Resultado.PrimerGatador
        if (gatada.SegundoGatador === getters.getSelected) puntos += gatada.Resultado.SegundoGatador
      })
      return puntos
    }
  }
}
