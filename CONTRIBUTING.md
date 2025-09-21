# Guía de Contribución - Condominium Frontend

¡Gracias por tu interés en contribuir al proyecto Condominium Frontend! Esta guía te ayudará a seguir las mejores prácticas para mantener un código limpio y un historial de cambios ordenado.

## 📋 Proceso de Contribución

### 1. Crear una Nueva Rama

Antes de comenzar a trabajar en una nueva funcionalidad, crea una rama específica para tu tarea:

```bash
git checkout dev
git pull origin dev
git checkout -b <tipo>/<nombre-descriptivo>
```

#### Ejemplos de Nombres de Ramas Convencionales

**Features (nuevas funcionalidades):**
```
feature/login-page
feature/dashboard-components
feature/hospital-management-ui
feature/patient-registration-form
feature/appointment-calendar
feature/user-profile-settings
feature/dark-mode-toggle
feature/responsive-navigation
```

**Bugfixes (corrección de errores):**
```
bugfix/mobile-menu-overflow
bugfix/form-validation-messages
bugfix/chart-rendering-issue
bugfix/login-redirect-loop
bugfix/table-pagination-error
```

**Hotfixes (correcciones urgentes):**
```
hotfix/security-xss-vulnerability
hotfix/memory-leak-components
hotfix/critical-ui-crash
```

**Refactoring:**
```
refactor/auth-components-cleanup
refactor/dashboard-layout-optimization
refactor/api-service-restructure
refactor/component-state-management
```

**Styles (mejoras de UI/UX):**
```
style/improve-button-components
style/update-color-palette
style/enhance-mobile-responsive
style/redesign-landing-page
```

**Documentación:**
```
docs/component-library-guide
docs/deployment-instructions
docs/contributing-guidelines
```

### 2. Commits Convencionales

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial claro y generar changelogs automáticamente.

#### Estructura del Commit

```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

#### Tipos de Commit

- **feat**: Nueva funcionalidad
- **fix**: Corrección de errores
- **docs**: Cambios en documentación
- **style**: Cambios de formato o UI/UX
- **refactor**: Refactorización de código
- **perf**: Mejoras de rendimiento
- **test**: Agregar o corregir tests
- **chore**: Tareas de mantenimiento
- **ci**: Cambios en configuración de CI/CD
- **build**: Cambios en el sistema de build

#### Ejemplos de Commits

```bash
# Nueva funcionalidad
git commit -m "feat(auth): implementar página de login"
git commit -m "feat(dashboard): agregar componente de estadísticas"
git commit -m "feat(hospital): crear formulario de registro"
git commit -m "feat(ui): agregar componente de tabla reutilizable"

# Corrección de errores
git commit -m "fix(auth): corregir validación de formulario de login"
git commit -m "fix(dashboard): resolver problema de carga de datos"
git commit -m "fix(mobile): arreglar menú desplegable en móviles"
git commit -m "fix(routing): corregir navegación entre páginas"

# Mejoras de estilo/UI
git commit -m "style(buttons): mejorar diseño de botones primarios"
git commit -m "style(forms): actualizar estilos de inputs y labels"
git commit -m "style(responsive): mejorar diseño en tablets"
git commit -m "style(theme): implementar modo oscuro"

# Documentación
git commit -m "docs(components): documentar componentes de UI"
git commit -m "docs(readme): actualizar instrucciones de instalación"

# Refactoring
git commit -m "refactor(hooks): simplificar custom hooks de autenticación"
git commit -m "refactor(components): optimizar re-renderizado de componentes"
git commit -m "refactor(services): mejorar estructura de servicios API"

# Tests
git commit -m "test(auth): agregar pruebas para componentes de login"
git commit -m "test(dashboard): implementar tests unitarios"
git commit -m "test(e2e): agregar pruebas end-to-end para flujo principal"

# Configuración y herramientas
git commit -m "chore(deps): actualizar dependencias de React"
git commit -m "chore(eslint): configurar reglas adicionales de linting"
git commit -m "build(vite): optimizar configuración de build"
git commit -m "ci(github): configurar GitHub Actions para testing"
```

### 3. Subir Cambios

Antes de subir tus cambios, asegúrate de que tu rama esté actualizada:

```bash
# Actualizar rama dev
git checkout dev
git pull origin dev

# Regresar a tu rama y hacer rebase
git checkout tu-rama
git rebase dev

