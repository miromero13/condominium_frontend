import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { 
  detectPlate, 
  getAllVehicles, 
  getVehicle, 
  getAllAccessHistory, 
  createAccessHistory,
  getSecurityStats 
} from '../services/security.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { 
  type PlateDetectionRequest, 
  type PlateDetectionResponse, 
  type Vehicle, 
  type AccessHistory,
  type CreateAccessHistory,
  type SecurityStats
} from '../models/security.model'
import { type ApiResponse } from '@/models'

const useDetectPlate = () => {
  const { trigger, isMutating, error } = useSWRMutation<PlateDetectionResponse, ResponseError, string, PlateDetectionRequest>(
    API_BASEURL + ENDPOINTS.DETECT_PLATE, 
    detectPlate
  )
  return { detectPlate: trigger, isDetecting: isMutating, error }
}

const useGetAllVehicles = () => {
  const { 
    changeOrder, 
    filterOptions, 
    newPage, 
    prevPage, 
    queryParams, 
    search, 
    setFilterOptions, 
    setOffset 
  } = useFilterData(filterStateDefault)
  
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(
    `${API_BASEURL + ENDPOINTS.VEHICLES}?${queryParams}`, 
    getAllVehicles
  )
  
  return { 
    allVehicles: data?.data ?? [], 
    countData: data?.countData ?? 0, 
    error, 
    isLoading, 
    mutate, 
    changeOrder, 
    filterOptions, 
    newPage, 
    prevPage, 
    search, 
    setFilterOptions, 
    setOffset 
  }
}

const useGetVehicle = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<Vehicle, ResponseError>(
    id ? API_BASEURL + ENDPOINTS.VEHICLES + `${id}/` : null, 
    getVehicle
  )
  return { vehicle: data, isLoading, error, isValidating }
}

const useGetAllAccessHistory = () => {
  const { 
    changeOrder, 
    filterOptions, 
    newPage, 
    prevPage, 
    queryParams, 
    search, 
    setFilterOptions, 
    setOffset 
  } = useFilterData(filterStateDefault)
  
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(
    `${API_BASEURL + ENDPOINTS.ACCESS_HISTORY}?${queryParams}`, 
    getAllAccessHistory
  )
  
  return { 
    allAccessHistory: data?.data ?? [], 
    countData: data?.countData ?? 0, 
    error, 
    isLoading, 
    mutate, 
    changeOrder, 
    filterOptions, 
    newPage, 
    prevPage, 
    search, 
    setFilterOptions, 
    setOffset 
  }
}

const useCreateAccessHistory = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateAccessHistory>(
    API_BASEURL + ENDPOINTS.ACCESS_HISTORY, 
    createAccessHistory
  )
  return { createAccessHistory: trigger, isMutating, error }
}

const useGetSecurityStats = () => {
  const { data, isLoading, error, mutate } = useSWR<SecurityStats, ResponseError>(
    API_BASEURL + '/api/security/stats/', 
    getSecurityStats
  )
  return { stats: data, isLoading, error, mutate }
}

export { 
  useDetectPlate,
  useGetAllVehicles, 
  useGetVehicle,
  useGetAllAccessHistory,
  useCreateAccessHistory,
  useGetSecurityStats
}