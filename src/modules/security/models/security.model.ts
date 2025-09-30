import { type ApiBase } from '@/models'

export interface Vehicle extends ApiBase {
  plate: string
  brand: string
  model: string
  color: string
  type_vehicle: 'AUTO' | 'MOTOCICLETA' | 'CAMIONETA' | 'BICICLETA'
  property: string
  property_name?: string
}

export interface PlateDetectionRequest {
  image: File | string  // File para upload, string para base64 de cámara
  source: 'camera' | 'upload'
}

export interface PlateDetectionResponse {
  plate_detected: string | null
  confidence: number
  authorized_vehicle: boolean
  message: string
  processing_time: number
  vehicle_info?: Vehicle
}

export interface AccessHistory extends ApiBase {
  plate_detected: string
  access_date: string
  access_type: 'ENTRADA' | 'SALIDA' | 'DENEGADO'
  confidence: number
  authorized_vehicle: boolean
  image_url?: string
  vehicle?: Vehicle
}

export interface CreateAccessHistory extends Partial<Omit<AccessHistory, 'id' | 'created_at' | 'updated_at'>> {
  plate_detected: string
  access_date: string
  access_type: 'ENTRADA' | 'SALIDA' | 'DENEGADO'
  confidence: number
}

export interface SecurityStats {
  total_vehicles: number
  active_vehicles: number
  access_today: number
  denied_access_today: number
  last_detection?: AccessHistory
}