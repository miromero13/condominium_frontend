import { type ApiBase } from '@/models'

export interface User extends ApiBase {
  ci: number
  name: string
  phone: number
  email: string
  password: string
  role: string
  is_active: boolean
}

export interface CreateUser extends Partial<Omit<User, 'password'>> {
  password: string
}

export interface FormUser extends Partial<Omit<User, 'password'>> {
  password: string
}

export interface UpdateUser extends CreateUser { }
