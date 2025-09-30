import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, MoreHorizontal, PlusCircle, Search, Edit, Trash2, FileText, Calendar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useGetAllResource, useDeleteResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type CommonArea } from '../../models/common-area.model'
import { useHeader } from '@/hooks'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'

const CommonAreasPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Áreas Comunes' }
  ])
  
  const navigate = useNavigate()
  const { 
    allResource: allCommonAreas, 
    countData, 
    isLoading, 
    mutate, 
    filterOptions, 
    newPage, 
    prevPage, 
    setOffset, 
    search 
  } = useGetAllResource<CommonArea>({ endpoint: ENDPOINTS.COMMON_AREA, isPagination: true })
  
  const { deleteResource: deleteCommonArea } = useDeleteResource(ENDPOINTS.COMMON_AREA)
  const [searchTerm, setSearchTerm] = useState('')
  const debounceSearch = useDebounce(searchTerm, 1000)

  const handleDelete = (id: string) => {
    toast.promise(deleteCommonArea(id), {
      loading: 'Eliminando área común...',
      success: () => {
        void mutate()
        return 'Área común eliminada exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al eliminar área común'
      }
    })
  }

  useEffect(() => {
    search('name', debounceSearch)
  }, [debounceSearch])

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
              placeholder="Buscar áreas comunes..."
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
              onChange={(e) => { setSearchTerm(e.target.value) }}
            />
          </div>
        </form>
        
        <Button 
          onClick={() => { navigate(PrivateRoutes.COMMON_AREA_CREATE) }} 
          size="sm" 
          className="h-8 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Agregar Área</span>
        </Button>
      </div>

      <Card x-chunk="dashboard-06-chunk-0" className='flex flex-col overflow-hidden w-full relative'>
        <CardHeader>
          <CardTitle>Áreas Comunes</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Reservable</TableHead>
                  <TableHead>Precio/Hora</TableHead>
                  <TableHead>Horarios</TableHead>
                  <TableHead><span className='sr-only'>Acciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? <Skeleton rows={filterOptions.limit} columns={8} />
                  : allCommonAreas?.map((area: CommonArea) => (
                      <TableRow key={area.id}>
                        <TableCell className="font-medium">{area.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{area.description}</TableCell>
                        <TableCell>{area.capacity} personas</TableCell>
                        <TableCell>
                          <Badge variant={area.is_active ? 'default' : 'secondary'}>
                            {area.is_active ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={area.is_reservable ? 'default' : 'outline'}>
                            {area.is_reservable ? 'Sí' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {area.requires_payment 
                            ? `$${area.price_per_hour || 0}/hora` 
                            : 'Gratuita'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {area.operating_hours_start && area.operating_hours_end ? (
                              <div>{area.operating_hours_start} - {area.operating_hours_end}</div>
                            ) : (
                              <span className="text-muted-foreground">Sin horarios</span>
                            )}
                            {area.max_reservation_hours && (
                              <div className="text-muted-foreground">Máx: {area.max_reservation_hours}h</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => { navigate(`${PrivateRoutes.COMMON_AREA}/${area.id}`) }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => { navigate(`${PrivateRoutes.COMMON_AREA_RESERVATIONS.replace(':areaId', area.id)}`) }}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Gestionar Reservas
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => { navigate(`/areas-comunes/${area.id}/reglamento`) }}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Gestionar Reglamento
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => { handleDelete(area.id) }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
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
            currentItems={allCommonAreas?.length ?? 0}
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

export default CommonAreasPage