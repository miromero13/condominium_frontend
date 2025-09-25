import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  CreditCard,
  Settings,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'
import { useGetAllPaymentMethods, useDeletePaymentMethod, useUpdatePaymentMethod } from '../../hooks'
import { type PaymentMethod } from '../../models'

export default function PaymentMethodListPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    allPaymentMethods,
    isLoading,
    error,
    mutate
  } = useGetAllPaymentMethods()

  const { deletePaymentMethod, isMutating: isDeleting } = useDeletePaymentMethod()
  const { updatePaymentMethod, isMutating: isUpdating } = useUpdatePaymentMethod()

  // Filtrar métodos de pago por búsqueda
  const filteredMethods = allPaymentMethods.filter((method: PaymentMethod) =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (method.description && method.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Handlers
  const handleDeleteMethod = async (methodId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este método de pago?')) return
    
    try {
      await deletePaymentMethod(methodId)
      mutate()
    } catch (error) {
      console.error('Error deleting payment method:', error)
    }
  }

  const handleToggleActive = async (method: PaymentMethod) => {
    try {
      await updatePaymentMethod({
        id: method.id,
        is_active: !method.is_active
      })
      mutate()
    } catch (error) {
      console.error('Error updating payment method:', error)
    }
  }

  const getMethodTypeIcon = (method: PaymentMethod) => {
    if (method.requires_gateway) {
      return <Settings className="h-4 w-4 text-blue-500" />
    } else if (method.manual_verification) {
      return <CheckCircle className="h-4 w-4 text-orange-500" />
    } else {
      return <CreditCard className="h-4 w-4 text-green-500" />
    }
  }

  const getMethodTypeText = (method: PaymentMethod) => {
    if (method.requires_gateway) {
      return 'Gateway'
    } else if (method.manual_verification) {
      return 'Manual'
    } else {
      return 'Automático'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Métodos de Pago</h1>
          <p className="text-muted-foreground">
            Configura los métodos de pago disponibles para los residentes
          </p>
        </div>
        <Button asChild>
          <Link to="/cuotas/metodos-pago/crear">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Método
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Métodos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allPaymentMethods.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {allPaymentMethods.filter((m: PaymentMethod) => m.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Gateway</CardTitle>
            <Settings className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {allPaymentMethods.filter((m: PaymentMethod) => m.requires_gateway).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manuales</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {allPaymentMethods.filter((m: PaymentMethod) => m.manual_verification).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Buscar Métodos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o descripción..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago Configurados</CardTitle>
          <CardDescription>
            {filteredMethods.length} método{filteredMethods.length !== 1 ? 's' : ''} encontrado{filteredMethods.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="text-sm text-muted-foreground">Cargando...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-6">
              <div className="text-sm text-red-500">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Error al cargar los métodos de pago
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Configuración</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMethods.map((method: PaymentMethod) => (
                  <TableRow key={method.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {getMethodTypeIcon(method)}
                        <span>{method.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {method.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getMethodTypeText(method)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={method.is_active}
                          onCheckedChange={() => handleToggleActive(method)}
                          disabled={isUpdating}
                        />
                        <span className="text-sm">
                          {method.is_active ? (
                            <span className="text-green-600">Activo</span>
                          ) : (
                            <span className="text-gray-500">Inactivo</span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          {method.requires_gateway ? (
                            <Badge variant="secondary" className="text-xs">
                              <Settings className="mr-1 h-3 w-3" />
                              Gateway
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <X className="mr-1 h-3 w-3" />
                              Sin Gateway
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.manual_verification ? (
                            <Badge variant="secondary" className="text-xs">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Manual
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Automático
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/cuotas/metodos-pago/${method.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/cuotas/metodos-pago/${method.id}/editar`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(method)}
                            disabled={isUpdating}
                          >
                            {method.is_active ? (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteMethod(method.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMethods.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm ? 'No se encontraron métodos que coincidan con la búsqueda' : 'No hay métodos de pago configurados'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}