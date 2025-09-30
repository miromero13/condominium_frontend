import { type ApiBase } from '@/models'

export interface Resident extends ApiBase {
  ci: string
  name: string
  phone: string
  email: string
  password?: string
  role: string
  is_active: boolean
  app_enabled: boolean
  email_verified?: boolean
}

export interface CreateResident extends Partial<Omit<Resident, 'password'>> {
  password?: string
}

export interface FormResident extends Partial<Omit<Resident, 'password'>> {
  password?: string
}

export interface UpdateResident extends CreateResident { }