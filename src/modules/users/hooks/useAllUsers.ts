import useSWRMutation from 'swr/mutation'
import { createAllUser, deleteAllUser, getAllUsers, getAllUser, updateAllUser } from '../services/all-users.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type FormUser, type CreateUser, type UpdateUser } from '../models/user.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateAllUser = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateUser>(
    API_BASEURL + ENDPOINTS.ALL_USERS, 
    createAllUser
  )
  return { createAllUser: trigger, isMutating, error }
}

const useGetAllUser = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<FormUser, ResponseError>(
    id ? API_BASEURL + ENDPOINTS.ALL_USERS + `${id}/` : null, 
    getAllUser
  )
  return { allUser: data, isLoading, error, isValidating }
}

const useGetAllUsers = () => {
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
    `${API_BASEURL + ENDPOINTS.ALL_USERS}?${queryParams}`, 
    getAllUsers
  )
  
  return { 
    allUsers: data?.data ?? [], 
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

const useUpdateAllUser = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdateUser>(
    API_BASEURL + ENDPOINTS.ALL_USERS, 
    updateAllUser
  )
  return { updateAllUser: trigger, isMutating, error }
}

const useDeleteAllUser = () => {
  const { trigger, error, isMutating } = useSWRMutation<Promise<void>, ResponseError, string, string>(
    API_BASEURL + ENDPOINTS.ALL_USERS, 
    deleteAllUser
  )
  return { deleteAllUser: trigger, error, isMutating }
}

export { 
  useCreateAllUser, 
  useGetAllUsers, 
  useGetAllUser, 
  useUpdateAllUser, 
  useDeleteAllUser 
}