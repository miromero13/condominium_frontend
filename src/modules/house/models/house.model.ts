import { type ApiBase } from '@/models'

export interface House extends ApiBase {
  code: string
  area: string
  nro_rooms: number
  nro_bathrooms: number
  price_base: string
  foto_url?: string
}

export interface CreateHouse extends Partial<Omit<House, 'id' | 'created_at' | 'updated_at'>> {
}

export interface FormHouse extends Partial<Omit<House, 'id' | 'created_at' | 'updated_at'>> {
}

export interface UpdateHouse extends CreateHouse {
  id: string
}
