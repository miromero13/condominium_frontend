import { type ApiBase } from '@/models'
import { type House } from './house.model'

export interface Vehicle extends ApiBase {
  house: House
  house_id: string
  plate: string
  brand: string
  model: string
  color: string
  type_vehicle: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'PICKUP' | 'MOTORCYCLE' | 'TRUCK' | 'VAN'
  type_vehicle_display: string
}

export interface CreateVehicle extends Partial<Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'house' | 'type_vehicle_display'>> {
  house_id: string
  plate: string
  brand: string
  model: string
  color: string
  type_vehicle: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'PICKUP' | 'MOTORCYCLE' | 'TRUCK' | 'VAN'
}

export interface FormVehicle extends Partial<Vehicle> {
  // Campos específicos para formularios
}

export interface UpdateVehicle extends CreateVehicle {
  id: string
}