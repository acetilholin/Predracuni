import {axiosInstance} from 'boot/axios'

export default {
  namespaced: true,
  state: {
    skladi: [],
    sklad: []
  },
  mutations: {
    SET_SKLADI(state, payload) {
      state.skladi = payload
    },
    SET_SKLAD(state, payload) {
      state.sklad = payload
    }
  },
  actions: {
    all({commit}) {
      axiosInstance.get('/sklads')
        .then(response => {
          commit('SET_SKLADI', response.data.data)
        })
    },
    async create({dispatch}, sklad) {
      let newSklad = {
        'item': sklad.item,
        'created': sklad.invoice.timestamp,
        'customer_id': sklad.customer.id,
        'final_invoice_id': sklad.invoice.id,
        'work_date': sklad.workDate
      }
      return await axiosInstance.post('/sklads', newSklad)
        .then((response) => {
          dispatch('all')
          return response.data.success
        })
        .catch((e) => {
          throw (e.response.data.error);
        })
    },
    async remove({dispatch}, id) {
      return await axiosInstance.delete(`/sklads/${id}`)
        .then((response) => {
          dispatch('all')
          return response.data.success
        })
        .catch((e) => {
          throw (e.response.data.error);
        })
    },
    changeStatus({dispatch}, payload) {
     return axiosInstance.get(`/sklads/${payload.id}/${payload.status}/status`)
        .then((response) => {
          dispatch('all')
          return response.data.success
        })
        .catch((e) => {
          throw (e.response.data.error);
        })
    },
    show({commit}, id) {
      axiosInstance.get(`/sklads/${id}/edit`)
        .then((response) => {
          commit('SET_SKLAD', response.data)
        })
    },
    update({commit, dispatch}, sklad) {
     return axiosInstance.patch(`/sklads/${sklad.id}`, {
       'id': sklad.id,
       'customer_id': sklad.customer.id,
       'final_invoice_id': sklad.invoice.id,
       'item': sklad.item,
       'status': sklad.status,
       'created': sklad.created,
       'work_date': sklad.work_date
     })
       .then((response) => {
         dispatch('all')
         return response.data.success
       })
       .catch((e) => {
         throw (e.response.data.error);
       })
    }
  },
  getters: {
    getAll(state) {
      return state.skladi
    },
    getSklad(state) {
      return state.sklad
    }
  }
}
