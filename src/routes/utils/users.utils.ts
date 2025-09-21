import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const UserPage = lazy(() => import('@modules/users/pages/users'))
const UserFormPage = lazy(() => import('@modules/users/pages/users/components/user-form'))

export const userRoutes: Route[] = [
  {
    path: PrivateRoutes.USER,
    element: createElement(UserPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.USER_CREATE,
    element: createElement(UserFormPage, { buttonText: 'Guardar Administrativo', title: 'Crear Administrativo' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.USER_EDIT,
    element: createElement(UserFormPage, { buttonText: 'Editar Administrativo', title: 'Actualizar Administrativo' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  }
]
