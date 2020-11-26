import store from "src/store/index";
import { axiosInstance } from 'boot/axios'

store.subscribe((mutation) => {
    switch (mutation.type) {
        case 'auth/SET_TOKEN':
            if (mutation.payload) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${mutation.payload}`
                localStorage.setItem('token', mutation.payload)
            } else {
                axiosInstance.defaults.headers.common['Authorization'] = null
                localStorage.removeItem('token')
            }
            break
    }
})
