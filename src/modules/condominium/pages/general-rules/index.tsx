import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useDeleteResource, useGetAllResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils/api.utils'
import { type GeneralRule } from '../../models/general-rule.model'
import { useHeader } from '@/hooks'
import useDebounce from '@/hooks/useDebounce'


const GeneralRulesPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Reglamento General' }
  ])
  
  const navigate = useNavigate()
  
  // Usar hooks genéricos directamente
  const { 
    allResource: allGeneralRules, 
    isLoading, 
    mutate, 
    search 
  } = useGetAllResource<GeneralRule>({ 
    endpoint: ENDPOINTS.GENERAL_RULE, 
    isPagination: true 
  })
  
  const { deleteResource: deleteGeneralRule } = useDeleteResource(ENDPOINTS.GENERAL_RULE)
  
  const [searchTerm, setSearchTerm] = useState('')
  const debounceSearch = useDebounce(searchTerm, 1000)



  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la regla "${title}"?`)) {
      toast.promise(deleteGeneralRule(id), {
        loading: 'Eliminando regla...',
        success: () => {
          void mutate()
          return 'Regla eliminada exitosamente'
        },
        error(error) {
          return error.errorMessages?.[0] ?? 'Error al eliminar la regla'
        }
      })
    }
  }



  useEffect(() => {
    search('title', debounceSearch)
  }, [debounceSearch])

  return (
    <section className="grid gap-4 overflow-hidden w-full relative">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={() => navigate(PrivateRoutes.DASHBOARD)}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            Reglamento General del Condominio
          </h1>
          <p className="text-muted-foreground">
            Gestiona las reglas generales que aplican a todo el condominio
          </p>
        </div>

        <Button 
          onClick={() => navigate(PrivateRoutes.GENERAL_RULES_CREATE)}
          size="sm" 
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Regla
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <form
          className="flex-1"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar reglas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
            />
          </div>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Reglas Generales del Condominio
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando reglas...
            </div>
          ) : allGeneralRules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay reglas generales definidas.</p>
              <p className="text-sm">
                Agrega la primera regla usando el botón superior.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allGeneralRules.map((rule: GeneralRule) => (
                <div
                  key={rule.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{rule.title}</h3>
                        <Badge
                          variant={rule.is_active ? 'default' : 'secondary'}
                        >
                          {rule.is_active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {rule.description}
                      </p>
                      <div className="text-sm text-muted-foreground mt-2">
                        Creada el{' '}
                        {new Date(rule.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`${PrivateRoutes.GENERAL_RULES}/${rule.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(rule.id, rule.title)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export default GeneralRulesPage