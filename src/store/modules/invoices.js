import { axiosInstance } from 'boot/axios'

export default {
    namespaced: true,
    state: {
        invoices: [],
        invoice: [],
        items: [],
        recipient: [],
        customer: [],
        klavzula: null
    },
    mutations: {
        SET_INVOICES(state, payload) {
            state.invoices = payload
        },
        SET_INVOICE(state, payload) {
            state.invoice = payload
        },
        SET_ITEMS(state, payload) {
            state.items = payload
        },
        SET_RECIPIENT(state, payload) {
            state.recipient = payload
        },
        ADD_TO_ITEMS(state, payload) {
            state.items.push(payload)
        },
        REMOVE_FROM_ITEMS(state, payload) {
            state.items = state.items.filter(item => {
                return item !== payload
            })
        },
        SET_INVOICE_CUSTOMER(state, payload) {
            state.customer = payload
        },
        SET_KLAVZULA(state, payload) {
            state.klavzula = payload
        }
    },
    actions: {
        allInvoices({commit}) {
          axiosInstance.get('/invoices')
                .then((response) => {
                    commit('SET_INVOICES', response.data.data)
                })
        },
        addItem({commit}, item) {
            commit('ADD_TO_ITEMS', item)
        },
        removeItemFromInvoice({commit, dispatch}, item) {
            commit('REMOVE_FROM_ITEMS', item)
            dispatch('allInvoices')
        },
        removeItem({commit}, id) {
          axiosInstance.delete(`/items/${id}`)
        },
        currentInvoiceAction({commit}, id) {
          axiosInstance.get(`/invoices/${id}/edit`)
                .then((response) => {
                    commit('SET_INVOICE', response.data.invoice)
                    commit('SET_ITEMS', response.data.items)
                    commit('SET_RECIPIENT', response.data.recipient)
                })
        },
        async update({commit, dispatch}, invoice) {
            return await axiosInstance.patch(`/invoices/${invoice.id}`, {
                'invoice': invoice.invoice,
                'items': invoice.items
            })
                .then((response) => {
                    let year = JSON.parse(localStorage.getItem('year'))
                    dispatch('invoicesYear', {year})
                    commit('SET_ITEMS', response.data.items)
                    return response.data.success
                })
                .catch((e) => {
                    throw (e.response.data.error);
                })
        },
        async addRecipient({commit}, recipientData) {
            let newRecipient = {
                invoice_id: recipientData.id,
                title: recipientData.recipient.title,
                street: recipientData.recipient.street,
                posta: recipientData.recipient.posta.posta
            }
            return await axiosInstance.post('/recipients', newRecipient)
                .then((response) => {
                    commit('SET_RECIPIENT', response.data.recipient)
                    return response.data.success
                })
                .catch((e) => {
                    throw (e.response.data.error);
                })
        },
        filterByInterval({commit}, interval) {
          axiosInstance.post('invoice/interval', {
                from: interval.from,
                to: interval.to
            })
                .then((response) => {
                    commit('SET_INVOICES', response.data.invoices)
                })
        },
        invoicesYear({commit}, payload) {
          axiosInstance.get(`invoice/${payload.year}`)
            .then((response) => {
              commit('SET_INVOICES', response.data.invoices)
            })
        },
        async export({commit, dispatch}, id) {
            return await axiosInstance.get(`invoice/${id}/export`)
                .then((response) => {
                    return response.data.success
                })
                .catch((e) => {
                    throw (e.response.data.error);
                })
        },
        changeStatus({dispatch}, payload) {
         return axiosInstance.get(`invoice/${payload.id}/${payload.status}/status`)
            .then((response) => {
              let year = JSON.parse(localStorage.getItem('year'))
              dispatch('invoicesYear', {year})
              return response.data.success
            })
        },
      viewInvoice({commit}, id) {
          axiosInstance.get(`/invoices/${id}`)
                .then((response) => {
                    commit('SET_INVOICE', response.data.invoice)
                    commit('SET_ITEMS', response.data.items)
                    commit('SET_INVOICE_CUSTOMER', response.data.customer)
                    commit('SET_RECIPIENT', response.data.recipient)
                    commit('SET_KLAVZULA', response.data.klavzula)
                })
                .catch((e) => {
                    throw (e.response.data.error);
                })
        },
        async copy({commit, dispatch}, id) {
            return await axiosInstance.get(`invoice/${id}/copy`)
                .then((response) => {
                    let year = JSON.parse(localStorage.getItem('year'))
                    dispatch('invoicesYear', {year})
                    return response.data.success
                })
        },
        async create({commit, dispatch}, newInvoice) {
            let items = Object.keys(newInvoice.items).length === 0 ? null : newInvoice.items
            let recipient = Object.keys(newInvoice.recipient).length === 0 ? null : newInvoice.recipient
            return await axiosInstance.post('/invoices', {
                invoice: newInvoice.invoice,
                items: items,
                recipient: recipient
            })
                .then((response) => {
                    let year = JSON.parse(localStorage.getItem('year'))
                    dispatch('invoicesYear', {year})
                    return response.data.success
                })
                .catch((e) => {
                    throw (e.response.data.error);
                })
        },
        async removeRecipient({commit}, id) {
            return await axiosInstance.delete(`/recipients/${id}`)
                .then((response) => {
                    commit('SET_RECIPIENT', null)
                    return response.data.success
                })
                .catch((e) => {
                    throw (e.response.data.error);
                })
        },
        async EditRecipient({commit}, recipient) {
            return await axiosInstance.patch(`/recipients/${recipient.id}`, {
                'id': recipient.id,
                'title': recipient.title,
                'street': recipient.street,
                'posta': recipient.posta
            })
                .then((response) => {
                    commit('SET_RECIPIENT', response.data.recipient)
                    return response.data.success
                })
                .catch((e) => {
                    throw (e.response.data.error);
                })
        },
        async remove({commit, dispatch}, id) {
            return await axiosInstance.delete(`/invoices/${id}`)
                .then((response) => {
                    let year = JSON.parse(localStorage.getItem('year'))
                    dispatch('invoicesYear', {year})
                    return response.data.success
                })
                .catch((e) => {
                    throw (e.response.data.error);
                })
        },
      checkExisting({commit}, payload) {
        return axiosInstance.post('/invoice/checkSifra', {
          sifra: payload.sifra
        })
          .then((response) => {
            return response.data.data
          })
      }
    },
    getters: {
        getInvoices(state) {
            return state.invoices
        },
        getInvoice(state) {
            return state.invoice
        },
        getItems(state) {
            return state.items
        },
        getRecipient(state) {
            return state.recipient
        },
        getInvoiceCustomer(state) {
            return state.customer
        },
        getKlavzula(state) {
            return state.klavzula
        }
    }
}
