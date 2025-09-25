import { fetchData } from '@/utils'
import { type ApiResponse } from '@/models'
import { type PaymentMethod, type PaymentGateway } from '../models'

// Servicios de métodos de pago
export const createPaymentMethod = async (url: string, { arg }: { arg: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'> }): Promise<PaymentMethod> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response.data
}

export const getPaymentMethod = async (url: string): Promise<PaymentMethod> => {
  const response = await fetchData(url)
  return response.data
}

export const getAllPaymentMethods = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  
  // Si es un array directamente, usarlo como data
  if (Array.isArray(response)) {
    return { 
      data: response as PaymentMethod[], 
      countData: response.length 
    }
  }
  
  // Si tiene estructura DRF (results, count)
  if (response.results) {
    return { 
      data: response.results as PaymentMethod[], 
      countData: response.count || response.results.length
    }
  }
  
  // Fallback si tiene estructura personalizada (data, countData)
  return { 
    data: response.data as PaymentMethod[] || [], 
    countData: response.countData || 0
  }
}

export const updatePaymentMethod = async (url: string, { arg }: { arg: Partial<PaymentMethod> & { id: string } }): Promise<PaymentMethod> => {
  const { id, ...updateData } = arg
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify(updateData)
  }
  const response = await fetchData(`${url}${id}/`, options)
  return response.data
}

export const deletePaymentMethod = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}${id}/`, options)
}

// Servicios de gateways de pago
export const getAllPaymentGateways = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  
  // Si es un array directamente, usarlo como data
  if (Array.isArray(response)) {
    return { 
      data: response as PaymentGateway[], 
      countData: response.length 
    }
  }
  
  // Si tiene estructura DRF (results, count)
  if (response.results) {
    return { 
      data: response.results as PaymentGateway[], 
      countData: response.count || response.results.length
    }
  }
  
  // Fallback si tiene estructura personalizada (data, countData)
  return { 
    data: response.data as PaymentGateway[] || [], 
    countData: response.countData || 0
  }
}