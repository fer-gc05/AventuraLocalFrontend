<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDestinationsStore } from '../stores/destinations';
import { useRoutesStore } from '../stores/routes';
import { useEventsStore } from '../stores/events';

const router = useRouter();
const destinationsStore = useDestinationsStore();
const routesStore = useRoutesStore();
const eventsStore = useEventsStore();

const searchQuery = ref('');

onMounted(async () => {
  await Promise.all([
    destinationsStore.fetchPopularDestinations(6),
    routesStore.fetchPopularRoutes(3),
    eventsStore.fetchUpcomingEvents()
  ]);
});

const handleSearch = () => {
  router.push({
    path: '/destinations',
    query: { q: searchQuery.value }
  });
};
</script>

<template>
  <div>
    <!-- Hero section -->
    <section class="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-20">
      <div class="container-custom mx-auto">
        <div class="max-w-2xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            Descubre destinos locales con encanto
          </h1>
          <p class="text-lg mb-8 text-gray-200">
            Explora lugares poco conocidos con gran valor cultural, histórico y natural.
            Apoya a las comunidades locales y vive experiencias auténticas.
          </p>

          <!-- Search form -->
          <form @submit.prevent="handleSearch" class="mb-8">
            <div class="flex flex-col sm:flex-row gap-2">
              <input v-model="searchQuery" type="text" placeholder="Busca tu próxima aventura..."
                class="form-input flex-grow text-gray-800">
              <button type="submit" class="btn-accent">
                Buscar
              </button>
            </div>
          </form>

          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/destinations" class="btn-primary">
              Explorar destinos
            </router-link>
            <router-link to="/routes" class="btn-outline bg-white/10 text-white border-white/20">
              Ver rutas populares
            </router-link>
          </div>
        </div>
      </div>

      <!-- Background pattern -->
      <div class="absolute inset-0 z-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>
    </section>

    <!-- Popular destinations section -->
    <section class="py-16 bg-white">
      <div class="container-custom mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Destinos populares</h2>
          <router-link to="/destinations" class="text-primary-600 hover:text-primary-700 font-medium">
            Ver todos →
          </router-link>
        </div>

        <div v-if="destinationsStore.isLoading" class="text-center py-10">
          <p>Cargando destinos...</p>
        </div>
        <div v-else-if="destinationsStore.error" class="text-center py-10">
          <p class="text-red-500">{{ destinationsStore.error }}</p>
        </div>
        <div v-else-if="destinationsStore.popularDestinations.length === 0" class="text-center py-10">
          <p>No hay destinos populares disponibles en este momento.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="destination in destinationsStore.popularDestinations" :key="destination.id" class="card group">
            <div class="h-48 overflow-hidden">
              <img
                :src="destination.media?.length ? destination.media[0] : 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'"
                :alt="destination.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-1">{{ destination.name }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ destination.city }}, {{ destination.country }}</p>
              <p class="text-gray-500 line-clamp-2 mb-4">{{ destination.short_description }}</p>
              <div class="flex justify-between items-center">
                <span class="font-semibold text-primary-600">
                  {{ destination.price }} {{ destination.currency }}
                </span>
                <router-link :to="`/destinations/${destination.id}`"
                  class="text-secondary-600 hover:text-secondary-700">
                  Ver detalles →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular routes section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Rutas recomendadas</h2>
          <router-link to="/routes" class="text-primary-600 hover:text-primary-700 font-medium">
            Ver todas →
          </router-link>
        </div>

        <div v-if="routesStore.isLoading" class="text-center py-10">
          <p>Cargando rutas...</p>
        </div>
        <div v-else-if="routesStore.error" class="text-center py-10">
          <p class="text-red-500">{{ routesStore.error }}</p>
        </div>
        <div v-else-if="routesStore.popularRoutes.length === 0" class="text-center py-10">
          <p>No hay rutas populares disponibles en este momento.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="route in routesStore.popularRoutes" :key="route.id" class="card group">
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-1">{{ route.name }}</h3>
              <div class="flex gap-2 mb-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                  'bg-green-100 text-green-800': route.difficulty === 'easy',
                  'bg-yellow-100 text-yellow-800': route.difficulty === 'medium',
                  'bg-red-100 text-red-800': route.difficulty === 'hard'
                }">
                  {{ route.difficulty === 'easy' ? 'Fácil' : route.difficulty === 'medium' ? 'Media' : 'Difícil' }}
                </span>
                <span v-if="route.total_distance"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ route.total_distance }} km
                </span>
              </div>
              <p class="text-gray-500 line-clamp-3 mb-4">{{ route.description || 'Sin descripción' }}</p>
              <div class="flex justify-end">
                <router-link :to="`/routes/${route.id}`" class="text-secondary-600 hover:text-secondary-700">
                  Ver ruta →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming events section -->
    <section class="py-16 bg-white">
      <div class="container-custom mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Próximos eventos</h2>
          <router-link to="/events" class="text-primary-600 hover:text-primary-700 font-medium">
            Ver todos →
          </router-link>
        </div>

        <div v-if="eventsStore.isLoading" class="text-center py-10">
          <p>Cargando eventos...</p>
        </div>
        <div v-else-if="eventsStore.error" class="text-center py-10">
          <p class="text-red-500">{{ eventsStore.error }}</p>
        </div>
        <div v-else-if="eventsStore.upcomingEvents.length === 0" class="text-center py-10">
          <p>No hay eventos próximos disponibles en este momento.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="event in eventsStore.upcomingEvents.slice(0, 4)" :key="event.id" class="card group">
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-1">{{ event.title }}</h3>
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ new Date(event.start_datetime).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ event.location }}</span>
              </div>
              <p class="text-gray-500 line-clamp-2 mb-4">{{ event.description || 'Sin descripción' }}</p>
              <div class="flex justify-between items-center">
                <span v-if="event.price" class="font-semibold text-primary-600">
                  {{ event.price }} {{ event.currency }}
                </span>
                <router-link :to="`/events/${event.id}`" class="text-secondary-600 hover:text-secondary-700">
                  Ver evento →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">¿Por qué AventuraLocal?</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Nuestra plataforma te permite descubrir joyas escondidas, conectar con comunidades locales y
            vivir experiencias auténticas mientras contribuyes al turismo sostenible.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div
              class="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Descubre destinos ocultos</h3>
            <p class="text-gray-600">
              Encuentra lugares poco conocidos con un gran valor cultural, histórico y natural
              que no encontrarás en las guías turísticas convencionales.
            </p>
          </div>

          <div class="text-center">
            <div
              class="bg-secondary-100 text-secondary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Conecta con comunidades</h3>
            <p class="text-gray-600">
              Únete a comunidades de viajeros, comparte experiencias y
              apoya directamente a los emprendedores locales.
            </p>
          </div>

          <div class="text-center">
            <div
              class="bg-accent-100 text-accent-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 6l3 3m0 0l3-3m-3 3v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Turismo sostenible</h3>
            <p class="text-gray-600">
              Contribuye al desarrollo económico de las comunidades locales y
              a la preservación de su patrimonio cultural y natural.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA section -->
    <section class="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div class="container-custom mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">¿Listo para comenzar tu aventura?</h2>
        <p class="text-lg mb-8 max-w-2xl mx-auto">
          Únete a nuestra comunidad de viajeros responsables y empieza a
          descubrir destinos auténticos que te sorprenderán.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/register" class="btn bg-white text-primary-600 hover:bg-gray-100">
            Regístrate ahora
          </router-link>
          <router-link to="/destinations" class="btn border border-white text-white hover:bg-white/10">
            Explorar destinos
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>