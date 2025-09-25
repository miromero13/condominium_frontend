import { fetchData } from '@/utils'
import { type House, type CreateHouse, type UpdateHouse } from '../models/house.model'
import { ApiResponse } from '@/models'

const createHouse = async (url: string, { arg }: { arg: CreateHouse }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getHouse = async (url: string): Promise<House> => {
  const response = await fetchData(url)
  return response.data
}

const updateHouse = async (url: string, { arg }: { arg: UpdateHouse }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify({
      code: arg?.code,
      area: arg?.area,
      nro_rooms: arg?.nro_rooms,
      nro_bathrooms: arg?.nro_bathrooms,
      price_base: arg?.price_base,
      foto_url: arg?.foto_url,
    })
  }
  await fetchData(`${url}${arg.id}/`, options)
}

const getAllHouses = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as House[], countData: response.countData }
}

const deleteHouse = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}${id}/`, options)
}

export { createHouse, getAllHouses, getHouse, updateHouse, deleteHouse }
