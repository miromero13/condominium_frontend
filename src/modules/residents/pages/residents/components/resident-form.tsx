import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { PrivateRoutes } from '@/models/routes.model'
import {
  useCreateResident,
  useGetResident,
  useUpdateResident
} from '@/modules/residents/hooks/useResident'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'

const baseSchema = z.object({
  ci: z
    .string({ required_error: 'El carnet de identidad es requerido' })
    .min(1, 'El CI es requerido')
    .max(20, 'Máximo 20 caracteres'),
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'Mínimo 3 caracteres')
    .max(100),
  email: z
    .string({ required_error: 'El correo es requerido' })
    .email('Correo inválido')
    .max(100),
  role: z
    .string()
    .min(1, 'El rol es requerido')
    .refine((value) => {
      const roles = ['owner', 'resident', 'visitor']
      return roles.includes(value)
    }, 'Rol inválido'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .max(20, 'Máximo 20 caracteres')
})

const createSchema = baseSchema

const editSchema = baseSchema

const ResidentFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Residentes', path: PrivateRoutes.RESIDENT },
    { label: title }
  ])
  const { id } = useParams()
  const navigate = useNavigate()
  const { createResource: createResident, isMutating } = useCreateResident()
  const { updateResource: updateResident } = useUpdateResident()
  const { resource: resident } = useGetResident(id)

  const form = useForm<z.infer<typeof baseSchema | typeof createSchema>>({
    resolver: zodResolver(id ? editSchema : createSchema),
    values: {
      ci: resident?.ci ?? '',
      email: resident?.email ?? '',
      name: resident?.name ?? '',
      role: resident?.role ?? '',
      phone: resident?.phone ?? ''
    }
  })
  
  type FormData = z.infer<typeof createSchema> | z.infer<typeof editSchema>

  const onSubmit = (data: FormData) => {
    if (id) {
      toast.promise(updateResident({ id, ...data }), {
        loading: 'Actualizando residente...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.RESIDENT, { replace: true })
          }, 1000)
          return 'Residente actualizado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar el residente'
        }
      })
    } else {
      toast.promise(createResident({ ...data }), {
        loading: 'Creando residente...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.RESIDENT, { replace: true })
          }, 1000)
          return 'Residente creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear el residente'
        }
      })
    }
  }

  return (
    <section className="grid flex-1 items-start gap-4 lg:gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full flex flex-col gap-4 lg:gap-6"
        >
          <div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => {
                  navigate(PrivateRoutes.RESIDENT)
                }}
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
                  onClick={() => {
                    navigate(PrivateRoutes.RESIDENT)
                  }}
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
          <Card>
            <CardHeader>
              <CardTitle>Datos del Residente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ci"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carnet de Identidad</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="12345678"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="juan@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+59170123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="owner">Propietario</SelectItem>
                        <SelectItem value="resident">Residente</SelectItem>
                        <SelectItem value="visitor">Visitante</SelectItem>
                      </SelectContent>
                    </Select>
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
              onClick={() => {
                navigate(PrivateRoutes.RESIDENT)
              }}
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

export default ResidentFormPage