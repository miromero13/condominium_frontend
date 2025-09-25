import useSWRMutation from 'swr/mutation'
import { createHouseUser, deleteHouseUser, getHouseUser, getAllHouseUsers, updateHouseUser } from '../services/house-user.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type FormHouseUser, type CreateHouseUser, type UpdateHouseUser } from '../models/house-user.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateHouseUser = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateHouseUser>(API_BASEURL + ENDPOINTS.HOUSE_USER, createHouseUser)
  return { createHouseUser: trigger, isMutating, error }
}

const useGetHouseUser = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<FormHouseUser, ResponseError>(id ? `${API_BASEURL}${ENDPOINTS.HOUSE_USER}${id}/` : null, getHouseUser)
  return { houseUser: data, isLoading, error, isValidating }
}

const useGetAllHouseUsers = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.HOUSE_USER}?${queryParams}`, getAllHouseUsers)
  return { allHouseUsers: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

const useUpdateHouseUser = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdateHouseUser>(API_BASEURL + ENDPOINTS.HOUSE_USER, updateHouseUser)
  return { updateHouseUser: trigger, isMutating, error }
}

const useDeleteHouseUser = () => {
  const { trigger, error, isMutating } = useSWRMutation<Promise<void>, ResponseError, string, string>(API_BASEURL + ENDPOINTS.HOUSE_USER, deleteHouseUser)
  return { deleteHouseUser: trigger, error, isMutating }
}

export { useCreateHouseUser, useGetAllHouseUsers, useGetHouseUser, useUpdateHouseUser, useDeleteHouseUser }