import axios from 'axios'
import { getApiBaseUrl, getErrorMessage } from '../utils/helpers'
import { supabase } from '../context/AuthContext'

export const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30_000,
})

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        const token = data?.session?.access_token
        if (token) {
          config.headers = config.headers ?? {}
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (_e) {
      void _e
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = new Error(getErrorMessage(error))
    normalized.original = error
    return Promise.reject(normalized)
  }
)

