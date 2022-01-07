import { axiosInstance } from 'boot/axios'

export default {
    namespaced: true,
    state: {
        finalAll: [],
        final: [],
        items: [],
        customer: [],
        recipient: [],
        klavzula: [],
        report: []
    },
    mutations: {
        SET_FINAL_INVOICES(state, payload) {
            state.finalAll = payload
        },
        SET_FINAL_INVOICE(state, payload) {
            state.final = payload
        },
        SET_ITEMS(state, payload) {
            state.items = payload
        },
        SET_INVOICE_CUSTOMER(state, payload) {
            state.customer = payload
        },
        SET_RECIPIENT(state, payload) {
            state.recipient = payload
        },
        SET_KLAVZULA(state, payload) {
            state.klavzula = payload
        },
        SET_REPORT(state, payload) {
            state.report = payload
        }
    },
    actions: {
        async all({commit}) {
          await axiosInstance.get('/finalInvoices')
                .then((response) => {
                    commit('SET_FINAL_INVOICES', response.data.final)
                })
        },
        view({commit}, id) {
          axiosInstance.get(`/finalInvoices/${id}`)
                .then((response) => {
                    commit('SET_FINAL_INVOICE', response.data.invoice)
                    commit('SET_ITEMS', response.data.items)
                    commit('SET_INVOICE_CUSTOMER', response.data.customer)
                    commit('SET_RECIPIENT', response.data.recipient)
                    commit('SET_KLAVZULA', response.data.klavzula)
                })
        },
        async remove({dispatch}, id) {
            return await axiosInstance.delete(`/finalInvoices/${id}`)
                .then((response) => {
                    let year = JSON.parse(localStorage.getItem('year-final'))
                    dispatch('finalYear', {year})
                    return response.data.success
                })
                .catch((e) => {
                    throw (e.response.data.error);
                })
        },
        report({commit}, interval) {
          axiosInstance.post('finalInvoice/report', {
                from: interval.from,
                to: interval.to
            })
                .then((response) => {
                    commit('SET_REPORT', response.data)
                })
        },
        filterByInterval({commit}, interval) {
          axiosInstance.post('finalInvoice/interval', {
                from: interval.from,
                to: interval.to
            })
                .then((response) => {
                    commit('SET_FINAL_INVOICES', response.data.finalInvoices)
                })
        },
        finalYear({commit}, payload) {
          axiosInstance.get(`finalInvoice/${payload.year}`)
            .then((response) => {
              commit('SET_FINAL_INVOICES', response.data.finalInvoices)
            })
        }
    },
    getters: {
        getAll(state) {
            return state.finalAll
        },
        getFinalInvoice(state) {
            return state.final
        },
        getItems(state) {
            return state.items
        },
        getCustomer(state) {
            return state.customer
        },
        getRecipient(state) {
            return state.recipient
        },
        getKlavzula(state) {
            return state.klavzula
        },
        getReport(state) {
            return state.report
        }
    }
}
