import { fetchData } from '@/utils'
import { type HouseUser, type CreateHouseUser, type UpdateHouseUser } from '../models/house-user.model'
import { ApiResponse } from '@/models'

const createHouseUser = async (url: string, { arg }: { arg: CreateHouseUser }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getHouseUser = async (url: string): Promise<HouseUser> => {
  const response = await fetchData(url)
  return response.data
}

const updateHouseUser = async (url: string, { arg }: { arg: UpdateHouseUser }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify({
      house_id: arg?.house_id,
      user_id: arg?.user_id,
      type_house: arg?.type_house,
      is_principal: arg?.is_principal,
      price_responsibility: arg?.price_responsibility,
      inicial_date: arg?.inicial_date,
      end_date: arg?.end_date,
    })
  }
  await fetchData(`${url}${arg.id}/`, options)
}

const getAllHouseUsers = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as HouseUser[], countData: response.countData }
}

const deleteHouseUser = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}${id}/`, options)
}

export { createHouseUser, getAllHouseUsers, getHouseUser, updateHouseUser, deleteHouseUser }