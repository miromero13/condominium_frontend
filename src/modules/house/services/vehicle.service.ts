import { fetchData } from '@/utils'
import { type Vehicle, type CreateVehicle, type UpdateVehicle } from '../models/vehicle.model'
import { ApiResponse } from '@/models'

const createVehicle = async (url: string, { arg }: { arg: CreateVehicle }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getVehicle = async (url: string): Promise<Vehicle> => {
  const response = await fetchData(url)
  return response.data
}

const updateVehicle = async (url: string, { arg }: { arg: UpdateVehicle }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify({
      house_id: arg?.house_id,
      plate: arg?.plate,
      brand: arg?.brand,
      model: arg?.model,
      color: arg?.color,
      type_vehicle: arg?.type_vehicle,
    })
  }
  await fetchData(`${url}${arg.id}/`, options)
}

const getAllVehicles = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as Vehicle[], countData: response.countData }
}

const deleteVehicle = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}${id}/`, options)
}

export { createVehicle, getAllVehicles, getVehicle, updateVehicle, deleteVehicle }