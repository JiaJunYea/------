import axios from 'axios'
// import { useBusStore } from '@/stores/bus'
import { useNewbusStore } from '@/stores/newbus'
import { useUserStore } from '@/stores/user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

const busapi = axios.create({
  baseURL: 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
  // headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' },
})

const busapiAuth = axios.create({
  baseURL: 'https://tdx.transportdata.tw/api/basic',
})

// axios 攔截器
// 1. axios.get() axios.post()
// 2. 請求攔截器 interceptors.request
// 3. 送出
// 4. 回應攔截器 interceptors.response
// 5. await / .then() .catch()

// 在每個請求前，加入 token
// config = 請求設定值，路徑、資料等等
apiAuth.interceptors.request.use(config => {
  const user = useUserStore()
  config.headers.Authorization = `Bearer ${user.token}`
  return config
})

export default {
  api,
  apiAuth,
  busapi,
  busapiAuth,
}

busapiAuth.interceptors.request.use(config => {
  const bus = useNewbusStore()
  // console.log('-----------', bus.token)
  config.headers.Authorization = `Bearer ${bus.token}`
  return config
})
