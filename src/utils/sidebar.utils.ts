import { PrivateRoutes } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { User, UserCogIcon, Users, Home, Dog, Car, UserCheck, CalendarDays, CreditCard } from 'lucide-react'
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
        label: 'Generales',
        icon: createElement(Users, { width: 20, height: 20 }),
        path: PrivateRoutes.ALL_USERS,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Gestion de Viviendas',
    icon: createElement(Home, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[],
    children: [
      {
        label: 'Viviendas',
        icon: createElement(Home, { width: 20, height: 20 }),
        path: PrivateRoutes.HOUSE,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      },
      {
        label: 'Usuario-Vivienda',
        icon: createElement(UserCheck, { width: 20, height: 20 }),
        path: PrivateRoutes.HOUSE_USER,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      },
      {
        label: 'Mascotas',
        icon: createElement(Dog, { width: 20, height: 20 }),
        path: PrivateRoutes.PET,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      },
      {
        label: 'Vehículos',
        icon: createElement(Car, { width: 20, height: 20 }),
        path: PrivateRoutes.VEHICLE,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Gestión de Cuotas',
    icon: createElement(CalendarDays, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[],
    children: [
      {
        label: 'Panel Principal',
        icon: createElement(CalendarDays, { width: 20, height: 20 }),
        path: PrivateRoutes.QUOTES_MODULE,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      },
      {
        label: 'Cuotas',
        icon: createElement(CalendarDays, { width: 20, height: 20 }),
        path: PrivateRoutes.QUOTES,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      },
      {
        label: 'Métodos de Pago',
        icon: createElement(CreditCard, { width: 20, height: 20 }),
        path: PrivateRoutes.PAYMENT_METHODS,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      }
    ]
  }
]
