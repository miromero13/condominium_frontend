import { useCreateResource, useGetAllResource, useGetResource, useUpdateResource, useDeleteResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type CreateVehicle, type UpdateVehicle, type FormVehicle, type Vehicle } from '../models/vehicle.model'

const useCreateVehicle = () => {
  return useCreateResource<CreateVehicle>({ endpoint: ENDPOINTS.VEHICLE })
}

const useGetVehicle = (id?: string) => {
  return useGetResource<FormVehicle>({ endpoint: ENDPOINTS.VEHICLE, id })
}

const useGetAllVehicles = () => {
  return useGetAllResource<Vehicle>({ endpoint: ENDPOINTS.VEHICLE, isPagination: true })
}

const useGetVehiclesByProperty = (propertyId?: string) => {
  return useGetAllResource<Vehicle>({ 
    endpoint: ENDPOINTS.VEHICLE, 
    isPagination: true,
    query: propertyId ? `property=${propertyId}` : undefined
  })
}

const useUpdateVehicle = () => {
  return useUpdateResource<UpdateVehicle>(ENDPOINTS.VEHICLE)
}

const useDeleteVehicle = () => {
  return useDeleteResource(ENDPOINTS.VEHICLE)
}

export { 
  useCreateVehicle, 
  useGetAllVehicles, 
  useGetVehiclesByProperty,
  useGetVehicle, 
  useUpdateVehicle, 
  useDeleteVehicle 
}