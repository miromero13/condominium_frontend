import { toast } from 'sonner'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeftIcon, MoreHorizontal, PlusCircle, Trash, PawPrint } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import { useGetPetsByProperty, useDeletePet, useCreatePet } from '../../hooks/usePet'
import { useGetResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type Property } from '../../models/property.model'
import { type Pet } from '../../models/pet.model'
import { useHeader } from '@/hooks'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const petSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  species: z.string().min(1, 'La especie es requerida').max(50),
  breed: z.string().max(100).optional()
})

const PropertyPetsPage = (): JSX.Element => {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  
  const { resource: property } = useGetResource<Property>({ endpoint: ENDPOINTS.PROPERTY, id: propertyId })
  const { allResource: allPets, isLoading, mutate } = useGetPetsByProperty(propertyId)
  const { deleteResource: deletePet } = useDeletePet()
  const { createResource: createPet, isMutating } = useCreatePet()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Propiedades', path: PrivateRoutes.PROPERTY },
    { label: property?.name || 'Propiedad' },
    { label: 'Mascotas' }
  ])

  const form = useForm<z.infer<typeof petSchema>>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      species: '',
      breed: ''
    }
  })
  
  const deletePermanentlyPet = (id: string) => {
    toast.promise(deletePet(id), {
      loading: 'Eliminando...',
      success: () => {
        void mutate()
        return 'Mascota eliminada exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al eliminar la mascota'
      }
    })
    setIsDialogOpen(false)
  }

  const onSubmit = (data: z.infer<typeof petSchema>) => {
    if (!propertyId) return
    
    toast.promise(createPet({ ...data, property: propertyId }), {
      loading: 'Creando mascota...',
      success: () => {
        void mutate()
        setIsCreateDialogOpen(false)
        form.reset()
        return 'Mascota creada exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al crear la mascota'
      }
    })
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
          <PawPrint className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">
            Mascotas - {property?.name || 'Cargando...'}
          </h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1 ml-auto">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Agregar Mascota</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Mascota</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de la mascota" {...field} />
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
                      <FormLabel>Especie</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una especie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Perro">Perro</SelectItem>
                          <SelectItem value="Gato">Gato</SelectItem>
                          <SelectItem value="Ave">Ave</SelectItem>
                          <SelectItem value="Pez">Pez</SelectItem>
                          <SelectItem value="Hamster">Hamster</SelectItem>
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
                      <FormLabel>Raza (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Raza específica" {...field} />
                      </FormControl>
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
                    {isMutating ? 'Creando...' : 'Crear Mascota'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className='flex flex-col overflow-hidden w-full relative'>
        <CardHeader>
          <CardTitle>Mascotas Registradas</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Especie</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead><span className='sr-only'>Opciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? <Skeleton rows={5} columns={5} />
                  : allPets?.length === 0 
                    ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No hay mascotas registradas para esta propiedad
                        </TableCell>
                      </TableRow>
                    )
                    : allPets?.map((pet: Pet) => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium">{pet.name}</TableCell>
                        <TableCell>{pet.species}</TableCell>
                        <TableCell>{pet.breed || 'Sin especificar'}</TableCell>
                        <TableCell>{new Date(pet.created_at).toLocaleDateString()}</TableCell>
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
                                      <AlertDialogTitle>Eliminar mascota</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogDescription>
                                      Esta acción eliminará la mascota permanentemente. No se puede deshacer.
                                    </AlertDialogDescription>
                                    <AlertDialogDescription>
                                      ¿Estás seguro que deseas continuar?
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className='h-fit'>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction className='h-full' onClick={() => { deletePermanentlyPet(pet.id) }}>
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

export default PropertyPetsPage