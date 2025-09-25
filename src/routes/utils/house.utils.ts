import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const HousePage = lazy(() => import('@modules/house/pages/house'))
const HouseFormPage = lazy(() => import('@modules/house/pages/house/components/house-form'))
const HouseUserPage = lazy(() => import('@modules/house/pages/house-user'))
const HouseUserFormPage = lazy(() => import('@modules/house/pages/house-user/components/house-user-form'))
const PetPage = lazy(() => import('@modules/house/pages/pet'))
const PetFormPage = lazy(() => import('@modules/house/pages/pet/components/pet-form'))
const VehiclePage = lazy(() => import('@modules/house/pages/vehicle'))
const VehicleFormPage = lazy(() => import('@modules/house/pages/vehicle/components/vehicle-form'))

export const houseRoutes: Route[] = [
  {
    path: PrivateRoutes.HOUSE,
    element: createElement(HousePage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.HOUSE_CREATE,
    element: createElement(HouseFormPage, { buttonText: 'Crear Vivienda', title: 'Crear Vivienda' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.HOUSE_EDIT,
    element: createElement(HouseFormPage, { buttonText: 'Actualizar Vivienda', title: 'Editar Vivienda' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.HOUSE_USER,
    element: createElement(HouseUserPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.HOUSE_USER_CREATE,
    element: createElement(HouseUserFormPage, { buttonText: 'Crear Usuario-Vivienda', title: 'Crear Usuario-Vivienda' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.HOUSE_USER_EDIT,
    element: createElement(HouseUserFormPage, { buttonText: 'Actualizar Usuario-Vivienda', title: 'Editar Usuario-Vivienda' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PET,
    element: createElement(PetPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PET_CREATE,
    element: createElement(PetFormPage, { buttonText: 'Crear Mascota', title: 'Crear Mascota' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PET_EDIT,
    element: createElement(PetFormPage, { buttonText: 'Actualizar Mascota', title: 'Editar Mascota' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.VEHICLE,
    element: createElement(VehiclePage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.VEHICLE_CREATE,
    element: createElement(VehicleFormPage, { buttonText: 'Crear Vehículo', title: 'Crear Vehículo' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.VEHICLE_EDIT,
    element: createElement(VehicleFormPage, { buttonText: 'Actualizar Vehículo', title: 'Editar Vehículo' }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  }
]
