import { type ApiBase } from '@/models'

export interface User extends ApiBase {
  ci: number
  name: string
  phone: string
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

export interface UpdateUser extends Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>> {
  id: string
}
