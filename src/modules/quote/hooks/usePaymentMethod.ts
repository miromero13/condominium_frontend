import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'
import { type PaymentMethod } from '../models'
import {
  createPaymentMethod,
  getPaymentMethod,
  getAllPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
  getAllPaymentGateways
} from '../services'

// Hooks para métodos de pago
export const useCreatePaymentMethod = () => {
  const { trigger, isMutating, error } = useSWRMutation<PaymentMethod, ResponseError, string, Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>>(
    API_BASEURL + ENDPOINTS.PAYMENT_METHOD,
    createPaymentMethod
  )
  return { createPaymentMethod: trigger, isMutating, error }
}

export const useGetPaymentMethod = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<PaymentMethod, ResponseError>(
    id ? `${API_BASEURL}${ENDPOINTS.PAYMENT_METHOD}${id}/` : null,
    getPaymentMethod
  )
  return { paymentMethod: data, isLoading, error, isValidating }
}

export const useGetAllPaymentMethods = () => {
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
    `${API_BASEURL + ENDPOINTS.PAYMENT_METHOD}?${queryParams}`,
    getAllPaymentMethods
  )
  
  return { 
    allPaymentMethods: data?.data ?? [], 
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

export const useUpdatePaymentMethod = () => {
  const { trigger, isMutating, error } = useSWRMutation<PaymentMethod, ResponseError, string, Partial<PaymentMethod> & { id: string }>(
    API_BASEURL + ENDPOINTS.PAYMENT_METHOD,
    updatePaymentMethod
  )
  return { updatePaymentMethod: trigger, isMutating, error }
}

export const useDeletePaymentMethod = () => {
  const { trigger, error, isMutating } = useSWRMutation<void, ResponseError, string, string>(
    API_BASEURL + ENDPOINTS.PAYMENT_METHOD,
    deletePaymentMethod
  )
  return { deletePaymentMethod: trigger, error, isMutating }
}

// Hooks para gateways de pago
export const useGetAllPaymentGateways = () => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(
    API_BASEURL + ENDPOINTS.PAYMENT_GATEWAY,
    getAllPaymentGateways
  )
  
  return { 
    allPaymentGateways: data?.data ?? [], 
    countData: data?.countData ?? 0, 
    error, 
    isLoading, 
    mutate 
  }
}

// Hook combinado para opciones de métodos de pago (para formularios)
export const usePaymentMethodOptions = () => {
  const { allPaymentMethods, isLoading, error } = useGetAllPaymentMethods()
  
  const paymentMethodOptions = allPaymentMethods
    .filter((pm: PaymentMethod) => pm.is_active)
    .map((pm: PaymentMethod) => ({
      value: pm.id,
      label: pm.name,
      description: pm.description,
      requires_gateway: pm.requires_gateway,
      manual_verification: pm.manual_verification
    }))
  
  return { paymentMethodOptions, isLoading, error }
}