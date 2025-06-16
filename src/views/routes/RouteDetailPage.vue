<template>
  <div class="container-custom mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
    <!-- Título de la página con decoración -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-800 relative inline-block">
        <span class="relative z-10 px-4">Explorar Ruta</span>
        <span class="absolute bottom-0 left-0 right-0 h-2 bg-primary-100 z-0"></span>
      </h1>
    </div>

    <!-- Estado de carga -->
    <div v-if="routesStore.isLoading" class="flex justify-center items-center h-96">
      <LoadingIndicator class="w-16 h-16 text-primary-600" />
    </div>

    <!-- Estado de error -->
    <div v-else-if="routesStore.error" class="text-center py-20">
      <div class="inline-flex items-center justify-center bg-red-50 rounded-full p-4 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-red-500 text-lg font-medium">{{ routesStore.error }}</p>
      <router-link to="/routes" class="mt-6 inline-block btn-outline">
        Volver a la lista
      </router-link>
    </div>

    <!-- Ruta no encontrada -->
    <div v-else-if="!routesStore.currentRoute" class="text-center py-20">
      <div class="inline-flex items-center justify-center bg-gray-50 rounded-full p-4 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-gray-600 text-lg">No se encontraron resultados</p>
      <router-link to="/routes" class="mt-6 inline-block btn-outline">
        Volver a la lista
      </router-link>
    </div>

    <!-- Contenedor principal de la ruta -->
    <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- Hero section con imagen de fondo -->
      <div class="relative h-64 sm:h-80 lg:h-96 bg-gray-100">
        <img 
          v-if="routesStore.currentRoute.media && routesStore.currentRoute.media.length"
          :src="routesStore.currentRoute.media[0]" 
          :alt="routesStore.currentRoute.name"
          class="w-full h-full object-cover"
        >
        <div v-else class="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <!-- Overlay y título -->
        <div class="absolute inset-0 bg-black bg-opacity-30 flex items-end pb-8 px-6 sm:px-8 lg:px-10">
          <div class="w-full">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-md">
                  {{ routesStore.currentRoute.name }}
                </h2>
                <div class="flex items-center space-x-4 text-white">
                  <span class="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ routesStore.currentRoute.estimated_duration }} horas
                  </span>
                  <span class="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ routesStore.currentRoute.total_distance }} km
                  </span>
                  <span :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', difficultyBadgeClass(routesStore.currentRoute.difficulty)]">
                    {{ routesStore.currentRoute.difficulty }}
                  </span>
                </div>
              </div>
              
              <button
                v-if="authStore.isAuthenticated && authStore.user?.role === 'Traveler'"
                @click="toggleFavorite"
                class="flex items-center btn-primary px-6 py-3 rounded-full shadow-lg transform transition-all hover:scale-105"
                :class="{ 'bg-secondary-600 hover:bg-secondary-700': isFavorite, 'bg-primary-600 hover:bg-primary-700': !isFavorite }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="isFavorite ? 'fill-current' : 'fill-none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="p-6 sm:p-8 lg:p-10">
        <!-- Descripción -->
        <div class="mb-10">
          <h3 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sobre esta ruta
          </h3>
          <p class="text-gray-700 leading-relaxed">
            {{ routesStore.currentRoute.description || 'Sin descripción disponible' }}
          </p>
        </div>

        <!-- Mapa y destinos -->
        <div class="mb-10">
          <h3 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Mapa de la ruta
          </h3>
          
          <div v-if="routesStore.currentRoute.destinations?.length" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Mapa -->
            <div class="lg:col-span-2">
              <MapComponent 
                :coordinates="routesStore.currentRoute.destinations.map(dest => ({ 
                  name: dest.name, 
                  lat: dest.latitude ? Number(dest.latitude) : undefined, 
                  lng: dest.longitude ? Number(dest.longitude) : undefined
                }))"
                :show-route="true"
                :map-id="`map-ruta-${routesStore.currentRoute.id}`"
              />
            </div>
            
            <!-- Lista de destinos -->
            <div class="lg:col-span-1">
              <div class="bg-gray-50 rounded-xl p-6 h-full">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">Itinerario</h4>
                <div class="space-y-4">
                  <div 
                    v-for="(destination, index) in routesStore.currentRoute.destinations" 
                    :key="destination.id"
                    class="flex items-start group cursor-pointer"
                    @click="scrollToDestination(destination.id)"
                  >
                    <div class="flex-shrink-0 mr-4">
                      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-medium">
                        {{ index + 1 }}
                      </div>
                    </div>
                    <div class="flex-1">
                      <h5 class="font-medium text-gray-800 group-hover:text-primary-600 transition-colors">
                        {{ destination.name }}
                      </h5>
                      <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                        {{ destination.short_description || 'Sin descripción' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-10 bg-gray-50 rounded-xl">
            <p class="text-gray-500">No hay destinos</p>
          </div>
        </div>

        <!-- Detalles de los destinos -->
        <div v-if="routesStore.currentRoute.destinations?.length" class="mb-10">
          <h3 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Detalles de los destinos
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="destination in routesStore.currentRoute.destinations"
              :key="destination.id"
              :id="`destination-${destination.id}`"
              class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  :src="destination.media?.length ? destination.media[0] : 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'"
                  :alt="destination.name"
                  class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                >
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h4 class="font-semibold text-xl text-white">{{ destination.name }}</h4>
                </div>
              </div>
              <div class="p-5">
                <div class="flex items-center text-sm text-gray-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ destination.latitude }}, {{ destination.longitude }}
                </div>
                <p class="text-gray-600 mb-4 line-clamp-3">
                  {{ destination.short_description || 'Sin descripción' }}
                </p>
                <router-link
                  :to="`/destinations/${destination.id}`"
                  class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Ver detalles
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="bg-gray-50 rounded-xl p-6 sm:p-8 mb-10">
          <h3 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Información adicional
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary-100 rounded-lg p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-800 mb-1">Fecha de creación</h4>
                <p class="text-gray-600">
                  {{ routesStore.currentRoute.created_at ? new Date(routesStore.currentRoute.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No disponible' }}
                </p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary-100 rounded-lg p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-800 mb-1">Mejor época para visitar</h4>
                <p class="text-gray-600">
                  {{ routesStore.currentRoute.best_season || 'Todo el año' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón de volver -->
        <div class="text-center">
          <router-link 
            to="/routes" 
            class="inline-flex items-center btn-outline px-6 py-3 rounded-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la lista
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRoutesStore } from '../../stores/routes';
import { useAuthStore } from '../../stores/auth';
import LoadingIndicator from '../../components/shared/LoadingIndicator.vue';
import MapComponent from '../../components/shared/MapComponent.vue';

// Stores y router
const route = useRoute();
const routesStore = useRoutesStore();
const authStore = useAuthStore();

// Estado de favorito
const isFavorite = ref(false);

// Obtener el ID de la ruta desde los parámetros de la URL
const routeId = computed(() => Number(route.params.id));

// Cargar los detalles de la ruta y verificar usuario al montar el componente
onMounted(async () => {
  await routesStore.fetchRouteById(routeId.value);
  if (!authStore.user && authStore.isAuthenticated) {
    // El usuario ya está autenticado, no necesitamos hacer fetchUser
    // ya que el token ya está en el store
  }
});

// Función para manejar el estado de favorito
const toggleFavorite = async () => {
  const result = await routesStore.toggleFavoriteRoute(routeId.value);
  if (result) {
    isFavorite.value = !isFavorite.value;
  }
};

// Clases para la dificultad (badge)
const difficultyBadgeClass = (difficulty: string) => {
  return {
    'easy': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'hard': 'bg-red-100 text-red-800',
  }[difficulty];
};

// Función para hacer scroll a un destino específico
const scrollToDestination = (id: number) => {
  const element = document.getElementById(`destination-${id}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Efecto visual de destaque
    element.classList.add('ring-2', 'ring-primary-500', 'transition-all', 'duration-300');
    setTimeout(() => {
      element.classList.remove('ring-2', 'ring-primary-500');
    }, 2000);
  }
};
</script>

<style scoped>
/* Estilos personalizados */
.container-custom {
  max-width: 1200px;
}

.btn-primary {
  @apply inline-flex items-center justify-center transition-all duration-300;
}

.btn-outline {
  @apply inline-flex items-center justify-center transition-colors duration-300;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>