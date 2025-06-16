<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useEventsStore } from '../../stores/events';
import { useRouter } from 'vue-router';

const eventsStore = useEventsStore();
const router = useRouter();

// Estado local
const searchQuery = ref('');
const selectedMonth = ref('');
const showPastEvents = ref(false);
const showAuthMessage = ref(false);
const authMessage = 'Para esta acción debes hacer parte de nuestro gran equipo.';

// Filtros de fecha
const months = [
  { value: '', label: 'Todos los meses' },
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' }
];

// Eventos filtrados
const filteredEvents = computed(() => {
  let result = eventsStore.eventsList || [];

  // Filtrar por búsqueda (solo title y description)
  if (searchQuery.value) {
    result = result.filter(event =>
      (event.title && event.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (event.description?.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }

  return result;
});

// Cargar eventos al montar el componente
onMounted(async () => {
  await eventsStore.fetchEvents();
});

// Navegar a detalles del evento
const goToEventDetails = (eventId: number) => {
  router.push(`/events/${eventId}`);
};

// Formatear fecha
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<template>
  <div class="container-custom mx-auto py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">Eventos</h1>
      <p class="text-gray-600">
        Descubre y participa en eventos locales que te permitirán conectar con la comunidad
        y vivir experiencias únicas.
      </p>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Búsqueda -->
        <div class="col-span-1 md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar eventos..."
            class="form-input w-full"
          >
        </div>

        <!-- Filtro por mes -->
        <div>
          <select v-model="selectedMonth" class="form-select w-full">
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <!-- Mostrar eventos pasados -->
        <div class="flex items-center">
          <label class="flex items-center space-x-2">
            <input
              v-model="showPastEvents"
              type="checkbox"
              class="form-checkbox"
            >
            <span class="text-sm text-gray-600">Mostrar eventos pasados</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Lista de eventos -->
    <div v-if="showAuthMessage" class="alert alert-warning mb-4">
      {{ authMessage }}
    </div>

    <div v-if="eventsStore.isLoading" class="text-center py-10">
      <p>Cargando eventos...</p>
    </div>

    <div v-else-if="eventsStore.error" class="text-center py-10">
      <p class="text-red-500">{{ eventsStore.error }}</p>
    </div>

    <div v-else-if="filteredEvents.length === 0" class="text-center py-10">
      <p>No se encontraron eventos que coincidan con los criterios de búsqueda.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="card group cursor-pointer"
        @click="goToEventDetails(event.id)"
      >
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2">{{ event.title }}</h3>
          
          <!-- Fecha -->
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(event.start_datetime) }}</span>
          </div>

          <!-- Ubicación -->
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ event.location }}</span>
          </div>

          <!-- Descripción -->
          <p class="text-gray-500 line-clamp-2 mb-4">
            {{ event.description || 'Sin descripción' }}
          </p>

          <!-- Precio y botón -->
          <div class="flex justify-between items-center">
            <span v-if="event.price" class="font-semibold text-primary-600">
              {{ event.price }} {{ event.currency }}
            </span>
            <span v-else class="text-green-600 font-medium">Gratis</span>
            
            <span class="text-secondary-600 group-hover:text-secondary-700">
              Ver detalles →
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 