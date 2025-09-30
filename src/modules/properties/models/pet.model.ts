import { type ApiBase } from '@/models'

export interface Pet extends ApiBase {
  property: string
  name: string
  species: string
  breed?: string
}

export interface CreatePet extends Partial<Omit<Pet, 'id' | 'created_at' | 'updated_at'>> {
  property: string
  name: string
  species: string
  breed?: string
}

export interface FormPet extends Partial<Pet> {
  property: string
  name: string
  species: string
  breed?: string
}

export interface UpdatePet extends CreatePet { }