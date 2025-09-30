import { toast } from 'sonner'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeftIcon, Plus, Edit, Trash2, BookOpen, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useCreateResource, useDeleteResource, useGetResource } from '@/hooks/useApiResource'
import { ENDPOINTS, API_BASEURL } from '@/utils/api.utils'
import { type CommonAreaRule, type CreateCommonAreaRule } from '../../models/common-area-rule.model'
import { type CommonArea } from '../../models/common-area.model'
import { useHeader } from '@/hooks'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { getAllResource } from '@/services/crud.service'
import { type ApiResponse } from '@/services/crud.service'

const ruleSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(100),
  description: z.string().min(10, 'Mínimo 10 caracteres').max(500),
  is_active: z.boolean().default(true),
  priority: z.number().int().min(1).max(100).default(1),
})

const CommonAreaRulesPage = (): JSX.Element => {
  const { areaId } = useParams()
  const navigate = useNavigate()
  
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Áreas Comunes', path: PrivateRoutes.COMMON_AREA },
    { label: 'Reglamento del Área' }
  ])

  // Obtener información del área común
  const { resource: commonArea } = useGetResource<CommonArea>({ 
    endpoint: ENDPOINTS.COMMON_AREA, 
    id: areaId 
  })

  // Obtener reglas del área común con filtro por common_area_id usando useSWR directamente
  const rulesUrl = `${API_BASEURL}${ENDPOINTS.COMMON_AREA_RULE}?common_area_id=${areaId}`
  
  const { data: rulesResponse, isLoading, mutate } = useSWR<ApiResponse>(
    areaId ? rulesUrl : null, 
    getAllResource
  )

  // Extraer las reglas de la respuesta
  const filteredRules = (rulesResponse?.data as CommonAreaRule[]) || []

  const { createResource: createRule } = useCreateResource<CreateCommonAreaRule>({ 
    endpoint: ENDPOINTS.COMMON_AREA_RULE 
  })
  
  const { deleteResource: deleteRule } = useDeleteResource(ENDPOINTS.COMMON_AREA_RULE)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof ruleSchema>>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      title: '',
      description: '',
      is_active: true,
      priority: 1,
    }
  })

  const onSubmit = async (data: z.infer<typeof ruleSchema>) => {
    try {
      const ruleData = {
        ...data,
        common_area: areaId!
      }

      await createRule(ruleData)
      toast.success('Regla creada exitosamente')
      setIsDialogOpen(false)
      form.reset()
      void mutate()
    } catch (error: any) {
      toast.error(error.errorMessages?.[0] ?? 'Error al crear la regla')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteRule(id)
      toast.success('Regla eliminada exitosamente')
      void mutate()
    } catch (error: any) {
      toast.error(error.errorMessages?.[0] ?? 'Error al eliminar la regla')
    }
  }

  return (
    <section className="grid gap-4 overflow-hidden w-full relative">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={() => navigate(PrivateRoutes.COMMON_AREA)}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">Reglamento del Área</h1>
          {commonArea && (
            <p className="text-muted-foreground">{commonArea.name}</p>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Regla
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Regla</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título de la Regla</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Horarios de uso" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descripción detallada de la regla..."
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridad (1-100)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Regla Activa
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            La regla está vigente
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Regla</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Reglas del Área Común
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando reglas...
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay reglas definidas para esta área común.</p>
              <p className="text-sm">
                Agrega la primera regla usando el botón superior.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRules
                .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                .map((rule) => (
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
                          {rule.priority && (
                            <Badge variant="outline">
                              Prioridad {rule.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {rule.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // TODO: Implementar edición de reglas
                            toast.info('Funcionalidad de edición próximamente')
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(rule.id)}
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

export default CommonAreaRulesPage