import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Search, 
  Filter,
  CalendarDays,
  CreditCard,
  AlertCircle
} from 'lucide-react'
import { useGetAllQuotes, useMarkQuotesAsPaid, useMarkSingleQuoteAsPaid, useDeleteQuote } from '../../hooks'
import { type Quote, QuoteStatus } from '../../models'

export default function QuoteListPage() {
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | 'ALL'>('ALL')
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString())
  
  const {
    allQuotes,
    countData,
    isLoading,
    error,
    mutate,
    search,
    filterOptions,
    newPage,
    prevPage
  } = useGetAllQuotes()

  const { markQuotesAsPaid, isMutating: isMarkingPaid } = useMarkQuotesAsPaid()
  const { markSingleQuoteAsPaid, isMutating: isMarkingSinglePaid } = useMarkSingleQuoteAsPaid()
  const { deleteQuote, isMutating: isDeleting } = useDeleteQuote()

  // Utilidades para mostrar datos
  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case QuoteStatus.PAID:
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case QuoteStatus.OVERDUE:
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      case QuoteStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.PENDING:
        return 'Pendiente'
      case QuoteStatus.PAID:
        return 'Pagada'
      case QuoteStatus.OVERDUE:
        return 'Vencida'
      case QuoteStatus.CANCELLED:
        return 'Cancelada'
      default:
        return status
    }
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL')
  }

  // Handlers
  const handleSelectQuote = (quoteId: string, checked: boolean) => {
    if (checked) {
      setSelectedQuotes([...selectedQuotes, quoteId])
    } else {
      setSelectedQuotes(selectedQuotes.filter(id => id !== quoteId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuotes(allQuotes.map((quote: Quote) => quote.id))
    } else {
      setSelectedQuotes([])
    }
  }

  const handleMarkAsPaid = async () => {
    if (selectedQuotes.length === 0) return
    
    try {
      await markQuotesAsPaid({ 
        quote_ids: selectedQuotes, // Los IDs son UUIDs (strings), no need to parseInt
        payment_date: new Date().toISOString().split('T')[0] // Solo fecha YYYY-MM-DD
      })
      setSelectedQuotes([])
      mutate()
    } catch (error) {
      console.error('Error marking quotes as paid:', error)
    }
  }

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta cuota?')) return
    
    try {
      await deleteQuote(quoteId)
      mutate()
    } catch (error) {
      console.error('Error deleting quote:', error)
    }
  }

  const handleMarkSingleQuoteAsPaid = async (quoteId: string) => {
    if (!confirm('¿Marcar esta cuota como pagada?')) return
    
    try {
      await markSingleQuoteAsPaid({ 
        id: quoteId,
        payment_date: new Date().toISOString().split('T')[0]
      })
      mutate()
    } catch (error) {
      console.error('Error marking quote as paid:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cuotas</h1>
          <p className="text-muted-foreground">
            Gestiona las cuotas del condominio
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to="/cuotas/cuotas/generar">
              <CalendarDays className="mr-2 h-4 w-4" />
              Auto-generar
            </Link>
          </Button>
          <Button asChild>
            <Link to="/cuotas/cuotas/crear">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cuota
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Casa, residente..."
                  className="pl-8"
                  value={filterOptions.value || ''}
                  onChange={(e) => search('search', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={filterStatus} onValueChange={(value: QuoteStatus | 'ALL') => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  <SelectItem value={QuoteStatus.PENDING}>Pendiente</SelectItem>
                  <SelectItem value={QuoteStatus.PAID}>Pagada</SelectItem>
                  <SelectItem value={QuoteStatus.OVERDUE}>Vencida</SelectItem>
                  <SelectItem value={QuoteStatus.CANCELLED}>Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedQuotes.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedQuotes.length} cuota{selectedQuotes.length > 1 ? 's' : ''} seleccionada{selectedQuotes.length > 1 ? 's' : ''}
              </span>
              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={handleMarkAsPaid}
                  disabled={isMarkingPaid}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marcar como pagadas
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedQuotes([])}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Cuotas</CardTitle>
          <CardDescription>
            {countData} cuotas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="text-sm text-muted-foreground">Cargando...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-6">
              <div className="text-sm text-red-500">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Error al cargar las cuotas
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedQuotes.length === allQuotes.length && allQuotes.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Casa</TableHead>
                  <TableHead>Residente</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allQuotes.map((quote: Quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedQuotes.includes(quote.id)}
                        onCheckedChange={(checked: boolean) => handleSelectQuote(quote.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {quote.house_user_info?.house?.code || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {quote.house_user_info?.user?.first_name} {quote.house_user_info?.user?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quote.house_user_info?.type_house}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {quote.period_month ? 
                        `${quote.period_month}/${quote.period_year}` : 
                        quote.period_year
                      }
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(quote.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{formatDate(quote.due_date)}</div>
                        {quote.is_overdue && (
                          <Badge variant="destructive" className="text-xs">
                            Vencida
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quote.status)}>
                        {getStatusText(quote.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {quote.payment_method?.name ? (
                          <>
                            <CreditCard className="h-4 w-4" />
                            <span className="text-sm">{quote.payment_method.name}</span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin asignar</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/cuotas/cuotas/${quote.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/cuotas/cuotas/${quote.id}/editar`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          {quote.status === QuoteStatus.PENDING && (
                            <DropdownMenuItem
                              onClick={() => handleMarkSingleQuoteAsPaid(quote.id)}
                              disabled={isMarkingSinglePaid}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Marcar pagada
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteQuote(quote.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {allQuotes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No se encontraron cuotas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {countData > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {Math.min(filterOptions.limit, allQuotes.length)} de {countData} cuotas
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={filterOptions.offset === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => newPage(countData)}
              disabled={filterOptions.offset + filterOptions.limit >= countData}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}