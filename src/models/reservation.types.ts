import { User } from '../modules/users/models/user.model'
import { CommonArea } from '../modules/common-areas/models/common-area.model'

export interface Reservation {
  id: string
  common_area: CommonArea
  user: User
  reservation_date: string
  start_time: string
  end_time: string
  purpose: string
  estimated_attendees: number
  status: ReservationStatus
  status_display: string
  approved_by?: User
  total_hours: number
  total_cost: number
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface CreateReservationRequest {
  common_area_id: string
  reservation_date: string
  start_time: string
  end_time: string
  purpose: string
  estimated_attendees: number
}

export interface UpdateReservationRequest extends Partial<CreateReservationRequest> {}

export interface ReservationListParams {
  status?: ReservationStatus
  common_area_id?: string
  my_reservations?: boolean
  limit?: number
  offset?: number
  order?: string
  attr?: string
  value?: string
}

export interface ApproveRejectReservationRequest {
  admin_notes?: string
}

export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'

export const ReservationStatusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'completed', label: 'Completada' },
] as const

export const getStatusColor = (status: ReservationStatus): string => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
  }
  return statusColors[status] || statusColors.pending
}