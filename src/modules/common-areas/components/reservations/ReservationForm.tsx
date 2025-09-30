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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { DollarSign } from 'lucide-react'
import { useGetAllResource, useCreateResource, useUpdateResource } from '@/hooks/useApiResource'
import { ENDPOINTS, buildUrl, API_BASEURL } from '@/utils'
import { CreateReservationRequest, UpdateReservationRequest, Reservation } from '@/models'
import { User } from '@/modules/users/models/user.model'
import { Resident } from '@/modules/residents/models/resident.model'
import { CommonArea } from '../../models/common-area.model'
import { formatCurrency } from '@/lib/utils'
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

  // Obtener lista de usuarios administradores
  const { allResource: users = [] } = useGetAllResource<User>({ 
    endpoint: ENDPOINTS.USER, 
    isPagination: false 
  })

  // Obtener lista de residentes (propietarios y residentes)
  const { allResource: residents = [] } = useGetAllResource<Resident>({ 
    endpoint: ENDPOINTS.RESIDENT, 
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
      reservation_date: reservation?.reservation_date || '',
      start_time: reservation?.start_time || '',
      end_time: reservation?.end_time || '',
      purpose: reservation?.purpose || '',
      estimated_attendees: reservation?.estimated_attendees || 1,
    },
  })

  const watchedFields = watch()

  // Filtrar solo áreas comunes activas y reservables
  const availableAreas = commonAreas.filter(area => area.is_active && area.is_reservable)

  // Combinar usuarios y residentes en una sola lista
  const allAvailableUsers = [
    // Administradores del endpoint /users/
    ...users.filter(user => user.role === 'administrator'),
    // Propietarios y residentes del endpoint /residents/
    ...residents.filter(resident => ['owner', 'resident'].includes(resident.role))
  ]

  // Mapear a un formato común para el selector
  const availableUsers = allAvailableUsers.map(user => ({
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email
  }))

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
      const startHour = parseInt(watchedFields.start_time.split(':')[0])
      const endHour = parseInt(watchedFields.end_time.split(':')[0])
      
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

  // Inicializar selectedSlot si estamos editando
  useEffect(() => {
    if (reservation && !selectedSlot) {
      setSelectedSlot({
        date: reservation.reservation_date,
        time: reservation.start_time
      })
    }
  }, [reservation, selectedSlot])

  const onSubmit = async (data: ReservationFormData) => {
    try {
      const requestData = {
        ...data,
        estimated_attendees: Number(data.estimated_attendees)
      }

      if (isEditing) {
        await updateResource(requestData)
        toast.success('Reserva actualizada exitosamente')
      } else {
        await createResource(requestData)
        toast.success('Reserva creada exitosamente')
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la reserva')
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  <div>
                    <div className="font-medium">
                      {user.name}
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

        {/* Calendario Semanal */}
        {selectedArea && (
          <div className="space-y-2">
            <WeeklyCalendar
              reservations={existingReservations}
              commonArea={selectedArea}
              selectedSlot={selectedSlot}
              onSlotSelect={(date, time) => {
                setSelectedSlot({ date, time })
                setValue('reservation_date', date)
                setValue('start_time', time)
                // Calcular automáticamente la hora de fin (2 horas después)
                const startHour = parseInt(time.split(':')[0])
                const endTime = `${(startHour + 2).toString().padStart(2, '0')}:00`
                setValue('end_time', endTime)
              }}
            />
            {errors.reservation_date && (
              <p className="text-sm text-red-600">{errors.reservation_date.message}</p>
            )}
            {errors.start_time && (
              <p className="text-sm text-red-600">{errors.start_time.message}</p>
            )}
            {errors.end_time && (
              <p className="text-sm text-red-600">{errors.end_time.message}</p>
            )}
          </div>
        )}

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

        {/* Resumen de costos */}
        {estimatedCost > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumen de Costos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Duración:</span>
                  <span>{estimatedHours} hora(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Costo por hora:</span>
                  <span>{formatCurrency(selectedArea?.cost_per_hour || 0)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-2">
                  <span>Total estimado:</span>
                  <span>{formatCurrency(estimatedCost)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Crear Reserva')}
          </Button>
        </div>
      </form>
    </div>
  )
}