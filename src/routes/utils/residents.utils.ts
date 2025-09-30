import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const ResidentPage = lazy(() => import('@modules/residents/pages/residents'))
const ResidentFormPage = lazy(() => import('@modules/residents/pages/residents/components/resident-form'))

export const residentRoutes: Route[] = [
  {
    path: PrivateRoutes.RESIDENT,
    element: createElement(ResidentPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.RESIDENT_CREATE,
    element: createElement(ResidentFormPage, { buttonText: 'Guardar Residente', title: 'Crear Residente' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.RESIDENT_EDIT,
    element: createElement(ResidentFormPage, { buttonText: 'Editar Residente', title: 'Actualizar Residente' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  }
]