import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PrivateRoutes } from '@/models/routes.model'
import { useCreateVehicle, useGetVehicle, useUpdateVehicle } from '@/modules/house/hooks/useVehicle'
import { useGetAllHouses } from '@/modules/house/hooks/useHouse'
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
  plate: z.string().min(1, 'La placa es requerida').max(20),
  brand: z.string().min(1, 'La marca es requerida').max(50),
  model: z.string().min(1, 'El modelo es requerido').max(50),
  color: z.string().min(1, 'El color es requerido').max(30),
  type_vehicle: z.enum(['SEDAN', 'SUV', 'HATCHBACK', 'PICKUP', 'MOTORCYCLE', 'TRUCK', 'VAN'], {
    required_error: 'Debe seleccionar el tipo de vehículo'
  })
})

const VehicleFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Gestión de Viviendas', path: PrivateRoutes.HOUSE },
    { label: 'Vehículos', path: PrivateRoutes.VEHICLE },
    { label: title }
  ])

  const { id } = useParams()
  const navigate = useNavigate()
  const { createVehicle, isMutating } = useCreateVehicle()
  const { updateVehicle } = useUpdateVehicle()
  const { vehicle } = useGetVehicle(id)
  
  // Obtener lista de viviendas
  const { allHouses } = useGetAllHouses()

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      house_id: '',
      plate: '',
      brand: '',
      model: '',
      color: '',
      type_vehicle: 'SEDAN'
    }
  })

  // Reset form when vehicle data loads
  useEffect(() => {
    if (vehicle && id) {
      form.reset({
        house_id: vehicle.house_id ?? '',
        plate: vehicle.plate ?? '',
        brand: vehicle.brand ?? '',
        model: vehicle.model ?? '',
        color: vehicle.color ?? '',
        type_vehicle: vehicle.type_vehicle ?? 'SEDAN'
      })
    }
  }, [vehicle, id, form])

  const onSubmit = (data: z.infer<typeof baseSchema>) => {
    if (id) {
      toast.promise(updateVehicle({ ...data, id }), {
        loading: 'Actualizando...',
        success: () => {
          navigate(PrivateRoutes.VEHICLE)
          return 'Vehículo actualizado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar'
        }
      })
    } else {
      toast.promise(createVehicle(data), {
        loading: 'Creando...',
        success: () => {
          navigate(PrivateRoutes.VEHICLE)
          return 'Vehículo creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear'
        }
      })
    }
  }

  const handleGoBack = () => {
    navigate(PrivateRoutes.VEHICLE)
  }

  const vehicleTypes = [
    { value: 'SEDAN', label: 'Sedán' },
    { value: 'SUV', label: 'SUV' },
    { value: 'HATCHBACK', label: 'Hatchback' },
    { value: 'PICKUP', label: 'Camioneta' },
    { value: 'MOTORCYCLE', label: 'Motocicleta' },
    { value: 'TRUCK', label: 'Camión' },
    { value: 'VAN', label: 'Furgoneta' }
  ]

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
                      name="plate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Placa *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: ABC-123, 1234-DEF"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Toyota, Honda, Ford"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Corolla, Civic, Focus"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Blanco, Negro, Rojo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type_vehicle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Vehículo *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehicleTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

export default VehicleFormPage