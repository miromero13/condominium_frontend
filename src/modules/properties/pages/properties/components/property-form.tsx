import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, X } from 'lucide-react'
import { PrivateRoutes } from '@/models/routes.model'
import { useCreateResource, useGetResource, useUpdateResource, useGetAllResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
import { PropertyStatus, PaymentFrequency, type CreateProperty, type FormProperty } from '../../../models/property.model'
import { type User } from '@/modules/users/models/user.model'
import { useState, useEffect } from 'react'
import useDebounce from '@/hooks/useDebounce'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const baseSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'Mínimo 3 caracteres')
    .max(100),
  address: z
    .string({ required_error: 'La dirección es requerida' })
    .min(5, 'Mínimo 5 caracteres')
    .max(255),
  description: z.string().optional(),
  
  // Identificación específica
  building_or_block: z.string().max(50).optional(),
  property_number: z
    .string({ required_error: 'El número de propiedad es requerido' })
    .min(1, 'El número de propiedad es requerido')
    .max(20),
  
  // Características físicas
  bedrooms: z.number().min(0, 'Debe ser mayor o igual a 0').default(0),
  bathrooms: z.number().min(0, 'Debe ser mayor o igual a 0').default(0),
  square_meters: z.number().min(0, 'Debe ser mayor a 0').optional(),
  has_garage: z.boolean().default(false),
  garage_spaces: z.number().min(0, 'Debe ser mayor o igual a 0').default(0),
  has_yard: z.boolean().default(false),
  has_balcony: z.boolean().default(false),
  has_terrace: z.boolean().default(false),
  floor_number: z.number().min(0, 'Debe ser mayor a 0').optional(),
  has_elevator: z.boolean().default(false),
  furnished: z.boolean().default(false),
  pets_allowed: z.boolean().default(true),
  
  // Sistema de pagos
  status: z
    .string()
    .min(1, 'El estado es requerido'),
  monthly_payment: z
    .number({ required_error: 'El pago mensual es requerido' })
    .min(0, 'Debe ser mayor o igual a 0')
    .default(0),
  payment_frequency: z
    .string()
    .min(1, 'La frecuencia de pago es requerida'),
  payment_due_day: z
    .number()
    .min(1, 'Debe ser entre 1 y 31')
    .max(31, 'Debe ser entre 1 y 31')
    .default(1),
  is_payment_enabled: z.boolean().default(false),
  
  // Usuarios
  owners: z.array(z.string()).optional(),
  residents: z.array(z.string()).optional(),
  visitors: z.array(z.string()).optional()
})

const createSchema = baseSchema
const editSchema = baseSchema

