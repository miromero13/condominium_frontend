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
}

export interface Route {
  path: PrivateRoutes | PublicRoutes | '/*'
  element: JSX.Element | JSX.Element[]
  permissions?: PERMISSION[]
}
