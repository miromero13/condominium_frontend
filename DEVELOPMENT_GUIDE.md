# Guía de Desarrollo Frontend - SmartCondo

Esta guía detalla el flujo completo para desarrollar nuevas funcionalidades en el frontend de React/TypeScript, basándose en el patrón implementado en el módulo de usuarios.

## 📋 Índice

- [1. Arquitectura del Proyecto](#1-arquitectura-del-proyecto)
- [2. Estructura de Módulos](#2-estructura-de-módulos)
- [3. Flujo de Desarrollo](#3-flujo-de-desarrollo)
- [4. Sistema de Rutas](#4-sistema-de-rutas)
- [5. Navegación y Sidebar](#5-navegación-y-sidebar)
- [6. Hooks Genéricos (NO crear por módulo)](#6-hooks-genéricos-no-crear-por-módulo)
- [7. Servicios Genéricos (NO crear por módulo)](#7-servicios-genéricos-no-crear-por-módulo)
- [8. Modelos de Datos](#8-modelos-de-datos)
- [9. Configuración de APIs](#9-configuración-de-apis)
- [10. Páginas y Componentes](#10-páginas-y-componentes)
- [11. Hooks Específicos por Módulo](#11-hooks-específicos-por-módulo)
- [12. Servicios Específicos por Módulo](#12-servicios-específicos-por-módulo)
- [13. Permisos y Autorización](#13-permisos-y-autorización)
- [14. Formularios con Validación](#14-formularios-con-validación)
- [15. Estados y Data Fetching](#15-estados-y-data-fetching)
- [16. Checklist de Desarrollo](#16-checklist-de-desarrollo)

---

## 1. Arquitectura del Proyecto

El frontend sigue una arquitectura modular con patrones estandarizados:

```
src/
├── components/          # Componentes UI reutilizables
├── config/             # Configuración de la app
├── context/            # Context providers
├── hooks/              # 🚨 HOOKS GENÉRICOS (usar estos, NO crear por módulo)
├── services/           # 🚨 SERVICIOS GENÉRICOS (usar estos, NO crear por módulo)
├── layout/             # Layout principal y componentes
├── lib/                # Utilidades de terceros (shadcn)
├── models/             # Interfaces y tipos globales
├── modules/            # 📂 MÓDULOS DE FUNCIONALIDAD
│   ├── auth/
│   ├── users/          # Ejemplo de referencia
│   └── [nuevo_modulo]/
├── redux/              # Estado global (opcional)
├── routes/             # Configuración de rutas
├── styles/             # Estilos globales
└── utils/              # Utilidades globales
```

---

## 2. Estructura de Módulos

Cada módulo debe seguir exactamente esta estructura:

```
modules/nuevo_modulo/
├── hooks/              # Solo hooks específicos del módulo
├── models/             # Solo tipos/interfaces del módulo
├── pages/              # Páginas del módulo
├── services/           # Solo servicios específicos del módulo
└── utils/ (opcional)   # Utilidades específicas del módulo
```

### ❌ **IMPORTANTE - NO hacer:**
- NO crear `hooks/useApiResource.ts` en módulos
- NO crear `services/crud.service.ts` en módulos  
- NO duplicar funcionalidad que ya existe en `src/hooks/` o `src/services/`

### ✅ **Usar siempre:**
- `src/hooks/useApiResource.ts` para CRUD genérico
- `src/services/crud.service.ts` para operaciones HTTP
- Crear solo hooks específicos de negocio en `modules/[modulo]/hooks/`

---

## 3. Flujo de Desarrollo

Para cada nueva funcionalidad, sigue este orden:

1. **Definir Rutas** (`models/routes.model.ts`)
2. **Agregar Permisos** (`modules/auth/utils/permissions.constants.ts`)
3. **Configurar Sidebar** (`utils/sidebar.utils.ts`)
4. **Crear Modelo de Datos** (`modules/[modulo]/models/`)
5. **Agregar Endpoint** (`utils/api.utils.ts`)
6. **Crear Servicio Específico** (`modules/[modulo]/services/`)
7. **Crear Hook Específico** (`modules/[modulo]/hooks/`)
8. **Crear Páginas** (`modules/[modulo]/pages/`)
9. **Configurar Rutas del Módulo** (`routes/utils/`)
10. **Probar funcionalidad completa**

---

## 4. Sistema de Rutas

### 4.1 Definir Rutas: `models/routes.model.ts`

```typescript
export enum PrivateRoutes {
  DASHBOARD = '/',
  // users (ejemplo)
  USER = '/usuarios',
  USER_CREATE = '/usuarios/crear',
  USER_EDIT = '/usuarios/:id',
  
  // tu nuevo módulo
  TU_MODULO = '/tu-modulo',
  TU_MODULO_CREATE = '/tu-modulo/crear',
  TU_MODULO_EDIT = '/tu-modulo/:id',
}

export interface Route {
  path: PrivateRoutes | PublicRoutes | '/*'
  element: JSX.Element | JSX.Element[]
  permissions?: PERMISSION[]
}
```

### 4.2 Crear archivo de rutas: `routes/utils/tu-modulo.utils.ts`

```typescript
import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const TuModuloPage = lazy(() => import('@modules/tu-modulo/pages/tu-modulo'))
const TuModuloFormPage = lazy(() => import('@modules/tu-modulo/pages/tu-modulo/components/tu-modulo-form'))

export const tuModuloRoutes: Route[] = [
  {
    path: PrivateRoutes.TU_MODULO,
    element: createElement(TuModuloPage),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.TU_MODULO_CREATE,
    element: createElement(TuModuloFormPage, { 
      buttonText: 'Crear Item', 
      title: 'Crear Item' 
    }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  },
  {
    path: PrivateRoutes.TU_MODULO_EDIT,
    element: createElement(TuModuloFormPage, { 
      buttonText: 'Actualizar Item', 
      title: 'Editar Item' 
    }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
  }
]
```

### 4.3 Agregar a rutas principales: `routes/utils/routes.utils.ts`

```typescript
import { tuModuloRoutes } from './tu-modulo.utils'

export const PrivateAllRoutes: Route[] = [
  {
    path: '/*',
    element: createElement(NotFound),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.DASHBOARD,
    element: createElement(DashboardPage),
    permissions: [] as PERMISSION[]
  },
  ...userRoutes,
  ...tuModuloRoutes  // 👈 Agregar aquí
]
```

---

## 5. Navegación y Sidebar

### 5.1 Agregar al sidebar: `utils/sidebar.utils.ts`

```typescript
import { PrivateRoutes } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { User, UserCogIcon, TuIcono } from 'lucide-react'
import { createElement } from 'react'

export const MenuSideBar: MenuHeaderRoute[] = [
  {
    label: 'Gestion de Usuarios',
    icon: createElement(UserCogIcon, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[],
    children: [
      {
        label: 'Administrativos',
        icon: createElement(User, { width: 20, height: 20 }),
        path: PrivateRoutes.USER,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      }
    ]
  },
  // Tu nuevo módulo
  {
    label: 'Tu Módulo',
    icon: createElement(TuIcono, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[],
    children: [
      {
        label: 'Lista Items',
        icon: createElement(List, { width: 20, height: 20 }),
        path: PrivateRoutes.TU_MODULO,
        permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
      }
    ]
  }
]
```

### 5.2 Patterns del Sidebar:

**Opciones de estructura:**

```typescript
// 1. Menú simple (sin hijos)
{
  label: 'Dashboard',
  icon: createElement(HomeIcon, { width: 20, height: 20 }),
  path: PrivateRoutes.DASHBOARD,
  permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
}

// 2. Menú con hijos (recomendado)
{
  label: 'Gestión de X',
  icon: createElement(IconoPrincipal, { width: 20, height: 20 }),
  permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[],
  children: [
    {
      label: 'Lista X',
      icon: createElement(List, { width: 20, height: 20 }),
      path: PrivateRoutes.X,
      permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]
    }
  ]
}
```

---

## 6. Hooks Genéricos (NO crear por módulo)

### 🚨 **USAR ESTOS - Ya están creados en `src/hooks/`:**

```typescript
// src/hooks/useApiResource.ts - Para todas las operaciones CRUD
const useCreateResource = <TData>({ endpoint, query, isImage }: ParamResurce)
const useGetResource = <TData>({ endpoint, id, query }: ParamResurce)  
const useGetAllResource = <T>({ endpoint, isPagination }: ParamResurce)
const useUpdateResource = <TData>(endpoint: string, id?: string)
const useDeleteResource = (endpoint: string)

// Otros hooks genéricos disponibles:
// src/hooks/useAuth.ts          - Autenticación
// src/hooks/useAuthorization.ts - Permisos
// src/hooks/useDebounce.ts      - Debounce para búsquedas
// src/hooks/useFilterData.ts    - Filtros y paginación
// src/hooks/useHeader.ts        - Breadcrumbs
// src/hooks/useStorageTheme.ts  - Tema dark/light
```

### ✅ **Cómo usar en tu módulo:**

```typescript
// modules/tu-modulo/hooks/useTuModulo.ts
import { useCreateResource, useGetAllResource, useGetResource, useUpdateResource, useDeleteResource } from '@/hooks/useApiResource'

const useCreateTuModulo = () => {
  return useCreateResource<CreateTuModulo>({ endpoint: ENDPOINTS.TU_MODULO })
}

const useGetTuModulo = (id?: string) => {
  return useGetResource<TuModelo>({ endpoint: ENDPOINTS.TU_MODULO, id })
}

const useGetAllTuModulo = () => {
  return useGetAllResource<TuModelo>({ endpoint: ENDPOINTS.TU_MODULO, isPagination: true })
}

// Export con nombres específicos para tu módulo
export { 
  useCreateTuModulo as useCreateTuModulo,
  useGetTuModulo as useGetTuModulo,
  useGetAllTuModulo as useGetAllTuModulo,
  // etc...
}
```

---

## 7. Servicios Genéricos (NO crear por módulo)

### 🚨 **USAR ESTE - Ya está creado en `src/services/crud.service.ts`:**

```typescript
// src/services/crud.service.ts - Para todas las operaciones HTTP
const getAllResource = async <T>(url: string): Promise<ApiResponse<T[]>>
const getResource = async <T>(url: string): Promise<T>
const createResource = async <T>(url: string, { arg }: { arg: T }): Promise<void>
const createResourceWithImage = async <T>(url: string, { arg }: { arg: T }): Promise<void>
const updateResource = async <T>(url: string, { arg }: { arg: T }): Promise<void>
const deleteResource = async (url: string): Promise<void>
```

### ✅ **Crear servicios específicos usando el genérico:**

```typescript
// modules/tu-modulo/services/tu-modulo.service.ts
import { fetchData } from '@/utils'
import { type TuModelo, type CreateTuModelo, type UpdateTuModelo } from '../models/tu-modulo.model'
import { type ApiResponse } from '@/models'

const createTuModelo = async (url: string, { arg }: { arg: CreateTuModelo }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getTuModelo = async (url: string): Promise<TuModelo> => {
  const response = await fetchData(url)
  return response.data
}

const updateTuModelo = async (url: string, { arg }: { arg: UpdateTuModelo }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify({
      // Solo los campos que se pueden actualizar
      campo1: arg?.campo1,
      campo2: arg?.campo2,
    })
  }
  await fetchData(`${url}${arg.id}/`, options)
}

const getAllTuModelo = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as TuModelo[], countData: response.countData }
}

const deleteTuModelo = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}${id}/`, options)
}

export { createTuModelo, getAllTuModelo, getTuModelo, updateTuModelo, deleteTuModelo }
```

---

## 8. Modelos de Datos

### 8.1 Crear modelo: `modules/[modulo]/models/tu-modulo.model.ts`

```typescript
import { type ApiBase } from '@/models'

export interface TuModelo extends ApiBase {
  campo1: string
  campo2: number
  campo3: boolean
  // ... otros campos
}

export interface CreateTuModelo extends Partial<Omit<TuModelo, 'id' | 'created_at' | 'updated_at'>> {
  campo1: string  // campos requeridos
  campo2: number
}

export interface FormTuModelo extends Partial<TuModelo> {
  // Campos específicos para formularios
}

export interface UpdateTuModelo extends CreateTuModelo {
  id: string  // requerido para update
}
```

### 8.2 Base común: `models/api-base.ts`

```typescript
// Ya existe - USAR este
export interface ApiBase {
  id: string
  created_at: string
  updated_at: string
}
```

---

## 9. Configuración de APIs

### 9.1 Agregar endpoints: `utils/api.utils.ts`

```typescript
export const ENDPOINTS = {
  // auth
  API: '/api',
  LOGIN: '/api/auth/login-admin/',
  CHECK_TOKEN: '/api/auth/check-token/',
  
  // users (ejemplo)
  USER: '/api/users/',
  
  // tu módulo
  TU_MODULO: '/api/tu-modulo/',
}
```

### 9.2 Configuración base ya existe:

```typescript
// utils/api.utils.ts - YA EXISTE
export const API_BASEURL = AppConfig.API_URL

export const buildUrl = ({ 
  endpoint, 
  id = undefined, 
  query = undefined 
}: { 
  endpoint: string, 
  id?: string, 
  query?: string 
}) => {
  return `${API_BASEURL}${endpoint}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`
}
```

---

## 10. Páginas y Componentes

### 10.1 Estructura de páginas:

```
modules/tu-modulo/pages/
└── tu-modulo/
    ├── components/
    │   ├── tu-modulo-form.tsx    # Formulario crear/editar
    │   └── tu-modulo-table.tsx   # Tabla/lista (opcional)
    └── index.tsx                 # Página principal (lista)
```

### 10.2 Página principal (Lista): `modules/[modulo]/pages/[modulo]/index.tsx`

```tsx
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, MoreHorizontal, PlusCircle, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useDeleteTuModulo, useGetAllTuModulo } from '../../hooks/useTuModulo'
import { type TuModelo } from '../../models/tu-modulo.model'
import { useHeader } from '@/hooks'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'

const TuModuloPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Tu Módulo' }
  ])
  
  const navigate = useNavigate()
  const { 
    allTuModulos, 
    countData, 
    isLoading, 
    mutate, 
    filterOptions, 
    newPage, 
    prevPage, 
    setOffset, 
    search 
  } = useGetAllTuModulo()
  
  const { deleteTuModulo } = useDeleteTuModulo()
  const [searchTerm, setSearchTerm] = useState('')
  const debounceSearch = useDebounce(searchTerm, 1000)

  const handleDelete = (id: string) => {
    toast.promise(deleteTuModulo(id), {
      loading: 'Eliminando...',
      success: () => {
        void mutate()
        return 'Item eliminado exitosamente'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al eliminar'
      }
    })
  }

  useEffect(() => {
    search('campo1', debounceSearch)  // Campo por el que buscar
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
        
        <form className='py-1' onSubmit={(e) => { e.preventDefault() }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar"
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 xl:min-w-80"
              onChange={(e) => { setSearchTerm(e.target.value) }}
            />
          </div>
        </form>
        
        <Button 
          onClick={() => { navigate(PrivateRoutes.TU_MODULO_CREATE) }} 
          size="sm" 
          className="h-8 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Agregar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campo 1</TableHead>
                <TableHead>Campo 2</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead><span className='sr-only'>Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? <Skeleton rows={filterOptions.limit} columns={4} />
                : allTuModulos?.map((item: TuModelo) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.campo1}</TableCell>
                      <TableCell>{item.campo2}</TableCell>
                      <TableCell>
                        {/* Lógica de estado */}
                      </TableCell>
                      <TableCell>
                        {/* Menú de acciones */}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination
            allItems={countData ?? 0}
            currentItems={allTuModulos?.length ?? 0}
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
    </section>
  )
}

export default TuModuloPage
```

---

## 11. Hooks Específicos por Módulo

### Ubicación: `modules/[modulo]/hooks/useTuModulo.ts`

```typescript
import useSWRMutation from 'swr/mutation'
import { createTuModelo, deleteTuModelo, getAllTuModelo, getTuModelo, updateTuModelo } from '../services/tu-modulo.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type FormTuModelo, type CreateTuModelo, type UpdateTuModelo } from '../models/tu-modulo.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateTuModulo = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateTuModelo>(
    API_BASEURL + ENDPOINTS.TU_MODULO, 
    createTuModelo
  )
  return { createTuModulo: trigger, isMutating, error }
}

const useGetTuModulo = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<FormTuModelo, ResponseError>(
    id ? API_BASEURL + ENDPOINTS.TU_MODULO + `${id}/` : null, 
    getTuModelo
  )
  return { tuModelo: data, isLoading, error, isValidating }
}

const useGetAllTuModulo = () => {
  const { 
    changeOrder, 
    filterOptions, 
    newPage, 
    prevPage, 
    queryParams, 
    search, 
    setFilterOptions, 
    setOffset 
  } = useFilterData(filterStateDefault)
  
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(
    `${API_BASEURL + ENDPOINTS.TU_MODULO}?${queryParams}`, 
    getAllTuModelo
  )
  
  return { 
    allTuModulos: data?.data ?? [], 
    countData: data?.countData ?? 0, 
    error, 
    isLoading, 
    mutate, 
    changeOrder, 
    filterOptions, 
    newPage, 
    prevPage, 
    search, 
    setFilterOptions, 
    setOffset 
  }
}

const useUpdateTuModulo = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdateTuModelo>(
    API_BASEURL + ENDPOINTS.TU_MODULO, 
    updateTuModelo
  )
  return { updateTuModulo: trigger, isMutating, error }
}

const useDeleteTuModulo = () => {
  const { trigger, error, isMutating } = useSWRMutation<Promise<void>, ResponseError, string, string>(
    API_BASEURL + ENDPOINTS.TU_MODULO, 
    deleteTuModulo
  )
  return { deleteTuModulo: trigger, error, isMutating }
}

export { 
  useCreateTuModulo, 
  useGetAllTuModulo, 
  useGetTuModulo, 
  useUpdateTuModulo, 
  useDeleteTuModulo 
}
```

---

## 12. Servicios Específicos por Módulo

Ya mostrado en la sección 7 - seguir ese patrón exacto.

---

## 13. Permisos y Autorización

### 13.1 Definir permisos: `modules/auth/utils/permissions.constants.ts`

```typescript
export enum PERMISSION {
  ADMINISTRATOR = 'administrator',
  OWNER = 'owner',
  RESIDENT = 'resident',
  GUARD = 'guard',
  VISITOR = 'visitor',
  // Agregar nuevos permisos específicos si es necesario
}
```

### 13.2 Usar en rutas y componentes:

```typescript
// En rutas
permissions: [PERMISSION.ADMINISTRATOR] as PERMISSION[]

// En componentes  
const { verifyPermission } = useAuthorization()

if (verifyPermission([PERMISSION.ADMINISTRATOR])) {
  // Mostrar contenido
}
```

---

## 14. Formularios con Validación

### 14.1 Formulario con Zod: `modules/[modulo]/pages/[modulo]/components/tu-modulo-form.tsx`

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PrivateRoutes } from '@/models/routes.model'
import { useCreateTuModulo, useGetTuModulo, useUpdateTuModulo } from '@/modules/tu-modulo/hooks/useTuModulo'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'

const baseSchema = z.object({
  campo1: z
    .string({ required_error: 'Campo 1 es requerido' })
    .min(3, 'Mínimo 3 caracteres')
    .max(100),
  campo2: z
    .number({ required_error: 'Campo 2 es requerido' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo'),
})

const createSchema = baseSchema.extend({
  // Campos adicionales para crear
})

const editSchema = baseSchema.extend({
  // Campos adicionales para editar
})

const TuModuloFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Tu Módulo', path: PrivateRoutes.TU_MODULO },
    { label: title }
  ])
  
  const { id } = useParams()
  const navigate = useNavigate()
  const { createTuModulo, isMutating } = useCreateTuModulo()
  const { updateTuModulo } = useUpdateTuModulo()
  const { tuModelo } = useGetTuModulo(id)

  const form = useForm<z.infer<typeof baseSchema | typeof createSchema>>({
    resolver: zodResolver(id ? editSchema : createSchema),
    values: {
      campo1: tuModelo?.campo1 ?? '',
      campo2: tuModelo?.campo2 ?? 0,
    }
  })
  
  type FormData = z.infer<typeof createSchema> | z.infer<typeof editSchema>

  const onSubmit = (data: FormData) => {
    if (id) {
      toast.promise(updateTuModulo({ id, ...data }), {
        loading: 'Actualizando...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.TU_MODULO, { replace: true })
          }, 1000)
          return 'Item actualizado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar'
        }
      })
    } else {
      toast.promise(createTuModulo({ ...data }), {
        loading: 'Creando...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.TU_MODULO, { replace: true })
          }, 1000)
          return 'Item creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear'
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
                onClick={() => { navigate(PrivateRoutes.TU_MODULO) }}
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
                  onClick={() => { navigate(PrivateRoutes.TU_MODULO) }}
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
              <CardTitle>Datos del Item</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:gap-6">
              <FormField
                control={form.control}
                name="campo1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campo 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa campo 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="campo2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campo 2</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="123"
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
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
              onClick={() => { navigate(PrivateRoutes.TU_MODULO) }}
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

export default TuModuloFormPage
```

---

## 15. Estados y Data Fetching

### 15.1 Patrones de SWR:

```typescript
// Datos únicos
const { data, isLoading, error, mutate } = useSWR<DataType, ErrorType>(
  key, 
  fetcherFunction
)

// Mutaciones
const { trigger, isMutating, error } = useSWRMutation<ReturnType, ErrorType, KeyType, ArgType>(
  key, 
  mutationFunction
)
```

### 15.2 Estados de carga estándar:

```tsx
// En componentes
{isLoading 
  ? <Skeleton rows={filterOptions.limit} columns={4} />
  : data?.map((item) => (
      // Renderizar item
    ))
}

// Loading states
{isMutating ? 'Guardando...' : 'Guardar'}
```

---

## 16. Checklist de Desarrollo

### ✅ Al crear una nueva funcionalidad:

1. **Planificación**
   - [ ] ¿Qué endpoints necesito en el backend?
   - [ ] ¿Qué permisos requiere?
   - [ ] ¿Qué páginas necesito (lista, crear, editar)?
   - [ ] ¿Cómo se integra en el sidebar?

2. **Configuración Base**
   - [ ] Agregar rutas a `models/routes.model.ts`
   - [ ] Agregar permisos si es necesario en `permissions.constants.ts`
   - [ ] Agregar endpoint a `utils/api.utils.ts`
   - [ ] Agregar al sidebar en `utils/sidebar.utils.ts`

3. **Estructura del Módulo**
   - [ ] Crear directorio `modules/[modulo]/`
   - [ ] Crear subdirectorios: `hooks/`, `models/`, `pages/`, `services/`
   - [ ] NO crear hooks o servicios genéricos

4. **Modelos** (`models/tu-modulo.model.ts`)
   - [ ] Extiende `ApiBase` para el modelo principal
   - [ ] Define interfaces `Create`, `Update`, `Form`
   - [ ] Exporta todas las interfaces

5. **Servicios** (`services/tu-modulo.service.ts`)
   - [ ] Implementa CRUD usando `fetchData` de utils
   - [ ] Sigue el patrón del servicio de usuarios
   - [ ] Maneja responses y errores correctamente

6. **Hooks** (`hooks/useTuModulo.ts`)
   - [ ] Usa hooks genéricos de `src/hooks/useApiResource`
   - [ ] Implementa filtros y paginación con `useFilterData`
   - [ ] Export con nombres específicos del módulo

7. **Rutas** (`routes/utils/tu-modulo.utils.ts`)
   - [ ] Implementa lazy loading para componentes
   - [ ] Define permisos apropiados
   - [ ] Agrega a `routes.utils.ts`

8. **Páginas**
   - [ ] Página principal con tabla/lista
   - [ ] Formulario para crear/editar
   - [ ] Usa `useHeader` para breadcrumbs
   - [ ] Implementa búsqueda con `useDebounce`
   - [ ] Paginación con componente estándar

9. **Formularios**
   - [ ] Validación con Zod
   - [ ] React Hook Form con `zodResolver`
   - [ ] Estados de carga apropiados
   - [ ] Toast notifications para feedback
   - [ ] Navegación después de acciones

10. **UI/UX**
    - [ ] Usa componentes UI estándar de `components/ui/`
    - [ ] Skeleton loader para estados de carga
    - [ ] Mensajes de error apropiados
    - [ ] Responsive design
    - [ ] Icons de Lucide React

11. **Permisos y Autorización**
    - [ ] Verificar permisos en rutas
    - [ ] Usar `useAuthorization` en componentes
    - [ ] Ocultar/mostrar elementos según rol

12. **Testing**
    - [ ] Probar CRUD completo
    - [ ] Verificar permisos por rol
    - [ ] Probar búsqueda y filtros
    - [ ] Verificar navegación y breadcrumbs
    - [ ] Revisar responsive en móvil

### 🎯 **Buenas Prácticas**

- **Reutilización**: Siempre usar hooks y servicios genéricos de `src/`
- **Consistencia**: Seguir exactamente el patrón del módulo de usuarios
- **Nomenclatura**: Nombres descriptivos y consistentes en inglés/español
- **Performance**: Lazy loading, debounce en búsquedas, paginación
- **UX**: Loading states, error handling, feedback con toasts
- **Código Limpio**: Componentes pequeños, hooks específicos, separación de responsabilidades

### 🔧 **Comandos y Herramientas**

```bash
# Ejecutar frontend
npm run dev

# Build para producción
npm run build

# Linting
npm run lint

# Formateo
npm run format

# Análisis de bundle
npm run analyze
```

### 🚀 **Inicio Rápido**

Para desarrollar un nuevo módulo:

1. **Copia la estructura del módulo `users/`**
2. **Renombra archivos y funciones** con tu dominio
3. **Sigue el checklist paso a paso**
4. **USA los hooks y servicios genéricos** - NO los recrees
5. **Prueba cada funcionalidad** antes de continuar

### 📱 **Responsive y Mobile-First**

- Diseño mobile-first con Tailwind CSS
- Componentes adaptativos para desktop/tablet/móvil
- Navigation drawer en móvil
- Tablas responsivas con scroll horizontal

---

**Nota**: Esta guía está basada en el análisis del módulo `users` y debe seguirse estrictamente para mantener consistencia en el proyecto. El punto más importante es **NO crear hooks o servicios genéricos por módulo** - usar siempre los de `src/hooks/` y `src/services/`.