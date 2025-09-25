import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

export enum PublicRoutes {
  LOGIN = '/login',
  RESET_PASSWORD = '/reset-password',
}

export enum PrivateRoutes {
  DASHBOARD = '/',
  // users
  USER = '/usuarios',
  USER_CREATE = '/usuarios/crear',
  USER_EDIT = '/usuarios/:id',
  
  // all users (generales)
  ALL_USERS = '/usuarios-generales',
  ALL_USERS_CREATE = '/usuarios-generales/crear',
  ALL_USERS_EDIT = '/usuarios-generales/:id',

  // houses
  HOUSE = '/viviendas',
  HOUSE_CREATE = '/viviendas/crear',
  HOUSE_EDIT = '/viviendas/:id',
  
  // house-users (usuario-vivienda)
  HOUSE_USER = '/vivienda-usuarios',
  HOUSE_USER_CREATE = '/vivienda-usuarios/crear',
  HOUSE_USER_EDIT = '/vivienda-usuarios/:id',
  
  // pets
  PET = '/mascotas',
  PET_CREATE = '/mascotas/crear',
  PET_EDIT = '/mascotas/:id',
  
  // vehicles
  VEHICLE = '/vehiculos',
  VEHICLE_CREATE = '/vehiculos/crear',
  VEHICLE_EDIT = '/vehiculos/:id',

  // quotes module
  QUOTES_MODULE = '/cuotas',
  QUOTES = '/cuotas/cuotas',
  QUOTES_CREATE = '/cuotas/cuotas/crear',
  QUOTES_EDIT = '/cuotas/cuotas/:id/editar',
  QUOTES_VIEW = '/cuotas/cuotas/:id',
  QUOTES_GENERATE = '/cuotas/cuotas/generar',

  // payment methods
  PAYMENT_METHODS = '/cuotas/metodos-pago',
  PAYMENT_METHODS_CREATE = '/cuotas/metodos-pago/crear',
  PAYMENT_METHODS_EDIT = '/cuotas/metodos-pago/:id/editar',
  PAYMENT_METHODS_VIEW = '/cuotas/metodos-pago/:id',
}

export interface Route {
  path: PrivateRoutes | PublicRoutes | '/*'
  element: JSX.Element | JSX.Element[]
  permissions?: PERMISSION[]
}
