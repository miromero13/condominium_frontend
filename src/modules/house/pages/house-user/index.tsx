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
import { Badge } from '@/components/ui/badge'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useGetAllHouseUsers, useDeleteHouseUser } from '../../hooks/useHouseUser'
import { type HouseUser } from '../../models/house-user.model'
import { useHeader } from '@/hooks'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'

const HouseUserPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Gestión de Viviendas', path: PrivateRoutes.HOUSE },
    { label: 'Usuario-Vivienda' }
  ])

  const navigate = useNavigate()
  const { allHouseUsers, countData, isLoading, mutate, filterOptions, newPage, prevPage, setOffset, search } = useGetAllHouseUsers()
  const { deleteHouseUser } = useDeleteHouseUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const debounceSearch = useDebounce(searchTerm, 1000)

  const handleDelete = (id: string) => {
    toast.promise(deleteHouseUser(id), {
      loading: 'Eliminando...',
      success: () => {
        void mutate()
        return 'Usuario-Vivienda eliminado exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al eliminar'
      }
    })
  }

  useEffect(() => {
    search('house__code', debounceSearch) // Buscar por código de vivienda
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
              placeholder="Buscar usuario-vivienda"
              className="w-full bg-background pl-8 h-8 ring-0 outline-none shadow-none xl:min-w-80"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        <Button 
          onClick={() => navigate(PrivateRoutes.HOUSE_USER_CREATE)} 
          size="sm" 
          className="h-8 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Agregar Usuario-Vivienda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuario-Vivienda</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vivienda</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Es Principal</TableHead>
                  <TableHead>Fecha Inicial</TableHead>
                  <TableHead>Fecha Final</TableHead>
                  <TableHead>Responsabilidad Económica</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allHouseUsers.map((houseUser: HouseUser) => (
                  <TableRow key={houseUser.id}>
                    <TableCell className="font-medium">
                      {houseUser.house.code}
                    </TableCell>
                    <TableCell>
                      {houseUser.user?.name || 'Sin usuario'}
                    </TableCell>
                    <TableCell>
                        <Badge variant={houseUser.type_house === 'OWNER' ? 'default' : 'secondary'}>
                            {houseUser.type_house === 'OWNER' ? 'Propietario' : houseUser.type_house === 'RESIDENT' ? 'Inquilino' : houseUser.type_house_display}
                        </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={houseUser.is_principal ? 'default' : 'secondary'}>
                        {houseUser.is_principal ? 'Sí' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(houseUser.inicial_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {houseUser.end_date ? new Date(houseUser.end_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {houseUser.price_responsibility || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`${PrivateRoutes.HOUSE_USER_EDIT.replace(':id', houseUser.id)}`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la relación usuario-vivienda.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(houseUser.id)}>
                                  Continuar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              {countData > 0 ? (
                <>
                  Mostrando {filterOptions.offset + 1} a {Math.min(filterOptions.offset + filterOptions.limit, countData)} de {countData} entradas
                </>
              ) : (
                'No hay datos disponibles'
              )}
            </div>
            <Pagination
              allItems={countData ?? 0}
              currentItems={allHouseUsers?.length ?? 0}
              limit={filterOptions.limit}
              newPage={() => newPage(countData ?? 0)}
              offset={filterOptions.offset}
              prevPage={prevPage}
              setOffset={setOffset}
              setLimit={() => {}}
              params={true}
            />
          </div>
        </CardFooter>
      </Card>
    </section>
  )
}

export default HouseUserPage