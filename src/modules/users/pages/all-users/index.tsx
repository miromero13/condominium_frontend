import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, MoreHorizontal, PlusCircle, Search, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useDeleteAllUser, useGetAllUsers } from '../../hooks/useAllUsers'
import { type User } from '../../models/user.model'
import { useHeader } from '@/hooks'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { Badge } from '@/components/ui/badge'

const AllUsersPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Usuarios Generales' }
  ])
  
  const navigate = useNavigate()
  const { allUsers, countData, isLoading, mutate, filterOptions, newPage, prevPage, setOffset, search } = useGetAllUsers()
  const { deleteAllUser } = useDeleteAllUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchUser, setSearchUser] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const debounceSearchUser = useDebounce(searchUser, 1000)

  const deletePermanentlyUser = (id: string) => {
    toast.promise(deleteAllUser(id), {
      loading: 'Eliminando...',
      success: () => {
        void mutate()
        return 'Usuario eliminado exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al eliminar usuario'
      }
    })
    setIsDialogOpen(false)
  }

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id)
    setIsDialogOpen(true)
  }

  useEffect(() => {
    search('name', debounceSearchUser)
  }, [debounceSearchUser])

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      administrator: 'bg-red-100 text-red-800',
      guard: 'bg-blue-100 text-blue-800',
      owner: 'bg-green-100 text-green-800',
      resident: 'bg-yellow-100 text-yellow-800',
      visitor: 'bg-gray-100 text-gray-800'
    }
    
    const roleLabels: Record<string, string> = {
      administrator: 'Administrador',
      guard: 'Guardia',
      owner: 'Propietario',
      resident: 'Residente',
      visitor: 'Visitante'
    }

    return (
      <Badge className={`${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
        {roleLabels[role] || role}
      </Badge>
    )
  }

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
        
        <form className='py-1' onSubmit={(e) => { e.preventDefault() }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuario..."
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 xl:min-w-80"
              onChange={(e) => { setSearchUser(e.target.value) }}
            />
          </div>
        </form>
        
        <Button 
          onClick={() => { navigate(PrivateRoutes.ALL_USERS_CREATE) }} 
          size="sm" 
          className="h-8 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Agregar Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CI</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead><span className='sr-only'>Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? <Skeleton rows={filterOptions.limit} columns={7} />
                : allUsers?.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.ci}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'destructive'}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
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
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => { navigate(PrivateRoutes.ALL_USERS_EDIT.replace(':id', user.id)) }}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => { handleDeleteClick(user.id) }}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination
            allItems={countData ?? 0}
            currentItems={allUsers?.length ?? 0}
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

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el usuario seleccionado.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { deletePermanentlyUser(selectedUserId) }}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default AllUsersPage