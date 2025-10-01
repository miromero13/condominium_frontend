import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, Search, History, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

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
import { useGetAllAccessHistory } from '../../hooks/useSecurity'

const HistoryPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Historial de Accesos' }
  ])

  const navigate = useNavigate()
  const { 
    allAccessHistory, 
    countData, 
    isLoading,
    filterOptions, 
    newPage, 
    prevPage, 
    search, 
    setOffset 
  } = useGetAllAccessHistory()
  
  const [searchTerm, setSearchTerm] = useState('')
  const debounceSearch = useDebounce(searchTerm, 1000)

  useEffect(() => {
    search('plate_detected', debounceSearch)
  }, [debounceSearch])

  const getAccessTypeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'ENTRADA': 'bg-green-100 text-green-800',
      'SALIDA': 'bg-blue-100 text-blue-800', 
      'DENEGADO': 'bg-red-100 text-red-800'
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800'
  }

  const getAccessTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'ENTRADA':
        return <CheckCircle className="h-4 w-4" />
      case 'SALIDA':
        return <AlertCircle className="h-4 w-4" />
      case 'DENEGADO':
        return <XCircle className="h-4 w-4" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getConfidenceColor = (confianza: number) => {
    if (confianza >= 0.8) return 'text-green-600'
    if (confianza >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
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
            {countData} registros encontrados
          </p>
        </div>
      </div>

      {/* Tabla de Historial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Detecciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Tipo Acceso</TableHead>
                <TableHead>Confianza</TableHead>
                <TableHead>Autorizado</TableHead>
                <TableHead>Vehículo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? <Skeleton rows={filterOptions.limit} columns={6} />
                : allAccessHistory?.length === 0 
                ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <History className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">No hay registros de acceso aún</p>
                        <p className="text-sm text-gray-400">
                          Los accesos aparecerán aquí cuando uses el detector de placas
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )
                : allAccessHistory?.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(record.fecha_acceso)}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="font-mono font-bold">
                        {record.plate_detected}
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getAccessTypeColor(record.tipo_acceso)}>
                          <div className="flex items-center gap-1">
                            {getAccessTypeIcon(record.tipo_acceso)}
                            {record.tipo_acceso}
                          </div>
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <span className={`font-medium ${getConfidenceColor(record.confianza)}`}>
                          {(record.confianza * 100).toFixed(1)}%
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={record.vehiculo_autorizado ? 'default' : 'destructive'}>
                          {record.vehiculo_autorizado ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {record.vehicle ? (
                          <div className="text-sm">
                            <p className="font-medium">
                              {record.vehicle.marca} {record.vehicle.modelo}
                            </p>
                            <p className="text-muted-foreground">
                              {record.vehicle.color}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No registrado
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination
            allItems={countData ?? 0}
            currentItems={allAccessHistory?.length ?? 0}
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

      {/* Estadísticas del día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hoy</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allAccessHistory?.filter((r: any) => {
                const today = new Date().toDateString()
                const recordDate = new Date(r.fecha_acceso).toDateString()
                return recordDate === today
              }).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allAccessHistory?.filter((r: any) => r.tipo_acceso === 'ENTRADA').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allAccessHistory?.filter((r: any) => r.tipo_acceso === 'SALIDA').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denegados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allAccessHistory?.filter((r: any) => r.tipo_acceso === 'DENEGADO').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default HistoryPage