import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PrivateRoutes } from '@/models/routes.model'
import { useCreateHouse, useGetHouse, useUpdateHouse } from '@/modules/house/hooks/useHouse'
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
  code: z.string().min(3).max(50),
  area: z.coerce.number().min(1),
  nro_rooms: z.coerce.number().min(1).max(20),
  nro_bathrooms: z.coerce.number().min(1).max(10),
  price_base: z.coerce.number().min(0),
  foto_url: z.string().url().optional().or(z.literal(''))
})

const HouseFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Viviendas', path: PrivateRoutes.HOUSE },
    { label: title }
  ])

  const { id } = useParams()
  const navigate = useNavigate()
  const { createHouse, isMutating } = useCreateHouse()
  const { updateHouse } = useUpdateHouse()
  const { house } = useGetHouse(id)

const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
        code: '',
        area: 0,
        nro_rooms: 0,
        nro_bathrooms: 0,
        price_base: 0,
        foto_url: ''
    }
})

  // Reset form when house data loads
  useEffect(() => {
    if (house && id) {
      form.reset({
        code: house.code ?? '',
        area: house.area ? parseFloat(house.area) : 0,
        nro_rooms: house.nro_rooms ?? 0,
        nro_bathrooms: house.nro_bathrooms ?? 0,
        price_base: house.price_base ? parseFloat(house.price_base) : 0,
        foto_url: house.foto_url ?? ''
      })
    }
  }, [house, id, form])

  type FormData = z.infer<typeof baseSchema>

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      price_base: String(data.price_base),
      area: String(data.area)
    }
    if (id) {
      toast.promise(updateHouse({ id, ...payload }), {
        loading: 'Actualizando...',
        success: () => {
          setTimeout(() => navigate(PrivateRoutes.HOUSE, { replace: true }), 1000)
          return 'Vivienda actualizada'
        },
        error(error) { return error?.errorMessages?.[0] ?? error?.message ?? 'Error al actualizar' }
      })
    } else {
      toast.promise(createHouse(payload), {
        loading: 'Creando...',
        success: () => {
          setTimeout(() => navigate(PrivateRoutes.HOUSE, { replace: true }), 1000)
          return 'Vivienda creada'
        },
        error(error) { return error?.errorMessages?.[0] ?? error?.message ?? 'Error al crear' }
      })
    }
  }

  return (
    <section className="grid flex-1 items-start gap-4 lg:gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
          <div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => navigate(PrivateRoutes.HOUSE)}
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Button>
              <h2 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {title}
              </h2>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button
                  type="button"
                  onClick={() => navigate(PrivateRoutes.HOUSE)}
                  variant="outline"
                  size="sm"
                >
                  Descartar
                </Button>
                <Button type="submit" size="sm" disabled={isMutating}>
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 lg:gap-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Datos de la Vivienda</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-6">
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: C101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área (m²)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 100.50" type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nro_rooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad de Habitaciones</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 3" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nro_bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad de Baños</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 2" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="price_base"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio Base (Bs.)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 1500.00" type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="foto_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de la Foto (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://ejemplo.com/foto.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(PrivateRoutes.HOUSE)}
            >
              Descartar
            </Button>
            <Button type="submit" size="sm" disabled={isMutating}>
              {buttonText}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default HouseFormPage

