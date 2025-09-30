import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Users, DollarSign } from 'lucide-react'
import { useGetAllResource, useCreateResource, useUpdateResource } from '@/hooks/useApiResource'
import { ENDPOINTS, buildUrl, API_BASEURL } from '@/utils'
import { CreateReservationRequest, UpdateReservationRequest, Reservation } from '@/models'
import { User } from '@/modules/users/models/user.model'
import { CommonArea } from '../../models/common-area.model'
import { formatTime, formatCurrency, cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { WeeklyCalendar } from './WeeklyCalendar'

const reservationSchema = z.object({
  common_area_id: z.string().min(1, 'Selecciona un área común'),
  user_id: z.string().min(1, 'Selecciona un usuario'),
  reservation_date: z.string().min(1, 'Selecciona una fecha'),
  start_time: z.string().min(1, 'Selecciona la hora de inicio'),
  end_time: z.string().min(1, 'Selecciona la hora de fin'),
  purpose: z.string().min(1, 'Describe el propósito de la reserva'),
  estimated_attendees: z.number().min(1, 'Debe haber al menos 1 asistente'),
})

type ReservationFormData = z.infer<typeof reservationSchema>

interface ReservationFormProps {
  reservation?: Reservation
  commonAreaId?: string
  commonArea?: CommonArea
  onSuccess: () => void
  onCancel: () => void
}

export function ReservationForm({ reservation, commonAreaId, commonArea, onSuccess, onCancel }: ReservationFormProps) {
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null)
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [estimatedHours, setEstimatedHours] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null)

  const isEditing = !!reservation

  const { allResource: commonAreas = [] } = useGetAllResource<CommonArea>({ 
    endpoint: ENDPOINTS.COMMON_AREA, 
    isPagination: false 
  })

  // Obtener lista de usuarios (administradores, propietarios, residentes)
  const { allResource: users = [] } = useGetAllResource<User>({ 
    endpoint: ENDPOINTS.USER, 
    isPagination: false 
  })

  const { createResource, isMutating: isCreating } = useCreateResource<CreateReservationRequest>({ 
    endpoint: ENDPOINTS.RESERVATION 
  })

  const { updateResource, isMutating: isUpdating } = useUpdateResource<UpdateReservationRequest>(
    ENDPOINTS.RESERVATION, 
    reservation?.id
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      common_area_id: commonAreaId || commonArea?.id || reservation?.common_area.id || '',
      user_id: reservation?.user.id || '',
      reservation_date: reservation ? format(new Date(reservation.reservation_date), 'yyyy-MM-dd') : '',
      start_time: reservation?.start_time || '',
      end_time: reservation?.end_time || '',
      purpose: reservation?.purpose || '',
      estimated_attendees: reservation?.estimated_attendees || 1,
    },
  })

  const watchedFields = watch()

  // Filtrar solo áreas comunes activas y reservables
  const availableAreas = commonAreas.filter(area => area.is_active && area.is_reservable)

  // Filtrar usuarios por roles permitidos (administrator, owner, resident)
  const availableUsers = users.filter(user => 
    ['administrator', 'owner', 'resident'].includes(user.role)
  )

  // Fetcher function for useSWR
  const apiCall = async (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASEURL}${url}`
    const token = localStorage.getItem('token')
    
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

  // Obtener reservas existentes para mostrar en el calendario
  const buildReservationsUrl = () => {
    const params = new URLSearchParams()
    if (selectedArea?.id) {
      params.append('common_area_id', selectedArea.id)
    }
    return buildUrl({ endpoint: ENDPOINTS.RESERVATION, query: params.toString() })
  }

  const { data: reservationsData } = useSWR(
    selectedArea ? buildReservationsUrl() : null,
    apiCall
  )
  
  const existingReservations: Reservation[] = reservationsData?.data || []

  // Establecer el área común automáticamente si se pasa como prop
  useEffect(() => {
    if (commonArea && !watchedFields.common_area_id) {
      setValue('common_area_id', commonArea.id)
    }
  }, [commonArea, setValue, watchedFields.common_area_id])

  // Encontrar el área seleccionada
  useEffect(() => {
    if (commonArea) {
      // Si se pasa commonArea como prop, usarlo directamente
      setSelectedArea(commonArea)
    } else if (watchedFields.common_area_id) {
      // Si no, buscar en la lista de áreas disponibles
      const area = availableAreas.find(a => a.id === watchedFields.common_area_id)
      setSelectedArea(area || null)
    }
  }, [commonArea, watchedFields.common_area_id, availableAreas])

  // Calcular costo estimado
  useEffect(() => {
    if (selectedArea && watchedFields.start_time && watchedFields.end_time) {
      const startHour = parseFloat(watchedFields.start_time.replace(':', '.'))
      const endHour = parseFloat(watchedFields.end_time.replace(':', '.'))
      
      if (endHour > startHour) {
        const hours = endHour - startHour
        const cost = hours * selectedArea.cost_per_hour
        setEstimatedHours(hours)
        setEstimatedCost(cost)
      } else {
        setEstimatedHours(0)
        setEstimatedCost(0)
      }
    }
  }, [selectedArea, watchedFields.start_time, watchedFields.end_time])

  // Limpiar hora de fin si no es válida cuando cambia la hora de inicio
  useEffect(() => {
    if (watchedFields.start_time && watchedFields.end_time) {
      const startHour = parseInt(watchedFields.start_time.split(':')[0])
      const endHour = parseInt(watchedFields.end_time.split(':')[0])
      
      if (endHour <= startHour) {
        setValue('end_time', '')
      }
    }
  }, [watchedFields.start_time, watchedFields.end_time, setValue])

  // Generar opciones de tiempo (intervalos de 2 horas) basado en el área seleccionada
  const generateTimeOptions = () => {
    if (!selectedArea) {
      // Si no hay área seleccionada, usar horario por defecto
      const options = []
      for (let hour = 6; hour <= 22; hour += 2) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`
        options.push(timeString)
      }
      return options
    }

    // Usar horarios del área específica
    const startHour = parseInt(selectedArea.available_from.split(':')[0])
    const endHour = parseInt(selectedArea.available_to.split(':')[0])
    
    const options = []
    for (let hour = startHour; hour <= endHour; hour += 2) {
      if (hour <= endHour) { // Asegurar que no exceda el horario de cierre
        const timeString = `${hour.toString().padStart(2, '0')}:00`
        options.push(timeString)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  // Validar si un día está disponible para el área común
  const isDateAvailable = (date: Date) => {
    if (!selectedArea) return true
    
    const dayOfWeek = date.getDay() // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const dayMap = {
      0: selectedArea.available_sunday,
      1: selectedArea.available_monday,
      2: selectedArea.available_tuesday,
      3: selectedArea.available_wednesday,
      4: selectedArea.available_thursday,
      5: selectedArea.available_friday,
      6: selectedArea.available_saturday,
    }
    
    return dayMap[dayOfWeek as keyof typeof dayMap] || false
  }

  // Filtrar opciones de hora de fin (debe ser posterior a la hora de inicio)
  const getEndTimeOptions = () => {
    if (!watchedFields.start_time) return timeOptions
    
    const startHour = parseInt(watchedFields.start_time.split(':')[0])
    return timeOptions.filter(time => {
      const hour = parseInt(time.split(':')[0])
      return hour > startHour
    })
  }

  const onSubmit = async (data: ReservationFormData) => {
    try {
      const formattedData = {
        ...data,
        reservation_date: format(data.reservation_date, 'yyyy-MM-dd'),
      }

      if (isEditing) {
        await updateResource(formattedData)
        toast.success('Reserva actualizada exitosamente')
      } else {
        await createResource(formattedData)
        toast.success('Reserva creada exitosamente')
      }
      
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la reserva')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información del área común cuando se especifica */}
      {(commonArea || (selectedArea && (commonAreaId || commonArea))) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {selectedArea?.name || commonArea?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Horario:</span>
                <div>{formatTime((selectedArea || commonArea)?.available_from || '')} - {formatTime((selectedArea || commonArea)?.available_to || '')}</div>
              </div>
              <div>
                <span className="font-medium">Capacidad:</span>
                <div>{(selectedArea || commonArea)?.capacity || 'Sin límite'}</div>
              </div>
              <div>
                <span className="font-medium">Costo:</span>
                <div>{formatCurrency((selectedArea || commonArea)?.cost_per_hour || 0)}/hora</div>
              </div>
              <div>
                <span className="font-medium">Días disponibles:</span>
                <div className="text-xs">
                  {[
                    (selectedArea || commonArea)?.available_monday && 'L',
                    (selectedArea || commonArea)?.available_tuesday && 'M',
                    (selectedArea || commonArea)?.available_wednesday && 'X',
                    (selectedArea || commonArea)?.available_thursday && 'J',
                    (selectedArea || commonArea)?.available_friday && 'V',
                    (selectedArea || commonArea)?.available_saturday && 'S',
                    (selectedArea || commonArea)?.available_sunday && 'D'
                  ].filter(Boolean).join('-')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Área común */}
        <div className="space-y-2">
          <Label htmlFor="common_area_id">Área Común *</Label>
          <Select
            value={watchedFields.common_area_id}
            onValueChange={(value) => setValue('common_area_id', value)}
            disabled={!!commonAreaId || !!commonArea || isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un área común" />
            </SelectTrigger>
            <SelectContent>
              {availableAreas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  <div>
                    <div className="font-medium">{area.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(area.cost_per_hour)}/hora
                      {area.capacity && ` • Capacidad: ${area.capacity}`}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.common_area_id && (
            <p className="text-sm text-red-600">{errors.common_area_id.message}</p>
          )}
        </div>

        {/* Usuario */}
        <div className="space-y-2">
          <Label htmlFor="user_id">Usuario Solicitante *</Label>
          <Select
            value={watchedFields.user_id}
            onValueChange={(value) => setValue('user_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un usuario" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div>
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email} • {user.role}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.user_id && (
            <p className="text-sm text-red-600">{errors.user_id.message}</p>
          )}
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <Label>Fecha de Reserva *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !watchedFields.reservation_date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watchedFields.reservation_date ? (
                  format(watchedFields.reservation_date, 'PPP', { locale: es })
                ) : (
                  'Seleccionar fecha'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={watchedFields.reservation_date}
                onSelect={(date) => setValue('reservation_date', date!)}
                disabled={(date) => {
                  // No permitir fechas pasadas
                  if (date < new Date()) return true
                  // Validar días disponibles del área común
                  if (selectedArea && !isDateAvailable(date)) return true
                  return false
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.reservation_date && (
            <p className="text-sm text-red-600">{errors.reservation_date.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Usuario */}
        <div className="space-y-2">
          <Label htmlFor="user_id">Usuario *</Label>
          <Select
            value={watchedFields.user_id}
            onValueChange={(value) => setValue('user_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar usuario" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.user_id && (
            <p className="text-sm text-red-600">{errors.user_id.message}</p>
          )}
        </div>

        {/* Hora de inicio */}
        <div className="space-y-2">
          <Label htmlFor="start_time">Hora de Inicio *</Label>
          <Select
            value={watchedFields.start_time}
            onValueChange={(value) => setValue('start_time', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar hora" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {formatTime(time)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.start_time && (
            <p className="text-sm text-red-600">{errors.start_time.message}</p>
          )}
        </div>

        {/* Hora de fin */}
        <div className="space-y-2">
          <Label htmlFor="end_time">Hora de Fin *</Label>
          <Select
            value={watchedFields.end_time}
            onValueChange={(value) => setValue('end_time', value)}
            disabled={!watchedFields.start_time}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar hora" />
            </SelectTrigger>
            <SelectContent>
              {getEndTimeOptions().map((time) => (
                <SelectItem key={time} value={time}>
                  {formatTime(time)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.end_time && (
            <p className="text-sm text-red-600">{errors.end_time.message}</p>
          )}
        </div>

        {/* Número de asistentes */}
        <div className="space-y-2">
          <Label htmlFor="estimated_attendees">Número de Asistentes *</Label>
          <Input
            id="estimated_attendees"
            type="number"
            min="1"
            max={selectedArea?.capacity || 999}
            {...register('estimated_attendees', { valueAsNumber: true })}
          />
          {errors.estimated_attendees && (
            <p className="text-sm text-red-600">{errors.estimated_attendees.message}</p>
          )}
          {selectedArea?.capacity && watchedFields.estimated_attendees > selectedArea.capacity && (
            <p className="text-sm text-orange-600">
              Excede la capacidad máxima ({selectedArea.capacity})
            </p>
          )}
        </div>
      </div>

      {/* Propósito */}
      <div className="space-y-2">
        <Label htmlFor="purpose">Propósito de la Reserva *</Label>
        <Textarea
          id="purpose"
          placeholder="Describe el propósito o evento para el cual necesitas el área común..."
          rows={3}
          {...register('purpose')}
        />
        {errors.purpose && (
          <p className="text-sm text-red-600">{errors.purpose.message}</p>
        )}
      </div>

      {/* Información del área seleccionada */}
      {selectedArea && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Área</CardTitle>
            <CardDescription>{selectedArea.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Capacidad: {selectedArea.capacity || 'Sin límite'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  Horario: {formatTime(selectedArea.available_from)} - {formatTime(selectedArea.available_to)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Costo: {formatCurrency(selectedArea.cost_per_hour)}/hora</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen de costos */}
      {estimatedHours > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Duración:</span>
                <span className="font-medium">{estimatedHours} hora(s)</span>
              </div>
              <div className="flex justify-between">
                <span>Costo por hora:</span>
                <span className="font-medium">{formatCurrency(selectedArea?.cost_per_hour || 0)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-base font-semibold">
                <span>Total Estimado:</span>
                <span>{formatCurrency(estimatedCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? 'Procesando...' : isEditing ? 'Actualizar' : 'Crear'} Reserva
        </Button>
      </div>
    </form>
  )
}