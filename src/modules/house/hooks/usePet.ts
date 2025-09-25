import useSWRMutation from 'swr/mutation'
import { createPet, deletePet, getPet, getAllPets, updatePet } from '../services/pet.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type FormPet, type CreatePet, type UpdatePet } from '../models/pet.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreatePet = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreatePet>(API_BASEURL + ENDPOINTS.PET, createPet)
  return { createPet: trigger, isMutating, error }
}

const useGetPet = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<FormPet, ResponseError>(id ? `${API_BASEURL}${ENDPOINTS.PET}${id}/` : null, getPet)
  return { pet: data, isLoading, error, isValidating }
}

const useGetAllPets = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.PET}?${queryParams}`, getAllPets)
  return { allPets: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

const useUpdatePet = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdatePet>(API_BASEURL + ENDPOINTS.PET, updatePet)
  return { updatePet: trigger, isMutating, error }
}

const useDeletePet = () => {
  const { trigger, error, isMutating } = useSWRMutation<Promise<void>, ResponseError, string, string>(API_BASEURL + ENDPOINTS.PET, deletePet)
  return { deletePet: trigger, error, isMutating }
}

export { useCreatePet, useGetAllPets, useGetPet, useUpdatePet, useDeletePet }