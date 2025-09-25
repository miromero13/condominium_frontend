import { type ApiBase } from '@/models'
import { type House } from './house.model'

export interface Pet extends ApiBase {
  house: House
  house_id: string
  name: string
  species: string
  breed?: string
}

export interface CreatePet extends Partial<Omit<Pet, 'id' | 'created_at' | 'updated_at' | 'house'>> {
  house_id: string
  name: string
  species: string
  breed?: string
}

export interface FormPet extends Partial<Pet> {
  // Campos específicos para formularios
}

export interface UpdatePet extends CreatePet {
  id: string
}