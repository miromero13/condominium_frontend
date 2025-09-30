import { useState } from 'react'
import { Building2, Contact, BookOpen } from 'lucide-react'
import useSWR from 'swr'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models'
import { getResource } from '@/services/crud.service'
import { API_BASEURL, ENDPOINTS } from '@/utils/api.utils'
import { fetchData } from '@/utils'

import { CondominiumInfo, ContactInfo, UpdateCondominiumInfoRequest, UpdateAllContactsRequest } from '@/models/condominium.model'
import { CondominiumInfoForm } from './CondominiumInfoForm'
import { ContactInfoForm } from './ContactInfoForm'

const CondominiumManagementPage = (): JSX.Element => {
  const navigate = useNavigate()
  
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Gestión de Condominio' }
  ])

  const [activeTab, setActiveTab] = useState('info')
  const [isUpdating, setIsUpdating] = useState(false)

  // Obtener información del condominio
  const { 
    data: condominiumResponse, 
    isLoading: condominiumLoading,
    mutate: mutateCondominium
  } = useSWR(
    `${API_BASEURL}${ENDPOINTS.CONDOMINIUM}info/`,
    getResource
  )

  // Obtener información de contactos
  const { 
    data: contactResponse, 
    isLoading: contactLoading,
    mutate: mutateContact
  } = useSWR(
    `${API_BASEURL}${ENDPOINTS.CONDOMINIUM}contacts/`,
    getResource
  )

  const isLoading = condominiumLoading || contactLoading

  // Función para actualizar información del condominio
  const updateCondominiumInfo = async (data: UpdateCondominiumInfoRequest): Promise<boolean> => {
    try {
      setIsUpdating(true)
      const options: RequestInit = {
        method: 'PUT',
        body: JSON.stringify(data)
      }
      
      await fetchData(`${API_BASEURL}${ENDPOINTS.CONDOMINIUM}info/`, options)
      await mutateCondominium()
      
      toast.success('Información del condominio actualizada correctamente')
      return true
    } catch (error) {
      console.error('Error updating condominium info:', error)
      toast.error('Error al actualizar la información del condominio')
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  // Función para actualizar información de contactos
  const updateContactInfo = async (data: UpdateAllContactsRequest): Promise<boolean> => {
    try {
      setIsUpdating(true)
      const options: RequestInit = {
        method: 'PUT',
        body: JSON.stringify(data)
      }
      
      await fetchData(`${API_BASEURL}${ENDPOINTS.CONDOMINIUM}contacts/`, options)
      await mutateContact()
      
      toast.success('Información de contactos actualizada correctamente')
      return true
    } catch (error) {
      console.error('Error updating contact info:', error)
      toast.error('Error al actualizar la información de contactos')
      return false
    } finally {
      setIsUpdating(false)
    }
  }



  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Condominio</h1>
            <p className="text-muted-foreground">
              Administra la información general y contactos del condominio
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const condominiumInfo: CondominiumInfo = condominiumResponse as CondominiumInfo
  const contactInfo: ContactInfo = contactResponse as ContactInfo

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Condominio</h1>
          <p className="text-muted-foreground">
            Administra la información general y contactos del condominio
          </p>
        </div>
        <Button 
          onClick={() => navigate(PrivateRoutes.GENERAL_RULES)}
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Reglamento General
        </Button>
      </div>

      <Separator />

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="info" className="gap-2">
            <Building2 className="h-4 w-4" />
            Información General
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Contact className="h-4 w-4" />
            Contactos
          </TabsTrigger>
        </TabsList>

        {/* Información General Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Condominio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {condominiumInfo && (
                <CondominiumInfoForm
                  initialData={condominiumInfo}
                  onSubmit={updateCondominiumInfo}
                  isLoading={isUpdating}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contactos Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Contact className="h-5 w-5" />
                Información de Contactos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contactInfo && (
                <ContactInfoForm
                  initialData={contactInfo}
                  onSubmit={updateContactInfo}
                  isLoading={isUpdating}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CondominiumManagementPage