import { type ApiBase } from '@/models'
import { type House } from './house.model'

export interface HouseUser extends ApiBase {
  house: House
  house_id: string
  user: any // Referencia al usuario
  user_id: string
  type_house: 'OWNER' | 'RESIDENT'
  type_house_display: string
  is_principal: boolean
  price_responsibility?: string | null
  inicial_date: string
  end_date?: string
}

export interface CreateHouseUser extends Partial<Omit<HouseUser, 'id' | 'created_at' | 'updated_at' | 'house' | 'user' | 'type_house_display'>> {
  house_id: string
  user_id: string
  type_house: 'OWNER' | 'RESIDENT'
  is_principal: boolean
  price_responsibility?: string | null
  inicial_date: string
  end_date?: string
}

export interface FormHouseUser extends Partial<HouseUser> {
  // Campos específicos para formularios
}

export interface UpdateHouseUser extends CreateHouseUser {
  id: string
}