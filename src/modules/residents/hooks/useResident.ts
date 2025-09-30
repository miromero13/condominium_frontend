import { useCreateResource, useGetAllResource, useGetResource, useUpdateResource, useDeleteResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type CreateResident, type UpdateResident, type FormResident, type Resident } from '../models/resident.model'

const useCreateResident = () => {
  return useCreateResource<CreateResident>({ endpoint: ENDPOINTS.RESIDENT })
}

const useGetResident = (id?: string) => {
  return useGetResource<FormResident>({ endpoint: ENDPOINTS.RESIDENT, id })
}

const useGetAllResident = () => {
  return useGetAllResource<Resident>({ endpoint: ENDPOINTS.RESIDENT, isPagination: true })
}

const useUpdateResident = () => {
  return useUpdateResource<UpdateResident>(ENDPOINTS.RESIDENT)
}

const useDeleteResident = () => {
  return useDeleteResource(ENDPOINTS.RESIDENT)
}

export { 
  useCreateResident, 
  useGetAllResident, 
  useGetResident, 
  useUpdateResident, 
  useDeleteResident 
}