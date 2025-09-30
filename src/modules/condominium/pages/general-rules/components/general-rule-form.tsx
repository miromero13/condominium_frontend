import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { PrivateRoutes } from '@/models/routes.model'
import { useCreateResource, useGetResource, useUpdateResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models/form-page.model'
import { type GeneralRule } from '../../../models/general-rule.model'

const baseSchema = z.object({
  title: z
    .string({ required_error: 'El título es requerido' })
    .min(3, 'Mínimo 3 caracteres')
    .max(200),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .min(10, 'Mínimo 10 caracteres')
    .max(1000),
  is_active: z.boolean().default(true),
})

const createSchema = baseSchema.extend({
  // Campos adicionales para crear si es necesario
})

const editSchema = baseSchema.extend({
  // Campos adicionales para editar si es necesario
})

const GeneralRuleFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Reglamento General', path: PrivateRoutes.GENERAL_RULES },
    { label: title }
  ])
  
  const { id } = useParams()
  const navigate = useNavigate()
  const { createResource: createGeneralRule, isMutating } = useCreateResource({ 
    endpoint: ENDPOINTS.GENERAL_RULE 
  })
  const { updateResource: updateGeneralRule } = useUpdateResource(ENDPOINTS.GENERAL_RULE, id)
  const { resource: generalRule } = useGetResource<GeneralRule>({ 
    endpoint: ENDPOINTS.GENERAL_RULE, 
    id 
  })

  const form = useForm<z.infer<typeof baseSchema | typeof createSchema>>({
    resolver: zodResolver(id ? editSchema : createSchema),
    values: {
      title: generalRule?.title ?? '',
      description: generalRule?.description ?? '',
      is_active: generalRule?.is_active ?? true,
    }
  })
  
  type FormData = z.infer<typeof createSchema> | z.infer<typeof editSchema>

  const onSubmit = (data: FormData) => {
    if (id) {
      toast.promise(updateGeneralRule(data), {
        loading: 'Actualizando regla...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.GENERAL_RULES, { replace: true })
          }, 1000)
          return 'Regla actualizada exitosamente'
        },
        error(error) {
          return error.errorMessages?.[0] ?? 'Error al actualizar la regla'
        }
      })
    } else {
      toast.promise(createGeneralRule(data), {
        loading: 'Creando regla...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.GENERAL_RULES, { replace: true })
          }, 1000)
          return 'Regla creada exitosamente'
        },
        error(error) {
          return error.errorMessages?.[0] ?? 'Error al crear la regla'
        }
      })
    }
  }

  return (
    <section className="grid flex-1 items-start gap-4 lg:gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
          <div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => { navigate(PrivateRoutes.GENERAL_RULES) }}
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <h2 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {title}
              </h2>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button
                  type="button"
                  onClick={() => { navigate(PrivateRoutes.GENERAL_RULES) }}
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={isMutating}>
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Datos de la Regla General</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la Regla</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Horarios de silencio" {...field} />
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
                        className="min-h-24"
                        {...field} 
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
                      <FormLabel className="text-base">Regla Activa</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        La regla está vigente y se aplica
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
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => { navigate(PrivateRoutes.GENERAL_RULES) }}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isMutating}>
              {buttonText}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default GeneralRuleFormPage