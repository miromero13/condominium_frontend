import { type ApiBase } from '@/models'
import { type User } from '@/modules/users/models/user.model'

export interface Property extends ApiBase {
  name: string
  address: string
  description?: string
  
  // Identificación específica
  building_or_block?: string
  property_number: string
  
  // Características físicas
  bedrooms: number
  bathrooms: number
  square_meters?: number
  has_garage: boolean
  garage_spaces: number
  has_yard: boolean
  has_balcony: boolean
  has_terrace: boolean
  floor_number?: number
  has_elevator: boolean
  furnished: boolean
  pets_allowed: boolean
  
  // Sistema de pagos
  status: string
  monthly_payment: number
  payment_frequency: string
  payment_due_day: number
  is_payment_enabled: boolean
  
  // Relaciones con usuarios
  owners: User[]
  residents: User[]
  visitors: User[]
}

export interface CreateProperty extends Partial<Omit<Property, 'id' | 'created_at' | 'updated_at' | 'owners' | 'residents' | 'visitors'>> {
  name: string
  address: string
  property_number: string
  bedrooms?: number
  bathrooms?: number
  monthly_payment?: number
  owners?: string[]
  residents?: string[]
  visitors?: string[]
}

export interface FormProperty extends Partial<Omit<Property, 'owners' | 'residents' | 'visitors'>> {
  owners?: string[]
  residents?: string[]
  visitors?: string[]
}

export interface UpdateProperty extends CreateProperty {
  id: string
}

// Enums para los selects
export enum PropertyStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  SOLD = 'sold',
  OWNED_AND_RENTED = 'owned_and_rented',
  UNDER_CONSTRUCTION = 'under_construction',
  MAINTENANCE = 'maintenance'
}

export enum PaymentFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUAL = 'biannual',
  ANNUAL = 'annual'
}