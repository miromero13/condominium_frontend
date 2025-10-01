import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

export enum PublicRoutes {
  LOGIN = '/login',
  RESET_PASSWORD = '/reset-password',
  PAYMENT_SUCCESS = '/payment/success',
  PAYMENT_CANCEL = '/payment/cancel',
}

export enum PrivateRoutes {
  DASHBOARD = '/',
  // users
  USER = '/usuarios',
  USER_CREATE = '/usuarios/crear',
  USER_EDIT = '/usuarios/:id',
  // residents
  RESIDENT = '/residentes',
  RESIDENT_CREATE = '/residentes/crear',
  RESIDENT_EDIT = '/residentes/:id',
  // properties
  PROPERTY = '/propiedades',
  PROPERTY_CREATE = '/propiedades/crear',
  PROPERTY_EDIT = '/propiedades/:id',
  // pets and vehicles from properties
  PROPERTY_PETS = '/propiedades/:propertyId/mascotas',
  PROPERTY_VEHICLES = '/propiedades/:propertyId/vehiculos',
  // condominium management
  CONDOMINIUM_MANAGEMENT = '/condominio',
  GENERAL_RULES = '/condominio/reglamento-general',
  GENERAL_RULES_CREATE = '/condominio/reglamento-general/crear',
  GENERAL_RULES_EDIT = '/condominio/reglamento-general/:id',
  // common areas
  COMMON_AREA = '/areas-comunes',
  COMMON_AREA_CREATE = '/areas-comunes/crear',
  COMMON_AREA_EDIT = '/areas-comunes/:id',
  COMMON_AREA_RULES = '/areas-comunes/:areaId/reglamento',
  COMMON_AREA_RESERVATIONS = '/areas-comunes/:areaId/reservas',
  // security
  SECURITY_DETECTOR = '/seguridad/detector',
  SECURITY_VEHICLES = '/seguridad/vehiculos',
  SECURITY_HISTORY = '/seguridad/historial',
}

export interface Route {
  path: PrivateRoutes | PublicRoutes | '/*'
  element: JSX.Element | JSX.Element[]
  permissions?: PERMISSION[]
}
