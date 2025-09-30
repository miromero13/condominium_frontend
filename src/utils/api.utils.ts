import { AppConfig } from '../config'

export const ENDPOINTS = {
  // auth
  API: '/api',
  LOGIN: '/api/auth/login-admin/',
  CHECK_TOKEN: '/api/auth/check-token/',
  // users
  USER: '/api/users/', // Para administradores y guardias
  RESIDENT: '/api/residents/', // Para residentes, propietarios y visitantes
  // properties
  PROPERTY: '/api/properties/',
  PET: '/api/pets/',
  VEHICLE: '/api/vehicles/',
  // condominium
  CONDOMINIUM: '/api/condominium/',
  COMMON_AREA: '/api/common-areas/',
  COMMON_AREA_RULE: '/api/common-area-rules/',
  GENERAL_RULE: '/api/general-rules/',
  RESERVATION: '/api/reservations/',
  // security
  DETECT_PLATE: '/api/ai-system/detect-plate/',
  VEHICLES: '/api/vehicles/',
  ACCESS_HISTORY: '/api/eventos-ai/',
}

export const API_BASEURL = AppConfig.API_URL

export const buildUrl = ({ endpoint, id = undefined, query = undefined }: { endpoint: string, id?: string, query?: string }) => {
  return `${API_BASEURL}${endpoint}${id ? `${id}/` : ''}${query ? `?${query}` : ''}`
}
