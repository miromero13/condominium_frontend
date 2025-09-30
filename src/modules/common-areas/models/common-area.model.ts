import { type ApiBase } from '@/models/api-base'

export interface CommonArea extends ApiBase {
  name: string
  description: string
  capacity: number
  cost_per_hour: number
  is_reservable: boolean
  is_active: boolean
  available_from: string
  available_to: string
  available_monday: boolean
  available_tuesday: boolean
  available_wednesday: boolean
  available_thursday: boolean
  available_friday: boolean
  available_saturday: boolean
  available_sunday: boolean
}

export interface CreateCommonArea extends Partial<Omit<CommonArea, 'id' | 'created_at' | 'updated_at'>> {
  name: string
  description: string
  capacity?: number
  cost_per_hour?: number
  is_reservable?: boolean
  is_active?: boolean
  available_from?: string
  available_to?: string
  available_monday?: boolean
  available_tuesday?: boolean
  available_wednesday?: boolean
  available_thursday?: boolean
  available_friday?: boolean
  available_saturday?: boolean
  available_sunday?: boolean
}

export interface FormCommonArea extends Partial<CommonArea> {
  // Campos específicos para formularios
}

export interface UpdateCommonArea extends CreateCommonArea {
  id: string // requerido para update
}