// Componente de búsqueda de usuarios por email
const UserSearchSelect = ({ 
  role, 
  selectedUsers, 
  onSelectionChange, 
  allUsers,
  label 
}: { 
  role: string
  selectedUsers: string[]
  onSelectionChange: (users: string[]) => void
  allUsers: User[] | undefined
  label: string
}) => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue, 300)
  
  const filteredUsers = allUsers?.filter(user => 
    user.role === role && 
    (user.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
     user.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
  ) || []
  
  const selectedUserDetails = allUsers?.filter(user => selectedUsers.includes(user.id)) || []
  
  const handleSelect = (userId: string) => {
    const newSelection = selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId]
    onSelectionChange(newSelection)
  }
  
  const removeUser = (userId: string) => {
    onSelectionChange(selectedUsers.filter(id => id !== userId))
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <FormLabel>{label}</FormLabel>
        <span className="text-sm text-muted-foreground">
          {filteredUsers.length} disponibles
        </span>
      </div>
      
      {/* Usuarios seleccionados */}
      {selectedUserDetails.length > 0 && (
        <div className="mb-3 space-y-2">
          {selectedUserDetails.map(user => (
            <div key={user.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeUser(user.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Selector de búsqueda */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Buscar por email...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder={`Buscar ${label.toLowerCase()}...`}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.email}
                    onSelect={() => handleSelect(user.id)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="flex gap-1 mt-1">
                        <Badge variant={user.is_active ? 'default' : 'outline'} className="text-xs">
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge variant={user.app_enabled ? 'default' : 'secondary'} className="text-xs">
                          {user.app_enabled ? 'App Habilitada' : 'App Deshabilitada'}
                        </Badge>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Componente para crear usuario rápidamente
const UserQuickCreateModal = ({ onUserCreated }: { onUserCreated: (user: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const { createResource: createUser, isMutating } = useCreateResource<User>({ endpoint: ENDPOINTS.RESIDENT })
  
  // Roles que usan contraseña automática (CI)
  const RESIDENTIAL_ROLES = [PERMISSION.RESIDENT, PERMISSION.OWNER, PERMISSION.VISITOR]
  
  // Función para determinar si se requiere contraseña manual
  const requiresManualPassword = (role: string): boolean => {
    return !RESIDENTIAL_ROLES.includes(role as PERMISSION)
  }

  const userForm = useForm({
    resolver: zodResolver(z.object({
      name: z.string().min(3, 'Mínimo 3 caracteres'),
      email: z.string().email('Email inválido'),
      ci: z.number().min(1, 'CI requerido'),
      phone: z.number().optional(),
      role: z.string().min(1, 'Rol requerido'),
      password: z.string().optional()
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
    })),
    defaultValues: {
      name: '',
      email: '',
      ci: 0,
      phone: 0,
      role: '',
      password: ''
    }
  })
  
  // Observar cambios en el campo role
  const watchedRole = userForm.watch('role')
  
  // Actualizar el estado cuando cambie el rol
  useEffect(() => {
    if (watchedRole !== selectedRole) {
      setSelectedRole(watchedRole)
      // Limpiar contraseña si es un rol residencial
      if (!requiresManualPassword(watchedRole)) {
        userForm.setValue('password', '')
      }
    }
  }, [watchedRole, selectedRole, userForm])

  const handleCreateUser = (data: any) => {
    // Para roles residenciales, no enviar contraseña
    const submitData = { ...data }
    if (!requiresManualPassword(data.role)) {
      delete submitData.password
    }
    
    toast.promise(createUser(submitData), {
      loading: 'Creando usuario...',
      success: () => {
        setIsOpen(false)
        userForm.reset()
        onUserCreated(submitData)
        return 'Usuario creado exitosamente'
      },
      error: (error) => error.errorMessages[0] ?? 'Error al crear usuario'
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Crear Usuario
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear Nuevo Usuario</AlertDialogTitle>
          <AlertDialogDescription>
            Crea un usuario rápidamente para asignarlo a la propiedad
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...userForm}>
          <form onSubmit={userForm.handleSubmit(handleCreateUser)} className="space-y-4">
            <FormField
              control={userForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="ci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CI</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="12345678"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
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
            
            {/* Mensaje informativo para roles residenciales - SIEMPRE mostrar para estos roles */}
            {!requiresManualPassword(selectedRole || watchedRole) && (selectedRole || watchedRole) && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Contraseña automática:</strong> Para este rol, se utilizará automáticamente el número de carnet como contraseña.
                </p>
              </div>
            )}
            
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
              <AlertDialogAction type="submit" disabled={isMutating}>
                {isMutating ? 'Creando...' : 'Crear Usuario'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const PropertyFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Propiedades', path: PrivateRoutes.PROPERTY },
    { label: title }
  ])
  
  const { id } = useParams()
  const navigate = useNavigate()
  const { createResource: createProperty, isMutating } = useCreateResource<CreateProperty>({ endpoint: ENDPOINTS.PROPERTY })
  const { updateResource: updateProperty } = useUpdateResource<CreateProperty & { id: string }>(ENDPOINTS.PROPERTY, id)
  const { resource: property } = useGetResource<FormProperty>({ endpoint: ENDPOINTS.PROPERTY, id })
  const { allResource: allUsers } = useGetAllResource<User>({ endpoint: ENDPOINTS.RESIDENT, isPagination: false })

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(id ? editSchema : createSchema),
    values: {
      name: property?.name ?? '',
      address: property?.address ?? '',
      description: property?.description ?? '',
      
      // Identificación específica
      building_or_block: property?.building_or_block ?? '',
      property_number: property?.property_number ?? '',
      
      // Características físicas
      bedrooms: property?.bedrooms ?? 0,
      bathrooms: property?.bathrooms ?? 0,
      square_meters: property?.square_meters ?? 0,
      has_garage: property?.has_garage ?? false,
      garage_spaces: property?.garage_spaces ?? 0,
      has_yard: property?.has_yard ?? false,
      has_balcony: property?.has_balcony ?? false,
      has_terrace: property?.has_terrace ?? false,
      floor_number: property?.floor_number ?? 0,
      has_elevator: property?.has_elevator ?? false,
      furnished: property?.furnished ?? false,
      pets_allowed: property?.pets_allowed ?? true,
      
      // Sistema de pagos
      status: property?.status ?? PropertyStatus.AVAILABLE,
      monthly_payment: property?.monthly_payment ?? 0,
      payment_frequency: property?.payment_frequency ?? PaymentFrequency.MONTHLY,
      payment_due_day: property?.payment_due_day ?? 1,
      is_payment_enabled: property?.is_payment_enabled ?? false,
      
      // Usuarios - Ya vienen como IDs string desde la API
      owners: property?.owners ?? [],
      residents: property?.residents ?? [],
      visitors: property?.visitors ?? []
    }
  })
  
  type FormData = z.infer<typeof createSchema> | z.infer<typeof editSchema>

  const onSubmit = (data: FormData) => {
    if (id) {
      toast.promise(updateProperty({ id, ...data }), {
        loading: 'Actualizando...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.PROPERTY, { replace: true })
          }, 1000)
          return 'Propiedad actualizada exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar la propiedad'
        }
      })
    } else {
      toast.promise(createProperty({ ...data }), {
        loading: 'Creando...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.PROPERTY, { replace: true })
          }, 1000)
          return 'Propiedad creada exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear la propiedad'
        }
      })
    }
  }

  const handleUserCreated = () => {
    // Recargar la lista de usuarios
    window.location.reload()
  }

  return (
    <section className="grid flex-1 items-start gap-4 lg:gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
          <div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => { navigate(PrivateRoutes.PROPERTY) }}
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <h2 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {title}
              </h2>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button
                  type="button"
                  onClick={() => { navigate(PrivateRoutes.PROPERTY) }}
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
          
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
            {/* Información básica */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Propiedad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Apartamento 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección completa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="building_or_block"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Manzana/Edificio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: A, B, 1, 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="property_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Propiedad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 101, 201, A-1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="lg:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descripción de la propiedad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PropertyStatus.AVAILABLE}>Disponible</SelectItem>
                          <SelectItem value={PropertyStatus.RENTED}>Alquilada</SelectItem>
                          <SelectItem value={PropertyStatus.SOLD}>Vendida</SelectItem>
                          <SelectItem value={PropertyStatus.OWNED_AND_RENTED}>Propia y Alquilada</SelectItem>
                          <SelectItem value={PropertyStatus.UNDER_CONSTRUCTION}>En Construcción</SelectItem>
                          <SelectItem value={PropertyStatus.MAINTENANCE}>Mantenimiento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Características físicas */}
            <Card>
              <CardHeader>
                <CardTitle>Características Físicas</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dormitorios</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="0"
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
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Baños</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="0"
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
                  name="square_meters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metros Cuadrados</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="floor_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Piso</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="0"
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
                    name="garage_spaces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Espacios de Garage</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="0"
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="has_garage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tiene Garage</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="has_yard"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tiene Patio/Jardín</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="has_balcony"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tiene Balcón</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="has_terrace"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tiene Terraza</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="has_elevator"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Acceso a Ascensor</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="furnished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Amueblada</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="pets_allowed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Se Permiten Mascotas</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Información de pagos */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Pagos</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="monthly_payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pago Mensual ($)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
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
                  name="payment_frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frecuencia de Pago</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar frecuencia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PaymentFrequency.MONTHLY}>Mensual</SelectItem>
                          <SelectItem value={PaymentFrequency.QUARTERLY}>Trimestral</SelectItem>
                          <SelectItem value={PaymentFrequency.BIANNUAL}>Semestral</SelectItem>
                          <SelectItem value={PaymentFrequency.ANNUAL}>Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="payment_due_day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Día de Vencimiento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          max="31"
                          placeholder="1"
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
                  name="is_payment_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Habilitar cobro automático
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Asignación de usuarios */}
          <Card className="col-span-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Asignación de Usuarios</CardTitle>
                <UserQuickCreateModal onUserCreated={handleUserCreated} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-3">
              {/* Propietarios */}
              <FormField
                control={form.control}
                name="owners"
                render={({ field }) => (
                  <FormItem>
                    <UserSearchSelect
                      role="owner"
                      selectedUsers={field.value || []}
                      onSelectionChange={field.onChange}
                      allUsers={allUsers}
                      label="Propietarios"
                    />
                  </FormItem>
                )}
              />

              {/* Residentes */}
              <FormField
                control={form.control}
                name="residents"
                render={({ field }) => (
                  <FormItem>
                    <UserSearchSelect
                      role="resident"
                      selectedUsers={field.value || []}
                      onSelectionChange={field.onChange}
                      allUsers={allUsers}
                      label="Residentes"
                    />
                  </FormItem>
                )}
              />

              {/* Visitantes */}
              <FormField
                control={form.control}
                name="visitors"
                render={({ field }) => (
                  <FormItem>
                    <UserSearchSelect
                      role="visitor"
                      selectedUsers={field.value || []}
                      onSelectionChange={field.onChange}
                      allUsers={allUsers}
                      label="Visitantes"
                    />
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
              onClick={() => { navigate(PrivateRoutes.PROPERTY) }}
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

export default PropertyFormPage