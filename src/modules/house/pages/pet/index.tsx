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
import { useGetAllPets, useDeletePet } from '../../hooks/usePet'
import { type Pet } from '../../models/pet.model'
import { useHeader } from '@/hooks'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'

const PetPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Gestión de Viviendas', path: PrivateRoutes.HOUSE },
    { label: 'Mascotas' }
  ])

  const navigate = useNavigate()
  const { allPets, countData, isLoading, mutate, filterOptions, newPage, prevPage, setOffset, search } = useGetAllPets()
  const { deletePet } = useDeletePet()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const debounceSearch = useDebounce(searchTerm, 1000)

  const handleDelete = (id: string) => {
    toast.promise(deletePet(id), {
      loading: 'Eliminando...',
      success: () => {
        void mutate()
        return 'Mascota eliminada exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al eliminar'
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
        </Button>

        <form className='py-1' onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar mascota"
              className="w-full bg-background pl-8 h-8 ring-0 outline-none shadow-none xl:min-w-80"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        <Button 
          onClick={() => navigate(PrivateRoutes.PET_CREATE)} 
          size="sm" 
          className="h-8 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Agregar Mascota
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Mascotas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Especie</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Vivienda</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPets.map((pet: Pet) => (
                  <TableRow key={pet.id}>
                    <TableCell className="font-medium">
                      {pet.name}
                    </TableCell>
                    <TableCell>
                      {pet.species}
                    </TableCell>
                    <TableCell>
                      {pet.breed || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {pet.house.code}
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
                          <DropdownMenuItem onClick={() => navigate(`${PrivateRoutes.PET_EDIT.replace(':id', pet.id)}`)}>
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la mascota.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(pet.id)}>
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
          <Pagination
            allItems={countData ?? 0}
            currentItems={allPets?.length ?? 0}
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

export default PetPage