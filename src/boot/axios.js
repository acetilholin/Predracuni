import axios from 'axios'

const localhost = 'http://127.0.0.1:8000/api/auth'
const production = 'http://ogrevanjejanjic.si/qsr/api/auth'

const axiosInstance = axios.create({
  baseURL: localhost
})
export default ({store, Vue}) => {
  Vue.prototype.$axios = axiosInstance
  store.$axios = axios
}
export {axiosInstance}
