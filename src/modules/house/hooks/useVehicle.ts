import useSWRMutation from 'swr/mutation'
import { createVehicle, deleteVehicle, getVehicle, getAllVehicles, updateVehicle } from '../services/vehicle.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type FormVehicle, type CreateVehicle, type UpdateVehicle } from '../models/vehicle.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateVehicle = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateVehicle>(API_BASEURL + ENDPOINTS.VEHICLE, createVehicle)
  return { createVehicle: trigger, isMutating, error }
}

const useGetVehicle = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<FormVehicle, ResponseError>(id ? `${API_BASEURL}${ENDPOINTS.VEHICLE}${id}/` : null, getVehicle)
  return { vehicle: data, isLoading, error, isValidating }
}

const useGetAllVehicles = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.VEHICLE}?${queryParams}`, getAllVehicles)
  return { allVehicles: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

const useUpdateVehicle = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdateVehicle>(API_BASEURL + ENDPOINTS.VEHICLE, updateVehicle)
  return { updateVehicle: trigger, isMutating, error }
}

const useDeleteVehicle = () => {
  const { trigger, error, isMutating } = useSWRMutation<Promise<void>, ResponseError, string, string>(API_BASEURL + ENDPOINTS.VEHICLE, deleteVehicle)
  return { deleteVehicle: trigger, error, isMutating }
}

export { useCreateVehicle, useGetAllVehicles, useGetVehicle, useUpdateVehicle, useDeleteVehicle }