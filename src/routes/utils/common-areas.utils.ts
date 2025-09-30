import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const CommonAreasPage = lazy(() => import('@modules/common-areas/pages/common-areas'))
const CommonAreaFormPage = lazy(() => import('@modules/common-areas/pages/common-areas/components/common-area-form'))
const CommonAreaRulesPage = lazy(() => import('@modules/common-areas/pages/common-areas/components/common-area-rules'))
const CommonAreaReservationsPage = lazy(() => import('@modules/common-areas/pages/reservations'))

export const commonAreaRoutes: Route[] = [
  {
    path: PrivateRoutes.COMMON_AREA,
    element: createElement(CommonAreasPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.COMMON_AREA_CREATE,
    element: createElement(CommonAreaFormPage, { 
      buttonText: 'Crear Área Común', 
      title: 'Crear Área Común' 
    }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.COMMON_AREA_EDIT,
    element: createElement(CommonAreaFormPage, { 
      buttonText: 'Actualizar Área Común', 
      title: 'Editar Área Común' 
    }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.COMMON_AREA_RULES,
    element: createElement(CommonAreaRulesPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.COMMON_AREA_RESERVATIONS,
    element: createElement(CommonAreaReservationsPage),
    permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD, PERMISSION.OWNER, PERMISSION.RESIDENT] as PERMISSION[]
  }
]