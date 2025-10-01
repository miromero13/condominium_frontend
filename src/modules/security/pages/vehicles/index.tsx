import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, Search, Car, MapPin, Palette } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useHeader } from '@/hooks'
import useDebounce from '@/hooks/useDebounce'
import { PrivateRoutes } from '@/models'
import { useGetAllVehicles } from '../../hooks/useSecurity'

const VehiclesPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Vehículos Registrados' }
  ])

  const navigate = useNavigate()
  const { 
    allVehicles, 
    countData, 
    isLoading,
    filterOptions, 
    newPage, 
    prevPage, 
    search, 
    setOffset 
  } = useGetAllVehicles()
  
  const [searchTerm, setSearchTerm] = useState('')
  const debounceSearch = useDebounce(searchTerm, 1000)

  useEffect(() => {
    search('plate', debounceSearch)
  }, [debounceSearch])

  const getVehicleTypeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'AUTO': 'bg-blue-100 text-blue-800',
      'MOTOCICLETA': 'bg-green-100 text-green-800',
      'CAMIONETA': 'bg-purple-100 text-purple-800',
      'BICICLETA': 'bg-orange-100 text-orange-800'
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800'
  }

  return (
    <section className="grid gap-4 overflow-hidden w-full relative">
      {/* Header */}
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
              placeholder="Buscar por placa..."
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 xl:min-w-80"
              onChange={(e) => { setSearchTerm(e.target.value) }}
            />
          </div>
        </form>
        
        <div className="ml-auto">
          <p className="text-sm text-muted-foreground">
            {countData} vehículos registrados
          </p>
        </div>
      </div>

      {/* Tabla de Vehículos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehículos Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Propiedad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? <Skeleton rows={filterOptions.limit} columns={5} />
                : allVehicles?.map((vehicle: any) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-mono font-bold text-lg">
                        {vehicle.plate}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {vehicle.brand} {vehicle.model}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {vehicle.color}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getVehicleTypeColor(vehicle.type_vehicle)}>
                          {vehicle.type_vehicle}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {vehicle.property_name || 'Sin asignar'}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={vehicle.activo ? 'default' : 'secondary'}>
                          {vehicle.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination
            allItems={countData ?? 0}
            currentItems={allVehicles?.length ?? 0}
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

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countData || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autos</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allVehicles?.filter((v: any) => v.tipo === 'AUTO').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Motocicletas</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allVehicles?.filter((v: any) => v.tipo === 'MOTOCICLETA').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camionetas</CardTitle>
            <Car className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allVehicles?.filter((v: any) => v.tipo === 'CAMIONETA').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default VehiclesPage