import { fetchData } from '@/utils'
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

// Servicios de cuotas
export const createQuote = async (url: string, { arg }: { arg: CreateQuoteRequest }): Promise<Quote> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  // El backend puede devolver directamente el objeto o en response.data
  return response.data || response
}

export const getQuote = async (url: string): Promise<Quote> => {
  const response = await fetchData(url)
  return response.data || response
}

export const getAllQuotes = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  
  // Si es un array directamente, usarlo como data
  if (Array.isArray(response)) {
    return { 
      data: response as Quote[], 
      countData: response.length 
    }
  }
  
  // Si tiene estructura DRF (results, count)
  if (response.results) {
    return { 
      data: response.results as Quote[], 
      countData: response.count || response.results.length
    }
  }
  
  // Fallback si tiene estructura personalizada (data, countData)
  return { 
    data: response.data as Quote[] || [], 
    countData: response.countData || 0
  }
}

export const updateQuote = async (url: string, { arg }: { arg: Partial<Quote> & { id: string } }): Promise<Quote> => {
  const { id, ...updateData } = arg
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify(updateData)
  }
  const response = await fetchData(`${url}${id}/`, options)
  return response.data || response
}

export const deleteQuote = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}${id}/`, options)
}

// Funciones específicas de cuotas
export const autoGenerateQuotes = async (url: string, { arg }: { arg: AutoGenerateQuotesRequest }): Promise<Quote[]> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(`${url}auto-generate/`, options)
  return response.data || response
}

export const markQuotesAsPaid = async (url: string, { arg }: { arg: MarkAsPaidRequest }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  await fetchData(`${url}mark-as-paid/`, options)
}

export const markSingleQuoteAsPaid = async (url: string, { arg }: { arg: { id: string, payment_date?: string } }): Promise<Quote> => {
  const { id, payment_date } = arg
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({ payment_date })
  }
  const response = await fetchData(`${url}${id}/mark-paid/`, options)
  return response.data || response
}

export const getQuoteStatistics = async (url: string, year?: number): Promise<QuoteStatistics> => {
  const yearParam = year ? `?year=${year}` : ''
  const response = await fetchData(`${url}${yearParam}`)
  return response.data || response
}

export const createPaymentLink = async (url: string, { arg }: { arg: CreatePaymentLinkRequest }): Promise<PaymentLinkResponse> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(`${url}create-payment-link/`, options)
  return response.data || response
}