# Resolver conflictos si existen
# Después del rebase exitoso, subir cambios
git push origin tu-rama
```

### 4. Crear Pull Request

1. Ve a GitHub y crea un Pull Request desde tu rama hacia `dev`
2. Usa un título descriptivo siguiendo convenciones similares a los commits
3. Completa la plantilla de PR con:
   - **Descripción**: Explica qué hace tu cambio
   - **Cambios realizados**: Lista los principales cambios
   - **Testing**: Describe cómo probaste tus cambios
   - **Screenshots**: Si aplica, incluye capturas de pantalla
   - **Responsive**: Confirma que funciona en diferentes dispositivos

#### Ejemplo de Título de PR
```
feat(dashboard): implementar componentes de estadísticas con gráficos
fix(mobile): corregir navegación responsive en dispositivos móviles
style(ui): rediseñar sistema de componentes con Tailwind CSS
refactor(auth): mejorar manejo de estado de autenticación
```

### 5. Proceso de Revisión

- ✅ **Mantén tu PR sin conflictos**: Haz rebase regularmente
- ✅ **Responde a comentarios**: Atiende feedback de los revisores
- ✅ **Tests pasando**: Asegúrate de que todos los tests pasen
- ✅ **Build exitoso**: Verifica que la aplicación compile correctamente
- ✅ **Responsive design**: Prueba en diferentes tamaños de pantalla
- ✅ **Accesibilidad**: Verifica contraste y navegación por teclado
- ✅ **Performance**: No degradar la performance de la aplicación

## 🔍 Checklist Antes del PR

- [ ] Mi rama está basada en `dev` actualizado
- [ ] Los commits siguen convenciones de naming
- [ ] Los tests pasan localmente (`npm run test`)
- [ ] **El build se ejecuta sin errores (`npm run build`)**
- [ ] No hay warnings de ESLint (`npm run lint`)
- [ ] No hay conflictos de merge
- [ ] He probado la funcionalidad en diferentes navegadores
- [ ] El diseño es responsive (móvil, tablet, desktop)
- [ ] La documentación está actualizada (si aplica)
- [ ] No incluyo archivos de configuración personal
- [ ] Las imágenes están optimizadas
- [ ] Los componentes siguen la estructura del proyecto

## 🎨 Estándares de Código Frontend

### Estructura de Componentes
```tsx
// Importaciones en orden:
// 1. React y hooks
// 2. Librerías externas
// 3. Componentes internos
// 4. Tipos/interfaces
// 5. Utilities y helpers

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ComponentProps } from './types';

export const MyComponent: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // hooks primero
  const [state, setState] = useState();
  
  // event handlers
  const handleClick = () => {
    // lógica del evento
  };
  
  // render
  return (
    <div className="container">
      {/* contenido */}
    </div>
  );
};
```

### Naming Conventions
- **Componentes**: PascalCase (`UserProfile`, `DashboardCard`)
- **Archivos de componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks personalizados**: camelCase con prefijo `use` (`useAuth`, `useApiCall`)
- **Utilities**: camelCase (`formatDate`, `validateEmail`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)

## 🚨 Importantes

1. **Nunca hagas push directamente a `main` o `dev`**
2. **Siempre crea una rama específica para tu trabajo**
3. **Mantén tus commits pequeños y enfocados**
4. **Haz rebase en lugar de merge para mantener un historial limpio**
5. **Espera la aprobación antes de hacer merge de tu PR**
6. **Testa tu código en múltiples navegadores**
7. **Verifica la responsividad en diferentes dispositivos**

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa del build

# Testing
npm run test         # Ejecutar tests unitarios
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
npm run test:e2e     # Tests end-to-end

# Linting y formato
npm run lint         # Verificar código con ESLint
npm run lint:fix     # Corregir automáticamente errores de linting
npm run format       # Formatear código con Prettier

# Análisis
npm run analyze      # Analizar el bundle
npm run type-check   # Verificar tipos de TypeScript
```

## 🎯 Performance y Best Practices

- **Code Splitting**: Usa lazy loading para componentes grandes
- **Memoización**: Usa `React.memo`, `useMemo`, `useCallback` cuando sea necesario
- **Optimización de imágenes**: Usa formatos modernos (WebP) y tamaños apropiados
- **Bundle size**: Mantén el bundle lo más pequeño posible
- **Accessibility**: Sigue las pautas WCAG 2.1
- **SEO**: Incluye meta tags apropriados

---

¿Tienes alguna duda sobre el proceso de contribución? No dudes en contactar al equipo de desarrollo.