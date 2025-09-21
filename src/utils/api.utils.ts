import { AppConfig } from '../config'

export const ENDPOINTS = {
  // auth
  API: '/api',
  LOGIN: '/api/auth/login-admin/',
  CHECK_TOKEN: '/api/auth/check-token/',
  // users
  USER: '/api/users/',
}

export const API_BASEURL = AppConfig.API_URL

export const buildUrl = ({ endpoint, id = undefined, query = undefined }: { endpoint: string, id?: string, query?: string }) => {
  return `${API_BASEURL}${endpoint}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`
}
