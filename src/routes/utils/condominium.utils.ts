import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const CondominiumManagementPage = lazy(() => import('@/modules/condominium/components/CondominiumManagementPage'))
const GeneralRulesPage = lazy(() => import('@/modules/condominium/pages/general-rules'))
const GeneralRuleFormPage = lazy(() => import('@/modules/condominium/pages/general-rules/components/general-rule-form'))

export const condominiumRoutes: Route[] = [
  {
    path: PrivateRoutes.CONDOMINIUM_MANAGEMENT,
    element: createElement(CondominiumManagementPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.GENERAL_RULES,
    element: createElement(GeneralRulesPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.GENERAL_RULES_CREATE,
    element: createElement(GeneralRuleFormPage, { 
      buttonText: 'Crear Regla', 
      title: 'Crear Regla General' 
    }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.GENERAL_RULES_EDIT,
    element: createElement(GeneralRuleFormPage, { 
      buttonText: 'Actualizar Regla', 
      title: 'Editar Regla General' 
    }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  }
]