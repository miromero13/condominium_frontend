import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'
import {
  type Quote,
  type CreateQuoteRequest,
  type AutoGenerateQuotesRequest,
  type MarkAsPaidRequest,
  type CreatePaymentLinkRequest,
  type QuoteStatistics,
  type PaymentLinkResponse
} from '../models'
import {
  createQuote,
  getQuote,
  getAllQuotes,
  updateQuote,
  deleteQuote,
  autoGenerateQuotes,
  markQuotesAsPaid,
  markSingleQuoteAsPaid,
  getQuoteStatistics,
  createPaymentLink
} from '../services'

// Hook para crear cuota
export const useCreateQuote = () => {
  const { trigger, isMutating, error } = useSWRMutation<Quote, ResponseError, string, CreateQuoteRequest>(
    API_BASEURL + ENDPOINTS.QUOTE,
    createQuote
  )
  return { createQuote: trigger, isMutating, error }
}

// Hook para obtener una cuota específica
export const useGetQuote = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<Quote, ResponseError>(
    id ? `${API_BASEURL}${ENDPOINTS.QUOTE}${id}/` : null,
    getQuote
  )
  return { quote: data, isLoading, error, isValidating }
}

// Hook para obtener todas las cuotas con filtros y paginación
export const useGetAllQuotes = () => {
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
    `${API_BASEURL + ENDPOINTS.QUOTE}?${queryParams}`,
    getAllQuotes
  )
  
  return { 
    allQuotes: data?.data ?? [], 
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

// Hook para actualizar cuota
export const useUpdateQuote = () => {
  const { trigger, isMutating, error } = useSWRMutation<Quote, ResponseError, string, Partial<Quote> & { id: string }>(
    API_BASEURL + ENDPOINTS.QUOTE,
    updateQuote
  )
  return { updateQuote: trigger, isMutating, error }
}

// Hook para eliminar cuota
export const useDeleteQuote = () => {
  const { trigger, error, isMutating } = useSWRMutation<void, ResponseError, string, string>(
    API_BASEURL + ENDPOINTS.QUOTE,
    deleteQuote
  )
  return { deleteQuote: trigger, error, isMutating }
}

// Hook para generar cuotas automáticamente
export const useAutoGenerateQuotes = () => {
  const { trigger, isMutating, error } = useSWRMutation<Quote[], ResponseError, string, AutoGenerateQuotesRequest>(
    API_BASEURL + ENDPOINTS.QUOTE,
    autoGenerateQuotes
  )
  return { autoGenerateQuotes: trigger, isMutating, error }
}

// Hook para marcar múltiples cuotas como pagadas
export const useMarkQuotesAsPaid = () => {
  const { trigger, isMutating, error } = useSWRMutation<void, ResponseError, string, MarkAsPaidRequest>(
    API_BASEURL + ENDPOINTS.QUOTE,
    markQuotesAsPaid
  )
  return { markQuotesAsPaid: trigger, isMutating, error }
}

// Hook para marcar una cuota específica como pagada
export const useMarkSingleQuoteAsPaid = () => {
  const { trigger, isMutating, error } = useSWRMutation<Quote, ResponseError, string, { id: string, payment_date?: string }>(
    API_BASEURL + ENDPOINTS.QUOTE,
    markSingleQuoteAsPaid
  )
  return { markSingleQuoteAsPaid: trigger, isMutating, error }
}

// Hook para obtener estadísticas de cuotas
export const useQuoteStatistics = (year?: number) => {
  const { data, error, isLoading, mutate } = useSWR<QuoteStatistics, ResponseError>(
    `${API_BASEURL + ENDPOINTS.QUOTE}statistics/`,
    (url: string) => getQuoteStatistics(url, year)
  )
  return { statistics: data, error, isLoading, mutate }
}

// Hook para crear enlaces de pago
export const useCreatePaymentLink = () => {
  const { trigger, isMutating, error } = useSWRMutation<PaymentLinkResponse, ResponseError, string, CreatePaymentLinkRequest>(
    API_BASEURL + ENDPOINTS.QUOTE,
    createPaymentLink
  )
  return { createPaymentLink: trigger, isMutating, error }
}