import { fetchData } from '@/utils'
import { type Vehicle, type PlateDetectionRequest, type PlateDetectionResponse, type AccessHistory, type SecurityStats, type CreateAccessHistory } from '../models/security.model'
import { type ApiResponse } from '@/models'

const detectPlate = async (url: string, { arg }: { arg: PlateDetectionRequest }): Promise<PlateDetectionResponse> => {
  let body: FormData | string

  if (arg.source === 'camera') {
    // Para cámara enviamos base64 como JSON
    body = JSON.stringify({
      image_base64: arg.image,
      source: arg.source
    })
  } else {
    // Para upload creamos FormData
    const formData = new FormData()
    formData.append('image', arg.image as File)
    formData.append('source', arg.source)
    body = formData
  }

  const options: RequestInit = {
    method: 'POST',
    body,
    // No agregar Content-Type para FormData, el browser lo hace automáticamente
    ...(arg.source === 'camera' && {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const response = await fetchData(url, options)
  return response.data
}

const getAllVehicles = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as Vehicle[], countData: response.countData }
}

const getVehicle = async (url: string): Promise<Vehicle> => {
  const response = await fetchData(url)
  return response.data
}

const getAllAccessHistory = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as AccessHistory[], countData: response.countData }
}

const createAccessHistory = async (url: string, { arg }: { arg: CreateAccessHistory }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  await fetchData(url, options)
}

const getSecurityStats = async (url: string): Promise<SecurityStats> => {
  const response = await fetchData(url)
  return response.data
}

export { 
  detectPlate, 
  getAllVehicles, 
  getVehicle, 
  getAllAccessHistory, 
  createAccessHistory,
  getSecurityStats 
}