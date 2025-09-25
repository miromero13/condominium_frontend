import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const UserPage = lazy(() => import('@modules/users/pages/users'))
const UserFormPage = lazy(() => import('@modules/users/pages/users/components/user-form'))
const AllUsersPage = lazy(() => import('@modules/users/pages/all-users'))
const AllUsersFormPage = lazy(() => import('@modules/users/pages/all-users/components/all-users-form'))

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
  },
  {
    path: PrivateRoutes.ALL_USERS,
    element: createElement(AllUsersPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.ALL_USERS_CREATE,
    element: createElement(AllUsersFormPage, { buttonText: 'Crear Usuario', title: 'Crear Usuario General' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.ALL_USERS_EDIT,
    element: createElement(AllUsersFormPage, { buttonText: 'Actualizar Usuario', title: 'Editar Usuario General' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  }
]
