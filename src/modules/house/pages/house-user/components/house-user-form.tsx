import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { PrivateRoutes } from '@/models/routes.model'
import { useCreateHouseUser, useGetHouseUser, useUpdateHouseUser } from '@/modules/house/hooks/useHouseUser'
import { useGetAllHouses } from '@/modules/house/hooks/useHouse'
import { useGetAllUsers } from '@/modules/users/hooks/useAllUsers'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
import { useEffect } from 'react'

const baseSchema = z.object({
  house_id: z.string().min(1, 'Debe seleccionar una vivienda'),
  user_id: z.string().min(1, 'Debe seleccionar un usuario'),
  type_house: z.enum(['OWNER', 'RESIDENT'], {
    required_error: 'Debe seleccionar el tipo'
  }),
  is_principal: z.boolean(),
  price_responsibility: z.string().optional(),
  inicial_date: z.string().min(1, 'La fecha inicial es requerida'),
  end_date: z.string().optional()
})

const HouseUserFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Gestión de Viviendas', path: PrivateRoutes.HOUSE },
    { label: 'Usuario-Vivienda', path: PrivateRoutes.HOUSE_USER },
    { label: title }
  ])

  const { id } = useParams()
  const navigate = useNavigate()
  const { createHouseUser, isMutating } = useCreateHouseUser()
  const { updateHouseUser } = useUpdateHouseUser()
  const { houseUser } = useGetHouseUser(id)
  
  // Obtener listas para los dropdowns
  const { allHouses } = useGetAllHouses()
  const { allUsers } = useGetAllUsers()

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      house_id: '',
      user_id: '',
      type_house: 'RESIDENT',
      is_principal: false,
      price_responsibility: '',
      inicial_date: '',
      end_date: ''
    }
  })

  // Reset form when houseUser data loads
  useEffect(() => {
    if (houseUser && id) {
      form.reset({
        house_id: houseUser.house_id ?? '',
        user_id: houseUser.user_id ?? '',
        type_house: houseUser.type_house === 'OWNER' ? 'OWNER' : 'RESIDENT',
        is_principal: houseUser.is_principal ?? false,
        price_responsibility: houseUser.price_responsibility ?? '',
        inicial_date: houseUser.inicial_date ? new Date(houseUser.inicial_date).toISOString().split('T')[0] : '',
        end_date: houseUser.end_date ? new Date(houseUser.end_date).toISOString().split('T')[0] : ''
      })
    }
  }, [houseUser, id, form])

  // Watch is_principal field to control price_responsibility
  const isPrincipal = form.watch('is_principal')
  
  // Reset price_responsibility when is_principal changes to false
  useEffect(() => {
    if (!isPrincipal) {
      form.setValue('price_responsibility', '')
    }
  }, [isPrincipal, form])

  const onSubmit = (data: z.infer<typeof baseSchema>) => {
    const submitData = {
      ...data,
      // Si no es principal, establecer price_responsibility como null
      price_responsibility: data.is_principal ? (data.price_responsibility || null) : null,
      end_date: data.end_date || undefined
    }

    if (id) {
      toast.promise(updateHouseUser({ ...submitData, id }), {
        loading: 'Actualizando...',
        success: () => {
          navigate(PrivateRoutes.HOUSE_USER)
          return 'Usuario-Vivienda actualizado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar'
        }
      })
    } else {
      toast.promise(createHouseUser(submitData), {
        loading: 'Creando...',
        success: () => {
          navigate(PrivateRoutes.HOUSE_USER)
          return 'Usuario-Vivienda creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear'
        }
      })
    }
  }

  const handleGoBack = () => {
    navigate(PrivateRoutes.HOUSE_USER)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleGoBack}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {title}
            </h1>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-1">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
                    
                    <FormField
                      control={form.control}
                      name="house_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vivienda *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una vivienda" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {allHouses.map((house: any) => (
                                <SelectItem key={house.id} value={house.id}>
                                  {house.code} - {house.area}m²
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="user_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuario *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un usuario" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {allUsers.map((user: any) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type_house"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Relación *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="OWNER">Propietario</SelectItem>
                              <SelectItem value="RESIDENT">Inquilino</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_principal"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between border rounded-md px-2 py-1">
                          <FormLabel className="text-base">
                            Es Principal (responsable)
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-5 w-10"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inicial_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Inicial *</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder="Fecha inicial"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Final</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder="Fecha final (opcional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Solo mostrar precio de responsabilidad si es principal */}
                    {isPrincipal && (
                      <FormField
                        control={form.control}
                        name="price_responsibility"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Responsabilidad Económica</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: 399.000 Bs"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="md:col-span-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGoBack}
                          disabled={isMutating}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isMutating}>
                          {buttonText}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HouseUserFormPage