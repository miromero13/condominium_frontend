import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

// Lazy loading de las páginas del módulo
const QuoteModulePage = lazy(() => import('@modules/quote/pages/QuoteModulePage'))
const QuoteListPage = lazy(() => import('@modules/quote/pages/quotes/QuoteListPage'))
const PaymentMethodListPage = lazy(() => import('@modules/quote/pages/payment-methods/PaymentMethodListPage'))

export const quoteRoutes: Route[] = [
  // Página principal del módulo
  {
    path: PrivateRoutes.QUOTES_MODULE,
    element: createElement(QuoteModulePage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },

  // Rutas de cuotas
  {
    path: PrivateRoutes.QUOTES,
    element: createElement(QuoteListPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.QUOTES_VIEW,
    element: createElement(QuoteListPage), // Por ahora usar la lista, después crear detalle
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.QUOTES_CREATE,
    element: createElement(QuoteListPage), // Por ahora usar la lista, después crear formulario
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.QUOTES_EDIT,
    element: createElement(QuoteListPage), // Por ahora usar la lista, después crear formulario
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.QUOTES_GENERATE,
    element: createElement(QuoteListPage), // Por ahora usar la lista, después crear generador
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },

  // Rutas de métodos de pago
  {
    path: PrivateRoutes.PAYMENT_METHODS,
    element: createElement(PaymentMethodListPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PAYMENT_METHODS_VIEW,
    element: createElement(PaymentMethodListPage), // Por ahora usar la lista, después crear detalle
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PAYMENT_METHODS_CREATE,
    element: createElement(PaymentMethodListPage), // Por ahora usar la lista, después crear formulario
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PAYMENT_METHODS_EDIT,
    element: createElement(PaymentMethodListPage), // Por ahora usar la lista, después crear formulario
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  }
]