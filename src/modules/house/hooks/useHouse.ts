import useSWRMutation from 'swr/mutation'
import { createHouse, deleteHouse, getHouse, getAllHouses, updateHouse } from '../services/house.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type FormHouse, type CreateHouse, type UpdateHouse } from '../models/house.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateHouse = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateHouse>(API_BASEURL + ENDPOINTS.HOUSE, createHouse)
  return { createHouse: trigger, isMutating, error }
}

const useGetHouse = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<FormHouse, ResponseError>(id ? `${API_BASEURL}${ENDPOINTS.HOUSE}${id}/` : null, getHouse)
  return { house: data, isLoading, error, isValidating }
}

const useGetAllHouses = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.HOUSE}?${queryParams}`, getAllHouses)
  return { allHouses: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

const useUpdateHouse = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdateHouse>(API_BASEURL + ENDPOINTS.HOUSE, updateHouse)
  return { updateHouse: trigger, isMutating, error }
}

const useDeleteHouse = () => {
  const { trigger, error, isMutating } = useSWRMutation<Promise<void>, ResponseError, string, string>(API_BASEURL + ENDPOINTS.HOUSE, deleteHouse)
  return { deleteHouse: trigger, error, isMutating }
}

export { useCreateHouse, useGetAllHouses, useGetHouse, useUpdateHouse, useDeleteHouse }
