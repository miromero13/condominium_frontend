import { useCreateResource, useGetAllResource, useGetResource, useUpdateResource, useDeleteResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type CreatePet, type UpdatePet, type FormPet, type Pet } from '../models/pet.model'

const useCreatePet = () => {
  return useCreateResource<CreatePet>({ endpoint: ENDPOINTS.PET })
}

const useGetPet = (id?: string) => {
  return useGetResource<FormPet>({ endpoint: ENDPOINTS.PET, id })
}

const useGetAllPets = () => {
  return useGetAllResource<Pet>({ endpoint: ENDPOINTS.PET, isPagination: true })
}

const useGetPetsByProperty = (propertyId?: string) => {
  return useGetAllResource<Pet>({ 
    endpoint: ENDPOINTS.PET, 
    isPagination: true,
    query: propertyId ? `property=${propertyId}` : undefined
  })
}

const useUpdatePet = () => {
  return useUpdateResource<UpdatePet>(ENDPOINTS.PET)
}

const useDeletePet = () => {
  return useDeleteResource(ENDPOINTS.PET)
}

export { 
  useCreatePet, 
  useGetAllPets, 
  useGetPetsByProperty,
  useGetPet, 
  useUpdatePet, 
  useDeletePet 
}