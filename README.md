# AventuraLocal Frontend

<p align="center">
<a href="https://github.com/fer-gc05/AventuraLocalFrontend"><img src="https://img.shields.io/badge/GitHub-AventuraLocalFrontend-blue" alt="GitHub Repository"></a>
<a href="https://vuejs.org"><img src="https://img.shields.io/badge/Vue-v3.x-4FC08D" alt="Vue Version"></a>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
</p>

## Acerca de AventuraLocal Frontend

AventuraLocal Frontend es una aplicación web moderna desarrollada con Vue 3 que proporciona una interfaz de usuario intuitiva y atractiva para la plataforma de turismo y aventura local. La aplicación permite a los usuarios explorar destinos, eventos, rutas y gestionar sus reservas de manera eficiente.

## Características Principales

- Interfaz de Usuario Moderna y Responsiva
- Exploración de Destinos Turísticos
- Visualización de Eventos y Tours
- Sistema de Rutas
- Gestión de Reservas
- Perfiles de Usuario
- Autenticación JWT
- Diseño con Tailwind CSS


## Requisitos del Sistema

- Node.js >= 16.x
- npm o yarn
- Navegador web moderno

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/fer-gc05/AventuraLocalFrontend.git
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Configurar las variables en el archivo .env:
```bash
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=AventuraLocal
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

## Estructura del Proyecto

El proyecto está organizado en los siguientes módulos principales:

```
src/
├── api/           # Servicios y configuración de la API
├── assets/        # Recursos estáticos (imágenes, estilos, etc.)
├── components/    # Componentes reutilizables de Vue
├── composables/   # Composables de Vue (hooks personalizados)
├── i18n/          # Configuración de internacionalización
├── router/        # Configuración de rutas
├── stores/        # Estado global (Pinia stores)
├── types/         # Definiciones de tipos TypeScript
├── views/         # Vistas principales de la aplicación
├── App.vue        # Componente raíz de la aplicación
├── main.ts        # Punto de entrada de la aplicación
├── style.css      # Estilos globales
└── vite-env.d.ts  # Tipos de Vite
```

### Descripción de los Directorios

- **api/**: Contiene la configuración de axios, interceptores y servicios para la comunicación con el backend
- **assets/**: Almacena recursos estáticos como imágenes, iconos y estilos globales
- **components/**: Componentes Vue reutilizables organizados por funcionalidad
- **composables/**: Hooks personalizados para lógica reutilizable
- **i18n/**: Configuración y archivos de traducción para múltiples idiomas
- **router/**: Configuración de rutas y navegación
- **stores/**: Stores de Pinia para el manejo del estado global
- **types/**: Interfaces y tipos TypeScript
- **views/**: Componentes de página que representan las rutas principales

## Características Técnicas

### Vue 3 + TypeScript
- Componentes con `<script setup>`
- Sistema de tipos robusto
- Composición API

### Tailwind CSS
- Diseño responsive
- Sistema de utilidades
- Temas personalizables

## Integración con Backend

Este frontend está diseñado para consumir la API de AventuraLocal, desarrollada con Laravel. La integración se realiza a través de los siguientes endpoints principales:

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/me` - Información del usuario actual

### Destinos
- `GET /api/destinations` - Listado de destinos
- `GET /api/destinations/{id}` - Detalles de destino
- `GET /api/destinations/popular` - Destinos populares

### Eventos
- `GET /api/events` - Listado de eventos
- `GET /api/events/{id}` - Detalles de evento
- `GET /api/events/upcoming` - Próximos eventos

### Rutas
- `GET /api/routes` - Listado de rutas
- `GET /api/routes/{id}` - Detalles de ruta
- `GET /api/routes/popular` - Rutas populares

### Reservas
- `GET /api/reservations` - Listado de reservas
- `POST /api/reservations` - Crear reserva
- `PUT /api/reservations/{id}` - Actualizar reserva

### Comunidades
- `GET /api/communities` - Listado de comunidades
- `GET /api/communities/{id}` - Detalles de comunidad
- `POST /api/communities` - Crear comunidad

### Reseñas
- `GET /api/reviews` - Listado de reseñas
- `POST /api/reviews` - Crear reseña
- `PUT /api/reviews/{id}` - Actualizar reseña

Para más detalles sobre la API, consulta la [documentación del backend](https://github.com/fer-gc05/AventuraLocalApi).

## Páginas Principales

### Autenticación
- Registro de usuarios
- Inicio de sesión

### Destinos
- Listado de destinos
- Detalles de destino
- Filtros y búsqueda
- Mapa interactivo

### Eventos
- Calendario de eventos
- Detalles de evento
- Sistema de reservas
- Notificaciones

### Perfil de Usuario
- Información personal
- Historial de reservas
- Reseñas realizadas
- Configuración de cuenta

## Desarrollo

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Vista previa de la versión de producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas

### Convenciones de Código

- ESLint para linting
- Prettier para formateo
- Conventional Commits
- Git Flow

## Contacto

Fernando Gil - [@fer-gc05](https://github.com/fer-gc05)

Link del Proyecto: [https://github.com/fer-gc05/AventuraLocalFrontend](https://github.com/fer-gc05/AventuraLocalFrontend)
