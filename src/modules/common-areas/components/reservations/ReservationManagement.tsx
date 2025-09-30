import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Search, Calendar, Clock, Users, CheckCircle, XCircle, Trash2, Edit, Eye } from 'lucide-react'
import { useDeleteResource } from '@/hooks/useApiResource'
import { ENDPOINTS, buildUrl, API_BASEURL } from '@/utils'
import { 
  Reservation, 
  ReservationStatus, 
  ReservationStatusOptions, 
  getStatusColor,
  ApproveRejectReservationRequest,
  PrivateRoutes
} from '@/models'
import { ReservationForm } from './ReservationForm'
import { ReservationDetail } from './ReservationDetail'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'

interface ReservationManagementProps {
  commonAreaId?: string
}

export function ReservationManagement({ commonAreaId }: ReservationManagementProps) {
  const navigate = useNavigate()
  const params = useParams()
  const areaId = commonAreaId || params.areaId
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Fetcher function for useSWR
  const apiCall = async (url: string) => {
    // Si la URL no incluye el dominio, agregar la base URL
    const fullUrl = url.startsWith('http') ? url : `${API_BASEURL}${url}`
    const token = localStorage.getItem('token')
    
    console.log('🌐 Making API call to:', fullUrl) // Debug log
    
    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  // Obtener área común si tenemos ID
  const { data: commonAreaResponse } = useSWR<any>(
    areaId ? buildUrl({ endpoint: ENDPOINTS.COMMON_AREA, id: areaId }) : null,
    apiCall
  )
  
  const commonArea = commonAreaResponse?.data

  const { deleteResource } = useDeleteResource(ENDPOINTS.RESERVATION)

  // Construir la URL con filtros para obtener reservas
  const buildSWRKey = () => {
    const params = new URLSearchParams()
    
    // Si hay areaId, filtrar automáticamente por área común
    if (areaId) {
      params.append('common_area_id', areaId)
    }
    
    // Filtrar por estado si no es 'all'
    if (statusFilter !== 'all') {
      params.append('status', statusFilter)
    }
    
    // Búsqueda por propósito
    if (searchTerm.trim()) {
      params.append('attr', 'purpose')
      params.append('value', searchTerm.trim())
    }
    
    const finalUrl = buildUrl({ 
      endpoint: ENDPOINTS.RESERVATION, 
      query: params.toString() 
    })
    console.log('🚀 Building SWR key:', finalUrl) // Debug log
    return finalUrl
  }

  // Usar useSWR directo para obtener las reservas filtradas
  const { data: reservationData, mutate: mutateReservations, isLoading } = useSWR(
    buildSWRKey(),
    apiCall
  )
  
  // Debug logs
  console.log('🔍 Debug info:', {
    areaId,
    commonAreaResponse,
    commonArea,
    reservationData,
    buildSWRKeyResult: buildSWRKey()
  })
  
  // Extraer las reservas de la respuesta del backend
  const finalReservations = reservationData?.data || []
  const finalMutate = mutateReservations

  const handleStatusChange = async (reservationId: string, action: 'approve' | 'reject', data?: ApproveRejectReservationRequest) => {
    try {
      const actionUrl = buildUrl({ 
        endpoint: ENDPOINTS.RESERVATION, 
        id: reservationId, 
        query: `${action}/` 
      })
      
      console.log(`🔄 ${action} reservation:`, actionUrl) // Debug log
      
      const response = await fetch(actionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data || {})
      })

      if (response.ok) {
        toast.success(`Reserva ${action === 'approve' ? 'aprobada' : 'rechazada'} exitosamente`)
        finalMutate()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al procesar la reserva')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  const handleCancel = async (reservationId: string, data?: ApproveRejectReservationRequest) => {
    try {
      const cancelUrl = buildUrl({ 
        endpoint: ENDPOINTS.RESERVATION, 
        id: reservationId, 
        query: 'cancel/' 
      })
      
      console.log('🚫 Cancel reservation:', cancelUrl) // Debug log
      
      const response = await fetch(cancelUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data || {})
      })

      if (response.ok) {
        toast.success('Reserva cancelada exitosamente')
        finalMutate()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al cancelar la reserva')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  const handleDelete = async (reservationId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      return
    }

    try {
      await deleteResource(reservationId)
      toast.success('Reserva eliminada exitosamente')
      finalMutate()
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar la reserva')
    }
  }

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowDetailDialog(true)
  }

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowEditDialog(true)
  }

  const onReservationSuccess = () => {
    finalMutate()
    setShowCreateDialog(false)
    setShowEditDialog(false)
    setSelectedReservation(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!commonAreaId && (
            <Button variant="ghost" size="sm" onClick={() => navigate(PrivateRoutes.COMMON_AREA)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {commonArea ? `Reservas - ${commonArea.name}` : 'Gestión de Reservas'}
            </h1>
            <p className="text-muted-foreground">
              {commonArea 
                ? 'Administra las reservas de este área común'
                : 'Administra todas las reservas de áreas comunes'
              }
            </p>
          </div>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reserva{areaId ? ` - ${commonArea?.name}` : ''}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Nueva Reserva{areaId ? ` - ${commonArea?.name}` : ''}
              </DialogTitle>
            </DialogHeader>
            <ReservationForm
              commonAreaId={areaId}
              commonArea={commonArea}
              onSuccess={onReservationSuccess}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Información del área común */}
      {commonArea && (
        <Card>
          <CardHeader>
            <CardTitle>{commonArea.name}</CardTitle>
            <CardDescription>{commonArea.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Capacidad: {commonArea.capacity || 'Sin límite'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  Horario: {formatTime(commonArea.available_from)} - {formatTime(commonArea.available_to)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Costo: {formatCurrency(commonArea.cost_per_hour)}/hora</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por propósito o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={(value: ReservationStatus | 'all') => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {ReservationStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de reservas */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {!commonArea && <TableHead>Área Común</TableHead>}
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Propósito</TableHead>
                  <TableHead>Asistentes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={commonArea ? 7 : 8} className="text-center py-8">
                      Cargando reservas...
                    </TableCell>
                  </TableRow>
                ) : finalReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={commonArea ? 7 : 8} className="text-center py-8 text-muted-foreground">
                      No se encontraron reservas
                    </TableCell>
                  </TableRow>
                ) : (
                  finalReservations.map((reservation: Reservation) => (
                    <TableRow key={reservation.id}>
                      {!commonArea && (
                        <TableCell className="font-medium">
                          {reservation.common_area.name}
                        </TableCell>
                      )}
                      <TableCell>
                        <div>
                          <div className="font-medium">{reservation.user.first_name} {reservation.user.last_name}</div>
                          <div className="text-sm text-muted-foreground">{reservation.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(reservation.reservation_date)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={reservation.purpose}>
                          {reservation.purpose}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {reservation.estimated_attendees}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(reservation.status)}
                        >
                          {reservation.status_display}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{formatCurrency(reservation.total_cost)}</div>
                          <div className="text-xs text-muted-foreground">
                            {reservation.total_hours}h
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(reservation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {reservation.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(reservation.id, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(reservation.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          
                          {['pending', 'approved'].includes(reservation.status) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(reservation.id)}
                            >
                              <XCircle className="h-4 w-4 text-orange-600" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(reservation.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de detalles */}
      {selectedReservation && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles de la Reserva</DialogTitle>
            </DialogHeader>
            <ReservationDetail
              reservation={selectedReservation}
              onClose={() => setShowDetailDialog(false)}
              onStatusChange={handleStatusChange}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de edición */}
      {selectedReservation && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Reserva - {selectedReservation.common_area.name}</DialogTitle>
            </DialogHeader>
            <ReservationForm
              reservation={selectedReservation}
              commonArea={selectedReservation.common_area}
              onSuccess={onReservationSuccess}
              onCancel={() => setShowEditDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}