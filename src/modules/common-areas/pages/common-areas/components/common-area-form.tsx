import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { PrivateRoutes } from '@/models/routes.model'
import { useCreateResource, useGetResource, useUpdateResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
import { type CommonArea, type CreateCommonArea } from '../../../models/common-area.model'

const baseSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'Mínimo 3 caracteres')
    .max(100),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .min(10, 'Mínimo 10 caracteres')
    .max(500),
  capacity: z
    .number({ required_error: 'La capacidad es requerida' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .min(1, 'Capacidad mínima es 1'),
  is_active: z.boolean().default(true),
  is_reservable: z.boolean().default(true),
  requires_payment: z.boolean().default(false),
  price_per_hour: z
    .number()
    .min(0, 'El precio debe ser positivo')
    .optional(),
  operating_hours_start: z.string().optional(),
  operating_hours_end: z.string().optional(),
  advance_reservation_days: z
    .number()
    .int('Debe ser un número entero')
    .min(0, 'Debe ser positivo')
    .optional(),
  max_reservation_hours: z
    .number()
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .optional(),
  maintenance_notes: z.string().optional(),
})

const createSchema = baseSchema
const editSchema = baseSchema

const CommonAreaFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Áreas Comunes', path: PrivateRoutes.COMMON_AREA },
    { label: title }
  ])
  
  const { id } = useParams()
  const navigate = useNavigate()
  const { createResource: createCommonArea, isMutating } = useCreateResource<CreateCommonArea>({ endpoint: ENDPOINTS.COMMON_AREA })
  const { updateResource: updateCommonArea } = useUpdateResource<CreateCommonArea>(ENDPOINTS.COMMON_AREA)
  const { resource: commonArea } = useGetResource<CommonArea>({ endpoint: ENDPOINTS.COMMON_AREA, id })

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(id ? editSchema : createSchema),
    defaultValues: {
      name: '',
      description: '',
      capacity: 1,
      is_active: true,
      is_reservable: true,
      requires_payment: false,
      price_per_hour: 0,
      operating_hours_start: '08:00',
      operating_hours_end: '18:00',
      advance_reservation_days: 7,
      max_reservation_hours: 4,
      maintenance_notes: '',
    },
    values: {
      name: commonArea?.name ?? '',
      description: commonArea?.description ?? '',
      capacity: commonArea?.capacity ?? 1,
      is_active: commonArea?.is_active ?? true,
      is_reservable: commonArea?.is_reservable ?? true,
      requires_payment: commonArea?.requires_payment ?? false,
      price_per_hour: commonArea?.price_per_hour ?? 0,
      operating_hours_start: commonArea?.operating_hours_start ?? '08:00',
      operating_hours_end: commonArea?.operating_hours_end ?? '18:00',
      advance_reservation_days: commonArea?.advance_reservation_days ?? 7,
      max_reservation_hours: commonArea?.max_reservation_hours ?? 4,
      maintenance_notes: commonArea?.maintenance_notes ?? '',
    }
  })
  
  type FormData = z.infer<typeof createSchema> | z.infer<typeof editSchema>

  const onSubmit = (data: FormData) => {
    if (id) {
      toast.promise(updateCommonArea(data), {
        loading: 'Actualizando área común...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.COMMON_AREA, { replace: true })
          }, 1000)
          return 'Área común actualizada exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar área común'
        }
      })
    } else {
      toast.promise(createCommonArea({ ...data }), {
        loading: 'Creando área común...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.COMMON_AREA, { replace: true })
          }, 1000)
          return 'Área común creada exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear área común'
        }
      })
    }
  }

  return (
    <section className="grid flex-1 items-start gap-4 lg:gap-6 overflow-x-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-4xl flex flex-col gap-4 lg:gap-6">
          <div>
            <div className="flex items-center gap-4 flex-wrap">
              <Button
                type="button"
                onClick={() => { navigate(PrivateRoutes.COMMON_AREA) }}
                variant="outline"
                size="icon"
                className="h-7 w-7 flex-shrink-0"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <h2 className="flex-1 text-xl font-semibold tracking-tight min-w-0">
                {title}
              </h2>
              <div className="hidden items-center gap-2 md:ml-auto md:flex flex-shrink-0">
                <Button
                  type="button"
                  onClick={() => { navigate(PrivateRoutes.COMMON_AREA) }}
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={isMutating}>
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Área</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Salón de Eventos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidad (personas)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="50"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descripción detallada del área común..."
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:gap-6">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start justify-between rounded-lg border p-4 space-y-2">
                      <div className="space-y-0.5 w-full">
                        <FormLabel className="text-base">Área Activa</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          El área está disponible para uso
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_reservable"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start justify-between rounded-lg border p-4 space-y-2">
                      <div className="space-y-0.5 w-full">
                        <FormLabel className="text-base">Reservable</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Permite hacer reservas
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requires_payment"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start justify-between rounded-lg border p-4 space-y-2">
                      <div className="space-y-0.5 w-full">
                        <FormLabel className="text-base">Requiere Pago</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Cobra por el uso del área
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch('requires_payment') && (
                <div className="col-span-full lg:col-span-1">
                  <FormField
                    control={form.control}
                    name="price_per_hour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio por Hora (Bs.)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="50.00"
                            className="w-full"
                            onChange={(e) => {
                              field.onChange(Number(e.target.value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Horarios y Restricciones */}
          <Card>
            <CardHeader>
              <CardTitle>Horarios y Restricciones</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="operating_hours_start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Apertura</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="operating_hours_end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Cierre</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="advance_reservation_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Días de Anticipación para Reservar</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="7"
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_reservation_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Máximo Horas por Reserva</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="4"
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="maintenance_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas de Mantenimiento</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Notas importantes sobre mantenimiento..."
                        className="min-h-20 w-full resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => { navigate(PrivateRoutes.COMMON_AREA) }}
            >
              Cancelar
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

export default CommonAreaFormPage