import { AppConfig } from '../config'

export const ENDPOINTS = {
  // auth
  API: '/api',
  LOGIN: '/api/auth/login-admin/',
  CHECK_TOKEN: '/api/auth/check-token/',
  // users
  USER: '/api/users/',
  ALL_USERS: '/api/all-users/',
  // houses
  HOUSE: '/api/houses/',
  HOUSE_USER: '/api/house-users/',
  PET: '/api/pets/',
  VEHICLE: '/api/vehicles/',
  // quotes
  QUOTE: '/api/quotes/',
  PAYMENT_METHOD: '/api/payment-methods/',
  PAYMENT_GATEWAY: '/api/payment-gateways/',
}

export const API_BASEURL = AppConfig.API_URL

export const buildUrl = ({ endpoint, id = undefined, query = undefined }: { endpoint: string, id?: string, query?: string }) => {
  return `${API_BASEURL}${endpoint}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`
}
