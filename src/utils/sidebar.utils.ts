import { PrivateRoutes } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { User, UserCogIcon, Building, Home, Users, Building2, MapPin, BookOpen } from 'lucide-react'
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
  }
]
