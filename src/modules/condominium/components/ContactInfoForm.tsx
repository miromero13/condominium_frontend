import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, User, Shield, Wrench } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { ContactInfo, UpdateAllContactsRequest } from '@/models/condominium.model'

const contactPersonSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido').min(1, 'El email es requerido'),
  position: z.string().min(1, 'El cargo es requerido'),
})

const contactInfoSchema = z.object({
  administrator: contactPersonSchema,
  security: contactPersonSchema,
  maintenance: contactPersonSchema,
})

interface ContactInfoFormProps {
  initialData: ContactInfo
  onSubmit: (data: UpdateAllContactsRequest) => Promise<boolean>
  isLoading: boolean
}

export const ContactInfoForm = ({
  initialData,
  onSubmit,
  isLoading
}: ContactInfoFormProps) => {
  const form = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      administrator: {
        name: initialData.administrator?.name || '',
        phone: initialData.administrator?.phone || '',
        email: initialData.administrator?.email || '',
        position: initialData.administrator?.position || '',
      },
      security: {
        name: initialData.security?.name || '',
        phone: initialData.security?.phone || '',
        email: initialData.security?.email || '',
        position: initialData.security?.position || '',
      },
      maintenance: {
        name: initialData.maintenance?.name || '',
        phone: initialData.maintenance?.phone || '',
        email: initialData.maintenance?.email || '',
        position: initialData.maintenance?.position || '',
      },
    }
  })

  const handleSubmit = async (values: z.infer<typeof contactInfoSchema>) => {
    await onSubmit(values)
  }

  const contactTypes = [
    {
      key: 'administrator' as const,
      title: 'Administrador',
      icon: User,
      description: 'Responsable de la administración general del condominio'
    },
    {
      key: 'security' as const,
      title: 'Seguridad',
      icon: Shield,
      description: 'Encargado de la seguridad y control de accesos'
    },
    {
      key: 'maintenance' as const,
      title: 'Mantenimiento',
      icon: Wrench,
      description: 'Responsable del mantenimiento y reparaciones'
    }
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {contactTypes.map(({ key, title, icon: Icon, description }) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`${key}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${key}.phone`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. +591 70123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${key}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="ejemplo@condominio.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${key}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Administrador General" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Todos los Contactos'}
          </Button>
        </div>
      </form>
    </Form>
  )
}