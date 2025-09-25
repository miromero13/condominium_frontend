import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { CalendarDays, CreditCard, BarChart3, Plus } from 'lucide-react'
import { useQuoteStatistics } from '../hooks'

export default function QuoteModulePage() {
  const currentYear = new Date().getFullYear()
  const { statistics, isLoading } = useQuoteStatistics(currentYear)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Cuotas</h1>
        <p className="text-muted-foreground">
          Administra cuotas del condominio y métodos de pago disponibles
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && !isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cuotas</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.statistics.total_quotes}</div>
              <p className="text-xs text-muted-foreground">
                Cuotas del año {statistics.year}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <CalendarDays className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statistics.statistics.pending_quotes}</div>
              <p className="text-xs text-muted-foreground">
                ${statistics.statistics.total_amount_pending}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagadas</CardTitle>
              <CalendarDays className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.statistics.paid_quotes}</div>
              <p className="text-xs text-muted-foreground">
                ${statistics.statistics.total_amount_paid}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
              <CalendarDays className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{statistics.statistics.overdue_quotes}</div>
              <p className="text-xs text-muted-foreground">
                ${statistics.statistics.total_amount_overdue}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Cuotas Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <CardTitle>Administrar Cuotas</CardTitle>
            </div>
            <CardDescription>
              Gestiona las cuotas del condominio, genera automáticamente y marca como pagadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Ver listado</Badge>
                <Badge variant="secondary">Crear nueva</Badge>
                <Badge variant="secondary">Auto-generar</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Marcar pagada</Badge>
                <Badge variant="outline">Estadísticas</Badge>
                <Badge variant="outline">Enlaces de pago</Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button asChild>
                <Link to="/cuotas/cuotas">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Ver Cuotas
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/cuotas/cuotas/crear">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Cuota
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pago Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Métodos de Pago</CardTitle>
            </div>
            <CardDescription>
              Configura los métodos de pago disponibles para los residentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Transferencia</Badge>
                <Badge variant="secondary">MercadoPago</Badge>
                <Badge variant="secondary">Manual</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Configuración</Badge>
                <Badge variant="outline">Activar/Desactivar</Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button asChild>
                <Link to="/cuotas/metodos-pago">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Ver Métodos
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/cuotas/metodos-pago/crear">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Método
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Statistics */}
      {statistics && !isLoading && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Estadísticas Rápidas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {statistics.statistics.paid_quotes > 0 
                    ? Math.round((statistics.statistics.paid_quotes / statistics.statistics.total_quotes) * 100)
                    : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Tasa de cobro</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {statistics.statistics.overdue_quotes > 0 
                    ? Math.round((statistics.statistics.overdue_quotes / statistics.statistics.total_quotes) * 100)
                    : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Cuotas vencidas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${(
                    parseFloat(statistics.statistics.total_amount_paid || '0') + 
                    parseFloat(statistics.statistics.total_amount_pending || '0') + 
                    parseFloat(statistics.statistics.total_amount_overdue || '0')
                  ).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Total facturado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}