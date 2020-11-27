import firebase from 'firebase'

export default {
  state: {
    sedes: []
  },
  mutations: {
    RESET_SEDES (state) {
      state.sedes = []
    },
    ADD_SEDE (state, sedeDoc) {
      let sede = state.sedes.find(s => s.Uuid === sedeDoc.Uuid)

      if (!sede) state.sedes.push(sedeDoc)
    },
    UPDATE_SEDE (state, sedeDoc) {
      let sede = state.sedes.find(s => s.Uuid === sedeDoc.Uuid)

      if (sede) {
        sede.Nombre = sedeDoc.Nombre
        sede.Descripcion = sedeDoc.Description
        sede.Delete = sedeDoc.Delete
        sede.Actual = sedeDoc.Actual
      }
    },
    REMOVE_SEDE (state, index) {
      state.sedes.splice(index, 1)
    }
  },
  actions: {
    fetchSedes ({ commit, dispatch }) {
      commit('RESET_SEDES')
      firebase.firestore().collection('sedes')
        .onSnapshot(query => {
          query.docChanges().forEach(change => {
            const { newIndex, oldIndex, doc, type } = change
            let data = doc.data()
            data['Uuid'] = doc.id
            if (type === 'added') {
              commit('ADD_SEDE', data)
            } else if (type === 'modified') {
              commit('UPDATE_GATADA', { data: data, sede: newIndex })
              dispatch('addNotificacion', { text: 'Sede Actualizada', type: 'success' })
            } else if (type === 'removed') {
              commit('REMOVE_SEDE', oldIndex)
            }
          })
        })
    },
    saveSede ({ dispatch }, info) {
      if (info.Uuid && info.Uuid.length > 0) {
        return dispatch('updateSede', info)
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
    updateSede ({ dispatch }, sede) {
      let sedeDoc = firebase.firestore().collection('sedes').doc(sede.Uuid)

      return sedeDoc.update({
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
    removeSede ({ dispatch }, sedeUuid) {
      let sedeDoc = firebase.firestore().collection('sedes').doc(sedeUuid)

      sedeDoc.update({
        Delete: true
      })
        .then(data => {
          dispatch('addNotificacion', { text: 'Sede eliminada', type: 'warning' })
        })
        .catch(err => {
          console.error(err)
          dispatch('addNotificacion', { text: 'No se pudo eliminar la sede', type: 'error' })
        })
    }
  },
  getters: {
    getSedes: state => {
      return state.sedes.filter(s => {
        return s.Delete === false
      })
    },
    getSedeActual: state => {
      return state.sedes.find(s => s.Actual === true)
    }
  }
}
