import { useState } from 'react'
import { format, startOfWeek, addDays, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Reservation } from '@/models'
import { cn } from '@/lib/utils'

interface WeeklyCalendarProps {
  reservations: Reservation[]
  commonArea: any
  selectedSlot: { date: string; time: string } | null
  onSlotSelect: (date: string, time: string) => void
  onDateChange?: (date: Date) => void
}

interface TimeSlot {
  time: string
  isAvailable: boolean
  reservation?: Reservation
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
}

export function WeeklyCalendar({ 
  reservations, 
  commonArea, 
  selectedSlot, 
  onSlotSelect,
  onDateChange 
}: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Generar las fechas de la semana actual
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Lunes como primer día
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Generar horarios de 2 horas (intervalos de 2 horas)
  const generateTimeSlots = () => {
    const slots: string[] = []
    if (!commonArea) return slots

    const startHour = parseInt(commonArea.available_from.split(':')[0])
    const endHour = parseInt(commonArea.available_to.split(':')[0])

    for (let hour = startHour; hour < endHour; hour += 2) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Obtener el estado de un slot específico
  const getSlotStatus = (date: Date, time: string): TimeSlot => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const endTime = `${(parseInt(time.split(':')[0]) + 2).toString().padStart(2, '0')}:00`
    
    // Buscar reservas que coincidan con esta fecha y hora
    // Solo considerar reservas aprobadas y pendientes (no rechazadas ni canceladas)
    const matchingReservation = reservations.find(reservation => {
      const reservationDate = format(parseISO(reservation.reservation_date), 'yyyy-MM-dd')
      const reservationStart = reservation.start_time.slice(0, 5) // HH:MM format
      const reservationEnd = reservation.end_time.slice(0, 5)
      
      return reservationDate === dateStr && 
             reservationStart === time &&
             reservationEnd === endTime &&
             (reservation.status === 'approved' || reservation.status === 'pending') // Solo mostrar aprobadas y pendientes
    })

    if (matchingReservation) {
      return {
        time,
        isAvailable: false,
        reservation: matchingReservation,
        status: matchingReservation.status as any
      }
    }

    // Verificar si está en el pasado
    const now = new Date()
    const slotDateTime = new Date(date)
    slotDateTime.setHours(parseInt(time.split(':')[0]), 0, 0, 0)
    
    return {
      time,
      isAvailable: slotDateTime > now,
      reservation: undefined,
      status: undefined
    }
  }

  // Obtener el color del slot según su estado
  const getSlotColor = (slot: TimeSlot, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-primary text-primary-foreground border-primary ring-2 ring-primary'
    }
    
    if (!slot.isAvailable && !slot.reservation) {
      return 'bg-gray-300 text-gray-600 cursor-not-allowed border-gray-400'
    }
    
    if (slot.reservation) {
      switch (slot.status) {
        case 'approved':
          return 'bg-green-600 text-white border-green-700 cursor-not-allowed font-medium'
        case 'pending':
          return 'bg-blue-600 text-white border-blue-700 cursor-not-allowed font-medium'
        default:
          return 'bg-gray-600 text-white border-gray-700 cursor-not-allowed font-medium'
      }
    }
    
    return 'bg-white hover:bg-blue-100 border-gray-300 cursor-pointer hover:border-blue-400'
  }

  // Navegar entre semanas
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = direction === 'prev' ? subWeeks(currentWeek, 1) : addWeeks(currentWeek, 1)
    setCurrentWeek(newWeek)
    if (onDateChange) {
      onDateChange(newWeek)
    }
  }

  // Verificar si un día está disponible para el área común
  const isDayAvailable = (date: Date) => {
    if (!commonArea) return false
    
    const dayOfWeek = date.getDay()
    const dayMap = {
      1: 'available_monday',
      2: 'available_tuesday', 
      3: 'available_wednesday',
      4: 'available_thursday',
      5: 'available_friday',
      6: 'available_saturday',
      0: 'available_sunday'
    }
    
    return commonArea[dayMap[dayOfWeek as keyof typeof dayMap]]
  }

  const isToday = (date: Date) => isSameDay(date, new Date())

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Seleccionar Fecha y Hora</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium min-w-[140px] text-center">
              {format(weekStart, 'd MMM', { locale: es })} - {format(addDays(weekStart, 6), 'd MMM yyyy', { locale: es })}
            </div>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 border border-blue-700 rounded"></div>
            <span className="text-blue-700 font-medium">Pendiente</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-600 border border-green-700 rounded"></div>
            <span className="text-green-700 font-medium">Aprobada</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 border border-gray-400 rounded"></div>
            <span className="text-gray-600">No disponible</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-8 gap-1 text-sm">
          {/* Header con días de la semana */}
          <div className="p-2 text-center font-medium text-gray-600">Hora</div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-2 text-center">
              <div className={cn(
                "font-medium",
                isToday(day) && "text-primary font-bold"
              )}>
                {format(day, 'EEE', { locale: es })}
              </div>
              <div className={cn(
                "text-xs",
                isToday(day) && "text-primary font-bold"
              )}>
                {format(day, 'd MMM', { locale: es })}
              </div>
              {!isDayAvailable(day) && (
                <Badge variant="secondary" className="text-xs mt-1">
                  Cerrado
                </Badge>
              )}
            </div>
          ))}

          {/* Slots de tiempo */}
          {timeSlots.map((time) => (
            <div key={time} className="contents">
              {/* Columna de tiempo */}
              <div className="p-2 text-center font-medium text-gray-600 bg-gray-50">
                <div>{time}</div>
                <div className="text-xs text-gray-500">
                  {`${(parseInt(time.split(':')[0]) + 2).toString().padStart(2, '0')}:00`}
                </div>
              </div>
              
              {/* Slots para cada día */}
              {weekDays.map((day, dayIndex) => {
                const slot = getSlotStatus(day, time)
                const dateStr = format(day, 'yyyy-MM-dd')
                const isSelected = selectedSlot?.date === dateStr && selectedSlot?.time === time
                const isDayOpen = isDayAvailable(day)
                
                return (
                  <div
                    key={`${dayIndex}-${time}`}
                    className={cn(
                      "p-2 border rounded text-center text-xs transition-colors",
                      getSlotColor(slot, isSelected),
                      !isDayOpen && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => {
                      if (slot.isAvailable && isDayOpen && !slot.reservation) {
                        onSlotSelect(dateStr, time)
                      }
                    }}
                  >
                    {slot.reservation ? (
                      <div>
                        <div className="font-medium truncate">
                          {slot.reservation.user.first_name} {slot.reservation.user.last_name}
                        </div>
                        <div className="truncate">
                          {slot.reservation.purpose}
                        </div>
                      </div>
                    ) : slot.isAvailable && isDayOpen ? (
                      <div className="text-gray-500">Libre</div>
                    ) : (
                      <div className="text-gray-400">-</div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}