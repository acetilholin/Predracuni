import { axiosInstance } from 'boot/axios'
import store from "src/store"

export default {
    namespaced: true,
    state: {
        company: []
    },
    mutations: {
        SET_COMPANY(state, payload) {
            state.company = payload
        }
    },
    actions: {
      all({commit, state}) {
        let cid = JSON.parse(localStorage.getItem('modus-realm'))
        cid++

        axiosInstance.get(`/companies/${cid}`)
          .then(response => {
            commit('SET_COMPANY', response.data.company)
          })
      },
      async update({dispatch}, company) {
        let cid = JSON.parse(localStorage.getItem('modus-realm'))
        cid++
        return await axiosInstance.patch(`/companies/${cid}`, {company})
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
        getCompany(state) {
            return state.company
        }
    }
}
