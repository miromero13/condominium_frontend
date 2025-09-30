import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { CondominiumInfo, UpdateCondominiumInfoRequest } from '@/models/condominium.model'

const condominiumInfoSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  country: z.string().min(1, 'El país es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido').min(1, 'El email es requerido'),
  website: z.string().optional(),
  nit: z.string().min(1, 'El NIT es requerido'),
  registration_date: z.string().min(1, 'La fecha de registro es requerida'),
  description: z.string().min(1, 'La descripción es requerida'),
})

interface CondominiumInfoFormProps {
  initialData: CondominiumInfo
  onSubmit: (data: UpdateCondominiumInfoRequest) => Promise<boolean>
  isLoading: boolean
}

export const CondominiumInfoForm = ({
  initialData,
  onSubmit,
  isLoading
}: CondominiumInfoFormProps) => {
  const form = useForm<z.infer<typeof condominiumInfoSchema>>({
    resolver: zodResolver(condominiumInfoSchema),
    defaultValues: {
      name: initialData.name || '',
      address: initialData.address || '',
      city: initialData.city || '',
      country: initialData.country || '',
      phone: initialData.phone || '',
      email: initialData.email || '',
      website: initialData.website || '',
      nit: initialData.nit || '',
      registration_date: initialData.registration_date || '',
      description: initialData.description || '',
    }
  })

  const handleSubmit = async (values: z.infer<typeof condominiumInfoSchema>) => {
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Condominio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Condominio Los Robles" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Av. Principal 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. La Paz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Bolivia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción del condominio..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Contacto</h3>
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. +591 2 2345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="administracion@condominio.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitio Web (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="www.condominio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registration_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Registro</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Form>
  )
}