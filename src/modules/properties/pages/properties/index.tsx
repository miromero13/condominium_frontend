import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ListFilter, MoreHorizontal, PlusCircle, Search, Trash, Edit, PawPrint, Car } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useGetAllResource, useDeleteResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type Property, PropertyStatus } from '../../models/property.model'
import { useHeader } from '@/hooks'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { Badge } from '@/components/ui/badge'

const PropertyPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Propiedades' }
  ])
  
  const navigate = useNavigate()
  const { allResource: allProperties, countData, isLoading, mutate, filterOptions, newPage, prevPage, setOffset, search } = useGetAllResource<Property>({ endpoint: ENDPOINTS.PROPERTY, isPagination: true })
  const { deleteResource: deleteProperty } = useDeleteResource(ENDPOINTS.PROPERTY)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchProperty, setSearchProperty] = useState('')
  const debounceSearchProperty = useDebounce(searchProperty, 1000)
  
  const deletePermanentlyProperty = (id: string) => {
    toast.promise(deleteProperty(id), {
      loading: 'Eliminando...',
      success: () => {
        void mutate()
        return 'Propiedad eliminada exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al eliminar la propiedad'
      }
    })
    setIsDialogOpen(false)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case PropertyStatus.AVAILABLE:
        return 'Disponible'
      case PropertyStatus.RENTED:
        return 'Alquilada'
      case PropertyStatus.SOLD:
        return 'Vendida'
      case PropertyStatus.OWNED_AND_RENTED:
        return 'Propia y Alquilada'
      case PropertyStatus.UNDER_CONSTRUCTION:
        return 'En Construcción'
      case PropertyStatus.MAINTENANCE:
        return 'Mantenimiento'
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case PropertyStatus.AVAILABLE:
        return 'default'
      case PropertyStatus.RENTED:
        return 'secondary'
      case PropertyStatus.SOLD:
        return 'outline'
      default:
        return 'default'
    }
  }

  useEffect(() => {
    search('name', debounceSearchProperty)
  }, [debounceSearchProperty])

  return (
    <section className='grid gap-4 overflow-hidden w-full relative'>
      <div className="inline-flex items-center flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => { navigate(-1) }}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        
        <form className='py-1' onSubmit={(e) => { e.preventDefault() }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar propiedades"
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
              onChange={(e) => { setSearchProperty(e.target.value) }}
            />
          </div>
        </form>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='ml-auto'>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <ListFilter className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Nombre</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Estado</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={() => { navigate(PrivateRoutes.PROPERTY_CREATE) }} size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Agregar Propiedad</span>
        </Button>
      </div>

      <Card x-chunk="dashboard-06-chunk-0" className='flex flex-col overflow-hidden w-full relative'>
        <CardHeader>
          <CardTitle>Todas las Propiedades</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Características</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago Mensual</TableHead>
                  <TableHead>Propietarios</TableHead>
                  <TableHead><span className='sr-only'>Opciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? <Skeleton rows={filterOptions.limit} columns={8} />
                  : allProperties?.map((property: Property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {property.building_or_block && (
                            <div className="font-medium">Manzana/Edif: {property.building_or_block}</div>
                          )}
                          {property.property_number && (
                            <div className="text-muted-foreground">N° {property.property_number}</div>
                          )}
                          {!property.building_or_block && !property.property_number && (
                            <span className="text-muted-foreground">Sin identificación</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{property.address}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{property.bedrooms} dorm, {property.bathrooms} baños</div>
                          {property.square_meters && (
                            <div className="text-muted-foreground">{property.square_meters}m²</div>
                          )}
                          <div className="flex gap-1 mt-1">
                            {property.has_garage && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Garage</span>}
                            {property.has_yard && <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Patio</span>}
                            {property.furnished && <span className="text-xs bg-purple-100 text-purple-800 px-1 rounded">Amueblada</span>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(property.status) as any}>
                          {getStatusLabel(property.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>${property.monthly_payment.toLocaleString()}</TableCell>
                      <TableCell>
                        {property.owners?.length > 0 
                          ? property.owners.map(owner => owner.name).join(', ')
                          : 'Sin propietarios'
                        }
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => { navigate(`${PrivateRoutes.PROPERTY}/${property.id}`) }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { navigate(`/propiedades/${property.id}/mascotas`) }}>
                              <PawPrint className="mr-2 h-4 w-4" />
                              Gestionar Mascotas
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { navigate(`/propiedades/${property.id}/vehiculos`) }}>
                              <Car className="mr-2 h-4 w-4" />
                              Gestionar Vehículos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
                                    <AlertDialogTitle>Eliminar propiedad</AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <AlertDialogDescription>
                                    Esta acción eliminará la propiedad permanentemente. No se puede deshacer.
                                  </AlertDialogDescription>
                                  <AlertDialogDescription>
                                    ¿Estás seguro que deseas continuar?
                                  </AlertDialogDescription>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className='h-fit'>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className='h-full' onClick={() => { deletePermanentlyProperty(property.id) }}>
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
        <CardFooter className='w-full'>
          <Pagination
            allItems={countData ?? 0}
            currentItems={allProperties?.length ?? 0}
            limit={filterOptions.limit}
            newPage={() => { newPage(countData ?? 0) }}
            offset={filterOptions.offset}
            prevPage={prevPage}
            setOffset={setOffset}
            setLimit={() => { }}
            params={true}
          />
        </CardFooter>
      </Card>
    </section>
  )
}

export default PropertyPage