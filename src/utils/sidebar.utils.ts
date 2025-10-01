import { PrivateRoutes } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { User, UserCogIcon, Building, Home, Users, Building2, MapPin, BookOpen, Shield, Camera, Car, History } from 'lucide-react'
import { createElement } from 'react'

export interface MenuHeaderRoute {
  path?: string
  label: string
  icon?: JSX.Element
  children?: MenuHeaderRoute[]
  permissions?: PERMISSION[]
}

export const MenuSideBar: MenuHeaderRoute[] = [
  {
    label: 'Gestion de Usuarios',
    icon: createElement(UserCogIcon, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[],
    children: [
      {
        label: 'Administrativos',
        icon: createElement(User, { width: 20, height: 20 }),
        path: PrivateRoutes.USER,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      },
      {
        label: 'Residentes',
        icon: createElement(Users, { width: 20, height: 20 }),
        path: PrivateRoutes.RESIDENT,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Gestión de Propiedades',
    icon: createElement(Building, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[],
    children: [
      {
        label: 'Propiedades',
        icon: createElement(Home, { width: 20, height: 20 }),
        path: PrivateRoutes.PROPERTY,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Gestión de Condominio',
    icon: createElement(Building2, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[],
    children: [
      {
        label: 'Condominio',
        icon: createElement(Building, { width: 20, height: 20 }),
        path: PrivateRoutes.CONDOMINIUM_MANAGEMENT,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      },
      {
        label: 'Áreas Comunes',
        icon: createElement(MapPin, { width: 20, height: 20 }),
        path: PrivateRoutes.COMMON_AREA,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      },
      {
        label: 'Reglamento General',
        icon: createElement(BookOpen, { width: 20, height: 20 }),
        path: PrivateRoutes.GENERAL_RULES,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Gestión de Seguridad',
    icon: createElement(Shield, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD] as PERMISSION[],
    children: [
      {
        label: 'Detector de Placas',
        icon: createElement(Camera, { width: 20, height: 20 }),
        path: PrivateRoutes.SECURITY_DETECTOR,
        permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD] as PERMISSION[]
      },
      {
        label: 'Detector de Personas',
        icon: createElement(User, { width: 20, height: 20 }),
        path: PrivateRoutes.SECURITY_PERSON,
        permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD] as PERMISSION[]
      },
      {
        label: 'Vehículos Registrados',
        icon: createElement(Car, { width: 20, height: 20 }),
        path: PrivateRoutes.SECURITY_VEHICLES,
        permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD] as PERMISSION[]
      },
      {
        label: 'Historial de Accesos',
        icon: createElement(History, { width: 20, height: 20 }),
        path: PrivateRoutes.SECURITY_HISTORY,
        permissions: [PERMISSION.ADMINISTRATOR, PERMISSION.GUARD] as PERMISSION[]
      }
    ]
  }
]
