/* eslint-disable multiline-ternary */
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
  useCreateUser,
  useGetUser,
  useUpdateUser
} from '@/modules/users/hooks/useUser'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { useEffect, useState } from 'react'

const baseSchema = z.object({
  ci: z
    .number({ required_error: 'El carnet de identidad es requerido' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .min(1, 'El código es requerido'),
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
      const roles = Object.values(PERMISSION)
      return roles.includes(value as PERMISSION)
    }, 'Rol inválido'),
  phone: z
    .number()
    .int('Debe ser un número entero')
    .optional()
})

// Roles que usan contraseña automática (CI)
const RESIDENTIAL_ROLES = [PERMISSION.RESIDENT, PERMISSION.OWNER, PERMISSION.VISITOR]

const createSchema = baseSchema.extend({
  password: z
    .string()
    .optional()
}).refine((data) => {
  // Si es un rol residencial, no requiere contraseña
  if (RESIDENTIAL_ROLES.includes(data.role as PERMISSION)) {
    return true
  }
  // Para otros roles, la contraseña es requerida
  if (!data.password || data.password.length < 6) {
    return false
  }
  return true
}, {
  message: 'La contraseña es requerida para este rol (mínimo 6 caracteres)',
  path: ['password']
})

const editSchema = baseSchema.extend({
  password: z.string().optional()
})

const UserFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Administrativo', path: PrivateRoutes.USER },
    { label: title }
  ])
  const { id } = useParams()
  console.log(id)
  const navigate = useNavigate()
  const { createUser, isMutating } = useCreateUser()
  const { updateUser } = useUpdateUser()
  const { user } = useGetUser(id)

  // Estado para observar el rol seleccionado
  const [selectedRole, setSelectedRole] = useState<string>(user?.role ?? '')
  
  // Función para determinar si se requiere contraseña manual
  const requiresManualPassword = (role: string): boolean => {
    return !RESIDENTIAL_ROLES.includes(role as PERMISSION)
  }

  const form = useForm<z.infer<typeof baseSchema | typeof createSchema>>({
    resolver: zodResolver(id ? editSchema : createSchema),
    values: {
      ci: user?.ci ?? 0,
      email: user?.email ?? '',
      name: user?.name ?? '',
      password: id ? '' : user?.password ?? '',
      role: user?.role ?? '',
      phone: user?.phone ?? 0
    }
  })
  
  // Observar cambios en el campo role
  const watchedRole = form.watch('role')
  
  // Actualizar el estado cuando cambie el rol
  useEffect(() => {
    if (watchedRole !== selectedRole) {
      setSelectedRole(watchedRole)
      // Limpiar contraseña si es un rol residencial
      if (!requiresManualPassword(watchedRole)) {
        form.setValue('password', '')
      }
    }
  }, [watchedRole, selectedRole, form])
  type FormData = z.infer<typeof createSchema> | z.infer<typeof editSchema>

  const onSubmit = (data: FormData) => {
    // Para roles residenciales, no enviar contraseña (se usará CI automáticamente)
    const submitData = { ...data }
    if (!requiresManualPassword(data.role)) {
      delete submitData.password
    }
    
    if (id) {
      toast.promise(updateUser({ id, ...submitData, password: submitData.password ?? '' }), {
        loading: 'Actualizando usuario...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.USER, { replace: true })
          }, 1000)
          return 'Usuario actualizado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar el usuario'
        }
      })
    } else {
      toast.promise(createUser({ ...submitData, password: submitData.password ?? '' }), {
        loading: 'Creando usuario...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.USER, { replace: true })
          }, 1000)
          return 'Usuario creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear el usuario'
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
                  navigate(PrivateRoutes.USER)
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
                    navigate(PrivateRoutes.USER)
                  }}
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
                <CardTitle>Datos personales</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-6">
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el nombre del administrativo"
                            {...field}
                          />
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
                            type="number"
                            placeholder="10360074..."
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
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} />
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
                          <Input placeholder="77112200..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PERMISSION.ADMINISTRATOR}>
                            Administrador
                          </SelectItem>
                          <SelectItem value={PERMISSION.GUARD}>
                            Guardia
                          </SelectItem>
                          <SelectItem value={PERMISSION.OWNER}>
                            Propietario
                          </SelectItem>
                          <SelectItem value={PERMISSION.RESIDENT}>
                            Residente
                          </SelectItem>
                          <SelectItem value={PERMISSION.VISITOR}>
                            Visitante
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Campo de contraseña condicional */}
                {!id && requiresManualPassword(selectedRole || watchedRole) && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="************"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Mensaje informativo para roles residenciales */}
                {!id && !requiresManualPassword(selectedRole || watchedRole) && (selectedRole || watchedRole) && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Contraseña automática:</strong> Para este rol, se utilizará automáticamente el número de carnet como contraseña.
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigate(PrivateRoutes.USER)
              }}
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

export default UserFormPage
