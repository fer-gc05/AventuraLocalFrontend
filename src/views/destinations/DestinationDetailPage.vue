<template>
  <div class="container-custom mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
    <!-- Estado de carga -->
    <div v-if="destinationsStore.isLoading" class="flex justify-center items-center h-96">
      <LoadingIndicator class="w-16 h-16 text-primary-600" />
    </div>

    <!-- Estado de error -->
    <div v-else-if="destinationsStore.error" class="text-center py-20">
      <div class="inline-flex items-center justify-center bg-red-50 rounded-full p-4 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-red-500 text-lg font-medium">{{ destinationsStore.error }}</p>
      <router-link to="/destinations" class="mt-6 inline-block btn-outline">
        {{ $t('common.back') }}
      </router-link>
    </div>

    <!-- No se encontró el destino -->
    <div v-else-if="!destination" class="text-center py-20">
      <div class="inline-flex items-center justify-center bg-gray-50 rounded-full p-4 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-gray-600 text-lg">{{ $t('common.noResults') }}</p>
      <router-link to="/destinations" class="mt-6 inline-block btn-outline">
        {{ $t('common.back') }}
      </router-link>
    </div>

    <!-- Contenido del destino -->
    <div v-else>
      <!-- Hero section con imagen de fondo -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div class="relative h-64 sm:h-80 lg:h-96 bg-gray-100">
          <img 
            :src="destination.media?.length ? destination.media[0] : 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'" 
            :alt="destination.name" 
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-black bg-opacity-30 flex items-end pb-8 px-6 sm:px-8 lg:px-10">
            <div class="w-full">
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-md">
                {{ destination.name }}
              </h1>
              <p class="text-white text-lg">
                {{ destination.city }}, {{ destination.country }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid principal de contenido -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna principal -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Descripción -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Descripción
            </h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ destination.description }}</p>
          </div>

          <!-- Mapa -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ubicación
            </h2>
            <MapComponent 
              :coordinates="[{ 
                name: destination.name, 
                lat: destination.latitude ? Number(destination.latitude) : undefined, 
                lng: destination.longitude ? Number(destination.longitude) : undefined, 
                city: destination.city 
              }]"
              :zoom="14"
              :map-id="`map-destino-${destination.id}`"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-8">
          <!-- Información básica -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Información Básica
            </h2>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-primary-100 rounded-lg p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-800 mb-1">Precio</h3>
                  <p class="text-primary-600 font-bold">
                    {{ destination.price ? `${destination.price} ${destination.currency}` : 'Gratis' }}
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 bg-primary-100 rounded-lg p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-800 mb-1">Dirección</h3>
                  <p class="text-gray-600">{{ destination.address }}</p>
                  <p class="text-gray-600">{{ destination.city }}, {{ destination.state }}</p>
                  <p class="text-gray-600">{{ destination.country }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 bg-primary-100 rounded-lg p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-800 mb-1">Contacto</h3>
                  <p class="text-gray-600">{{ destination.contact_phone || 'No disponible' }}</p>
                  <p class="text-gray-600">{{ destination.contact_email || 'No disponible' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Categoría -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categoría
            </h2>
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800">
              {{ destination.category?.name || 'Sin categoría' }}
            </div>
          </div>

          <!-- Valoración -->
          <div v-if="destination.tags?.length" class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Etiquetas
            </h2>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in destination.tags" 
                :key="tag.id"
                class="px-3 py-1 rounded-full text-sm font-medium"
                :style="{ backgroundColor: tag.color + '20', color: tag.color }"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDestinationsStore } from '../../stores/destinations';
import LoadingIndicator from '../../components/shared/LoadingIndicator.vue';
import MapComponent from '../../components/shared/MapComponent.vue';

const route = useRoute();
const destinationsStore = useDestinationsStore();

const destination = computed(() => {
  console.log('Computed destination:', destinationsStore.currentDestination);
  return destinationsStore.currentDestination;
});

onMounted(async () => {
  console.log('Component mounted');
  console.log('Route params:', route.params);
  const id = parseInt(route.params.id as string);
  console.log('Parsed ID:', id);
  
  if (!isNaN(id)) {
    try {
      console.log('Fetching destination...');
      const result = await destinationsStore.fetchDestinationById(id);
      console.log('API Response:', result);
      console.log('Store state after fetch:', {
        isLoading: destinationsStore.isLoading,
        error: destinationsStore.error,
        currentDestination: destinationsStore.currentDestination
      });
      
      if (!destinationsStore.currentDestination) {
        console.error('No se pudo cargar el destino');
      }
    } catch (error) {
      console.error('Error al cargar el destino:', error);
    }
  } else {
    console.error('ID de destino inválido');
  }
});

// Agregar watch para depuración
watch(() => destinationsStore.currentDestination, (newVal) => {
  console.log('Destination changed:', newVal);
}, { immediate: true });

watch(() => destinationsStore.isLoading, (newVal) => {
  console.log('Loading state changed:', newVal);
}, { immediate: true });

watch(() => destinationsStore.error, (newVal) => {
  console.log('Error state changed:', newVal);
}, { immediate: true });
</script>

<style scoped>
.container-custom {
  max-width: 1200px;
}
</style>