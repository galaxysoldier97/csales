import axios from 'axios'

const tokenApi = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/api/` 
})

tokenApi.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Agregar 'Content-Type': 'application/json' a los encabezados de la solicitud
  config.headers['Content-Type'] = 'application/json'
  return config
}, function (error) {
  return Promise.reject(error)
})

export default tokenApi