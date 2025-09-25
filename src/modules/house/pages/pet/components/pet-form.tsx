import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PrivateRoutes } from '@/models/routes.model'
import { useCreatePet, useGetPet, useUpdatePet } from '@/modules/house/hooks/usePet'
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
  name: z.string().min(1, 'El nombre es requerido').max(100),
  species: z.string().min(1, 'La especie es requerida').max(50),
  breed: z.string().optional()
})

const PetFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Gestión de Viviendas', path: PrivateRoutes.HOUSE },
    { label: 'Mascotas', path: PrivateRoutes.PET },
    { label: title }
  ])

  const { id } = useParams()
  const navigate = useNavigate()
  const { createPet, isMutating } = useCreatePet()
  const { updatePet } = useUpdatePet()
  const { pet } = useGetPet(id)
  
  // Obtener lista de viviendas
  const { allHouses } = useGetAllHouses()

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      house_id: '',
      name: '',
      species: '',
      breed: ''
    }
  })

  // Reset form when pet data loads
  useEffect(() => {
    if (pet && id) {
      form.reset({
        house_id: pet.house_id ?? '',
        name: pet.name ?? '',
        species: pet.species ?? '',
        breed: pet.breed ?? ''
      })
    }
  }, [pet, id, form])

  const onSubmit = (data: z.infer<typeof baseSchema>) => {
    const submitData = {
      ...data,
      breed: data.breed || undefined
    }

    if (id) {
      toast.promise(updatePet({ ...submitData, id }), {
        loading: 'Actualizando...',
        success: () => {
          navigate(PrivateRoutes.PET)
          return 'Mascota actualizada exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar'
        }
      })
    } else {
      toast.promise(createPet(submitData), {
        loading: 'Creando...',
        success: () => {
          navigate(PrivateRoutes.PET)
          return 'Mascota creada exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear'
        }
      })
    }
  }

  const handleGoBack = () => {
    navigate(PrivateRoutes.PET)
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
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la Mascota *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Max, Luna, Buddy"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="species"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especie *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la especie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Perro">Perro</SelectItem>
                              <SelectItem value="Gato">Gato</SelectItem>
                              <SelectItem value="Ave">Ave</SelectItem>
                              <SelectItem value="Pez">Pez</SelectItem>
                              <SelectItem value="Hámster">Hámster</SelectItem>
                              <SelectItem value="Conejo">Conejo</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Raza (Opcional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Labrador, Persa, Canario"
                              {...field}
                            />
                          </FormControl>
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

export default PetFormPage