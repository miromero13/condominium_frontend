import { toast } from 'sonner'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeftIcon, MoreHorizontal, PlusCircle, Trash, Car } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import { useGetVehiclesByProperty, useDeleteVehicle, useCreateVehicle } from '../../hooks/useVehicle'
import { useGetResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type Property } from '../../models/property.model'
import { type Vehicle } from '../../models/vehicle.model'
import { useHeader } from '@/hooks'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'

const vehicleSchema = z.object({
  plate: z.string().min(1, 'La placa es requerida').max(20),
  brand: z.string().min(1, 'La marca es requerida').max(50),
  model: z.string().min(1, 'El modelo es requerido').max(50),
  color: z.string().min(1, 'El color es requerido').max(30),
  type_vehicle: z.string().min(1, 'El tipo de vehículo es requerido')
})

const PropertyVehiclesPage = (): JSX.Element => {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  
  const { resource: property } = useGetResource<Property>({ endpoint: ENDPOINTS.PROPERTY, id: propertyId })
  const { allResource: allVehicles, isLoading, mutate } = useGetVehiclesByProperty(propertyId)
  const { deleteResource: deleteVehicle } = useDeleteVehicle()
  const { createResource: createVehicle, isMutating } = useCreateVehicle()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Propiedades', path: PrivateRoutes.PROPERTY },
    { label: property?.name || 'Propiedad' },
    { label: 'Vehículos' }
  ])

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate: '',
      brand: '',
      model: '',
      color: '',
      type_vehicle: ''
    }
  })
  
  const deletePermanentlyVehicle = (id: string) => {
    toast.promise(deleteVehicle(id), {
      loading: 'Eliminando...',
      success: () => {
        void mutate()
        return 'Vehículo eliminado exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al eliminar el vehículo'
      }
    })
    setIsDialogOpen(false)
  }

  const onSubmit = (data: z.infer<typeof vehicleSchema>) => {
    if (!propertyId) return
    
    toast.promise(createVehicle({ ...data, property: propertyId }), {
      loading: 'Creando vehículo...',
      success: () => {
        void mutate()
        setIsCreateDialogOpen(false)
        form.reset()
        return 'Vehículo creado exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al crear el vehículo'
      }
    })
  }

  const getVehicleTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'sedan': 'Sedán',
      'suv': 'SUV',
      'pickup': 'Pickup',
      'hatchback': 'Hatchback',
      'motorcycle': 'Motocicleta',
      'truck': 'Camión',
      'van': 'Van',
      'coupe': 'Coupé',
      'convertible': 'Convertible'
    }
    return types[type] || type
  }

  return (
    <section className='grid gap-4 overflow-hidden w-full relative'>
      <div className="inline-flex items-center flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => { navigate(PrivateRoutes.PROPERTY) }}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">
            Vehículos - {property?.name || 'Cargando...'}
          </h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1 ml-auto">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Agregar Vehículo</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC-123" {...field} />
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
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota, Honda, etc." {...field} />
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
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Corolla, Civic, etc." {...field} />
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
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Blanco, Negro, Azul, etc." {...field} />
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
                      <FormLabel>Tipo de Vehículo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedan">Sedán</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="hatchback">Hatchback</SelectItem>
                          <SelectItem value="motorcycle">Motocicleta</SelectItem>
                          <SelectItem value="truck">Camión</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="coupe">Coupé</SelectItem>
                          <SelectItem value="convertible">Convertible</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isMutating}>
                    {isMutating ? 'Creando...' : 'Crear Vehículo'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className='flex flex-col overflow-hidden w-full relative'>
        <CardHeader>
          <CardTitle>Vehículos Registrados</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead><span className='sr-only'>Opciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? <Skeleton rows={5} columns={7} />
                  : allVehicles?.length === 0 
                    ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No hay vehículos registrados para esta propiedad
                        </TableCell>
                      </TableRow>
                    )
                    : allVehicles?.map((vehicle: Vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium font-mono">{vehicle.plate}</TableCell>
                        <TableCell>{vehicle.brand}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.color}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getVehicleTypeLabel(vehicle.type_vehicle)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(vehicle.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu onOpenChange={() => { setIsDialogOpen(false) }}>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem className='p-0'>
                                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                  <AlertDialogTrigger asChild className='w-full px-2 py-1.5'>
                                    <div
                                      onClick={(event) => { event.stopPropagation() }}
                                      className="text-danger flex items-center"
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      Eliminar
                                    </div>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Eliminar vehículo</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogDescription>
                                      Esta acción eliminará el vehículo permanentemente. No se puede deshacer.
                                    </AlertDialogDescription>
                                    <AlertDialogDescription>
                                      ¿Estás seguro que deseas continuar?
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className='h-fit'>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction className='h-full' onClick={() => { deletePermanentlyVehicle(vehicle.id) }}>
                                        Continuar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default PropertyVehiclesPage