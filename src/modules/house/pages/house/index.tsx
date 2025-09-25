import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, PlusCircle, Search, MoreHorizontal, Trash, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useGetAllHouses, useDeleteHouse } from '../../hooks/useHouse'
import { type House } from '../../models/house.model'
import { useHeader } from '@/hooks'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'

const HousePage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Viviendas' }
  ])

  const navigate = useNavigate()
  const { allHouses, countData, isLoading, mutate, filterOptions, newPage, prevPage, setOffset, search } = useGetAllHouses()
  const { deleteHouse } = useDeleteHouse()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const debounceSearch = useDebounce(searchTerm, 1000)

  const handleDelete = (id: string) => {
    toast.promise(deleteHouse(id), {
      loading: 'Eliminando...',
      success: () => {
        void mutate()
        return 'Vivienda eliminada exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al eliminar'
      }
    })
  }

  useEffect(() => {
    search('name', debounceSearch) // Campo por el que buscar
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
        </Button>

        <form className='py-1' onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar vivienda"
              className="w-full bg-background pl-8 h-8 ring-0 outline-none shadow-none xl:min-w-80"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        <Button 
          onClick={() => navigate(PrivateRoutes.HOUSE_CREATE)} 
          size="sm" 
          className="h-8 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Agregar Vivienda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Viviendas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Superficie (m²)</TableHead>
                <TableHead>Habitaciones</TableHead>
                <TableHead>Baños</TableHead>
                <TableHead>Precio Base</TableHead>
                <TableHead>Foto URL</TableHead>
                <TableHead><span className='sr-only'>Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? <Skeleton rows={filterOptions.limit} columns={6} />
                : allHouses?.map((item: House) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.area}</TableCell>
                        <TableCell>{item.nro_rooms}</TableCell>
                        <TableCell>{item.nro_bathrooms}</TableCell>
                        <TableCell>
                          {item.price_base ? `${parseFloat(item.price_base).toLocaleString()} Bs` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {item.foto_url ? (
                            <a 
                              href={item.foto_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm"
                            >
                              Ver imagen
                            </a>
                          ) : 'N/A'}
                        </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel className='font-bold'>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => { navigate(`${PrivateRoutes.HOUSE}/${item.id}`)  }}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <AlertDialogTrigger asChild>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      width: '100%',
                                      justifyContent: 'space-between'
                                    }}
                                    onClick={(event) => { event.stopPropagation() }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <Trash className="mr-2 h-4 w-4" />
                                      Eliminar
                                    </div>
                                  </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro de eliminar esta vivienda?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente la
                                      vivienda y todos sus datos asociados.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>Continuar</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='w-full'>
          <Pagination
            allItems={countData ?? 0}
            currentItems={allHouses?.length ?? 0}
            limit={filterOptions.limit}
            newPage={() => newPage(countData ?? 0)}
            offset={filterOptions.offset}
            prevPage={prevPage}
            setOffset={setOffset}
            setLimit={() => {}}
            params={true}
          />
        </CardFooter>
      </Card>
    </section>
  )
}

export default HousePage
