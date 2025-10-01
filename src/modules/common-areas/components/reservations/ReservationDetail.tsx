import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  User, 
  FileText, 
  DollarSign,
  CheckCircle,
  XCircle,
  Ban
} from 'lucide-react'
import { 
  Reservation, 
  getStatusColor,
  ApproveRejectReservationRequest
} from '@/models'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'

interface ReservationDetailProps {
  reservation: Reservation
  onClose: () => void
  onStatusChange: (reservationId: string, action: 'approve' | 'reject', data?: ApproveRejectReservationRequest) => void
  onCancel: (reservationId: string, data?: ApproveRejectReservationRequest) => void
}

export function ReservationDetail({ 
  reservation, 
  onClose, 
  onStatusChange, 
  onCancel 
}: ReservationDetailProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')

  const handleApprove = () => {
    onStatusChange(reservation.id, 'approve', { admin_notes: adminNotes })
    setShowApproveDialog(false)
    setAdminNotes('')
    toast.success('Reserva aprobada exitosamente')
  }

  const handleReject = () => {
    if (!adminNotes.trim()) {
      toast.error('Las notas administrativas son requeridas para rechazar una reserva')
      return
    }
    onStatusChange(reservation.id, 'reject', { admin_notes: adminNotes })
    setShowRejectDialog(false)
    setAdminNotes('')
    toast.success('Reserva rechazada')
  }

  const handleCancelReservation = () => {
    onCancel(reservation.id, { admin_notes: adminNotes })
    setShowCancelDialog(false)
    setAdminNotes('')
    toast.success('Reserva cancelada')
  }

  const canApproveReject = reservation.status === 'pending'
  const canCancel = ['pending', 'approved'].includes(reservation.status)

  return (
    <div className="space-y-6">
      {/* Estado y acciones principales */}
      <div className="flex items-center justify-between">
        <Badge 
          variant="outline" 
          className={`${getStatusColor(reservation.status)} text-sm px-3 py-1`}
        >
          {reservation.status_display}
        </Badge>
        
        <div className="flex gap-2">
          {canApproveReject && (
            <>
              <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Aprobar Reserva</DialogTitle>
                    <DialogDescription>
                      ¿Estás seguro de que deseas aprobar esta reserva?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="approve-notes">Notas administrativas (opcional)</Label>
                    <Textarea
                      id="approve-notes"
                      placeholder="Agregar comentarios sobre la aprobación..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleApprove}>
                      Aprobar Reserva
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                    <XCircle className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rechazar Reserva</DialogTitle>
                    <DialogDescription>
                      ¿Estás seguro de que deseas rechazar esta reserva? Por favor, proporciona una razón.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="reject-notes">Motivo del rechazo *</Label>
                    <Textarea
                      id="reject-notes"
                      placeholder="Explica por qué se rechaza esta reserva..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleReject}>
                      Rechazar Reserva
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          {canCancel && (
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-orange-600 border-orange-200">
                  <Ban className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancelar Reserva</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que deseas cancelar esta reserva?
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="cancel-notes">Motivo de la cancelación (opcional)</Label>
                  <Textarea
                    id="cancel-notes"
                    placeholder="Explica por qué se cancela esta reserva..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                    No cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleCancelReservation}>
                    Sí, cancelar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Área Común
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{reservation.common_area.name}</h3>
              <p className="text-muted-foreground">{reservation.common_area.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Capacidad: {reservation.common_area.capacity || 'Sin límite'}</span>
                <span>•</span>
                <span>{formatCurrency(reservation.common_area.cost_per_hour)}/hora</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Solicitante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold">{reservation.user.first_name} {reservation.user.last_name}</h3>
              <p className="text-muted-foreground">{reservation.user.email}</p>
              <p className="text-sm text-muted-foreground">
                Rol: {reservation.user.role}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles de la reserva */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalles de la Reserva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Fecha</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(reservation.reservation_date)}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Horario</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Asistentes</Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{reservation.estimated_attendees} persona(s)</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Duración</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{reservation.total_hours} hora(s)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Propósito */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Propósito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{reservation.purpose}</p>
        </CardContent>
      </Card>

      {/* Costos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Información de Costos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Duración:</span>
              <span className="font-medium">{reservation.total_hours} hora(s)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Costo por hora:</span>
              <span className="font-medium">{formatCurrency(reservation.common_area.cost_per_hour)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-base font-semibold">
              <span>Total:</span>
              <span className="text-lg">{formatCurrency(reservation.total_cost)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información administrativa */}
      {(reservation.approved_by || reservation.admin_notes) && (
        <Card>
          <CardHeader>
            <CardTitle>Información Administrativa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reservation.approved_by && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  {reservation.status === 'approved' ? 'Aprobado por:' : 
                   reservation.status === 'rejected' ? 'Rechazado por:' : 'Procesado por:'}
                </Label>
                <p className="text-sm">
                  {reservation.approved_by.first_name} {reservation.approved_by.last_name}
                </p>
              </div>
            )}
            
            {reservation.admin_notes && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Notas:</Label>
                <p className="text-sm leading-relaxed">{reservation.admin_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Creado:</Label>
              <p>{formatDate(reservation.created_at)} a las {formatTime(reservation.created_at)}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Última modificación:</Label>
              <p>{formatDate(reservation.updated_at)} a las {formatTime(reservation.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón cerrar */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  )
}