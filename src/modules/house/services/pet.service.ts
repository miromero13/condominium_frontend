import { fetchData } from '@/utils'
import { type Pet, type CreatePet, type UpdatePet } from '../models/pet.model'
import { ApiResponse } from '@/models'

const createPet = async (url: string, { arg }: { arg: CreatePet }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getPet = async (url: string): Promise<Pet> => {
  const response = await fetchData(url)
  return response.data
}

const updatePet = async (url: string, { arg }: { arg: UpdatePet }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify({
      house_id: arg?.house_id,
      name: arg?.name,
      species: arg?.species,
      breed: arg?.breed,
    })
  }
  await fetchData(`${url}${arg.id}/`, options)
}

const getAllPets = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as Pet[], countData: response.countData }
}

const deletePet = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}${id}/`, options)
}

export { createPet, getAllPets, getPet, updatePet, deletePet }