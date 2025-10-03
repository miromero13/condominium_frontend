import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const PlateDetectorPage = lazy(() => import('@modules/security/pages/detector'))
const VehiclesPage = lazy(() => import('@modules/security/pages/vehicles'))  
const HistoryPage = lazy(() => import('@modules/security/pages/history'))
const FaceDetectorPage = lazy(() => import('@modules/security/pages/person'))

export const securityRoutes: Route[] = [
  {
    path: PrivateRoutes.SECURITY_DETECTOR,
    element: createElement(PlateDetectorPage),
    permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD] as PERMISSION[]
  },
  {
    path: PrivateRoutes.SECURITY_VEHICLES,
    element: createElement(VehiclesPage),
    permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD] as PERMISSION[]
  },
  {
    path: PrivateRoutes.SECURITY_HISTORY,
    element: createElement(HistoryPage),
    permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD] as PERMISSION[]
  },
  {
    path: PrivateRoutes.SECURITY_PERSON,
    element: createElement(FaceDetectorPage),
    permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD] as PERMISSION[]
  }
]