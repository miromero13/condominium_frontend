import { PrivateRoutes } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { User, UserCogIcon } from 'lucide-react'
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
      }
    ]
  }
]
