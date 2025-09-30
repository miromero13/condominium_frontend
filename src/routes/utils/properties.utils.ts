import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const PropertyPage = lazy(() => import('@/modules/properties/pages/properties'))
const PropertyFormPage = lazy(() => import('@/modules/properties/pages/properties/components/property-form'))
const PropertyPetsPage = lazy(() => import('@/modules/properties/pages/pets'))
const PropertyVehiclesPage = lazy(() => import('@/modules/properties/pages/vehicles'))

export const propertyRoutes: Route[] = [
  {
    path: PrivateRoutes.PROPERTY,
    element: createElement(PropertyPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PROPERTY_CREATE,
    element: createElement(PropertyFormPage, { 
      buttonText: 'Crear Propiedad', 
      title: 'Crear Propiedad' 
    }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PROPERTY_EDIT,
    element: createElement(PropertyFormPage, { 
      buttonText: 'Actualizar Propiedad', 
      title: 'Editar Propiedad' 
    }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PROPERTY_PETS,
    element: createElement(PropertyPetsPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PROPERTY_VEHICLES,
    element: createElement(PropertyVehiclesPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  }
]