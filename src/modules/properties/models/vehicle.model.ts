import { type ApiBase } from '@/models'

export interface Vehicle extends ApiBase {
  property: string
  plate: string
  brand: string
  model: string
  color: string
  type_vehicle: string
}

export interface CreateVehicle extends Partial<Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>> {
  property: string
  plate: string
  brand: string
  model: string
  color: string
  type_vehicle: string
}

export interface FormVehicle extends Partial<Vehicle> {
  property: string
  plate: string
  brand: string
  model: string
  color: string
  type_vehicle: string
}

export interface UpdateVehicle extends CreateVehicle { }