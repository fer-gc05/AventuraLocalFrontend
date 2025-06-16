<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useEventsStore } from '../../stores/events';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const eventsStore = useEventsStore();
const authStore = useAuthStore();

const eventId = computed(() => Number(route.params.id));
const isAttending = ref(false);
const showAuthMessage = ref(false);
const authMessage = 'Para asistir a eventos debes iniciar sesión como viajero.';

// Verificar si el usuario es Traveler
const isTraveler = computed(() => {
  return authStore.user?.role === 'Traveler';
});

// Formatear fecha

// Cargar datos del evento
onMounted(async () => {
  await eventsStore.fetchEventById(eventId.value);
});

// Manejar asistencia al evento
const handleAttendance = async () => {
  if (!authStore.isAuthenticated) {
    showAuthMessage.value = true;
    return;
  }

  if (!isTraveler.value) {
    showAuthMessage.value = true;
    return;
  }

  try {
    if (isAttending.value) {
      await eventsStore.cancelAttendance(eventId.value);
    } else {
      await eventsStore.attendEvent(eventId.value);
    }
    isAttending.value = !isAttending.value;
  } catch (error) {
    console.error('Error al manejar la asistencia:', error);
  }
};

// Verificar si el evento está lleno
const isEventFull = computed(() => {
  if (!eventsStore.currentEvent?.max_attendees) return false;
  return true;
});

// Verificar si el evento ya pasó
const isPastEvent = computed(() => {
  if (!eventsStore.currentEvent) return false;
  return new Date(eventsStore.currentEvent.start_datetime) < new Date();
});

// Función para obtener una imagen basada en el tipo de evento
const getEventImage = () => {
  const eventTitle = eventsStore.currentEvent?.title?.toLowerCase() || '';
  const eventDescription = eventsStore.currentEvent?.description?.toLowerCase() || '';
  const eventText = `${eventTitle} ${eventDescription}`;

  const eventImages = {
    // Naturaleza y senderismo
    naturaleza: [
      'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg', // Sendero en bosque
      'https://images.pexels.com/photos/2662117/pexels-photo-2662117.jpeg', // Montañas
      'https://images.pexels.com/photos/2662118/pexels-photo-2662118.jpeg', // Cascada
    ],
    // Gastronomía
    gastronomia: [
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg', // Comida gourmet
      'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg', // Chef cocinando
      'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg', // Restaurante
    ],
    // Cultura y arte
    cultura: [
      'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg', // Exposición
      'https://images.pexels.com/photos/2774557/pexels-photo-2774557.jpeg', // Museo
      'https://images.pexels.com/photos/2774558/pexels-photo-2774558.jpeg', // Teatro
    ],
    // Deportes
    deportes: [
      'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg', // Deportes al aire libre
      'https://images.pexels.com/photos/2608518/pexels-photo-2608518.jpeg', // Competencia
      'https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg', // Entrenamiento
    ],
    // Música y entretenimiento
    musica: [
      'https://images.pexels.com/photos/2774559/pexels-photo-2774559.jpeg', // Concierto
      'https://images.pexels.com/photos/2774560/pexels-photo-2774560.jpeg', // Festival
      'https://images.pexels.com/photos/2774561/pexels-photo-2774561.jpeg', // DJ
    ],
    // Educación y conferencias
    educacion: [
      'https://images.pexels.com/photos/2774562/pexels-photo-2774562.jpeg', // Conferencia
      'https://images.pexels.com/photos/2774563/pexels-photo-2774563.jpeg', // Seminario
      'https://images.pexels.com/photos/2774564/pexels-photo-2774564.jpeg', // Taller
    ],
    // Tecnología
    tecnologia: [
      'https://images.pexels.com/photos/2774565/pexels-photo-2774565.jpeg', // Hackathon
      'https://images.pexels.com/photos/2774566/pexels-photo-2774566.jpeg', // Tech conference
      'https://images.pexels.com/photos/2774567/pexels-photo-2774567.jpeg', // Workshop tech
    ],
    // Por defecto
    default: [
      'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg', // Evento general
      'https://images.pexels.com/photos/2774557/pexels-photo-2774557.jpeg', // Networking
      'https://images.pexels.com/photos/2774558/pexels-photo-2774558.jpeg', // Social
    ]
  };

  // Palabras clave para cada categoría
  const keywords = {
    naturaleza: ['naturaleza', 'sendero', 'ecologico', 'bosque', 'montaña', 'cascada', 'río', 'parque'],
    gastronomia: ['gastronomia', 'comida', 'chef', 'restaurante', 'culinario', 'gastronómico', 'gastronomico'],
    cultura: ['cultura', 'arte', 'museo', 'teatro', 'exposición', 'exposicion', 'galería', 'galeria'],
    deportes: ['deporte', 'deportivo', 'competencia', 'entrenamiento', 'fitness', 'ejercicio'],
    musica: ['música', 'musica', 'concierto', 'festival', 'dj', 'banda', 'artista'],
    educacion: ['educación', 'educacion', 'conferencia', 'seminario', 'taller', 'workshop', 'charla'],
    tecnologia: ['tecnología', 'tecnologia', 'tech', 'hackathon', 'programación', 'programacion', 'digital']
  };

  // Buscar coincidencias en el texto del evento
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => eventText.includes(word))) {
      const images = eventImages[category as keyof typeof eventImages];
      return images[Math.floor(Math.random() * images.length)];
    }
  }

  // Si no hay coincidencias, usar imágenes por defecto
  const defaultImages = eventImages.default;
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
};
</script>

<template>
  <div class="container-custom mx-auto py-8">
    <!-- Estado de carga -->
    <div v-if="eventsStore.isLoading" class="text-center py-10">
      <p>Cargando evento...</p>
    </div>

    <!-- Error -->
    <div v-else-if="eventsStore.error" class="text-center py-10">
      <p class="text-red-500">{{ eventsStore.error }}</p>
    </div>

    <!-- Evento no encontrado -->
    <div v-else-if="!eventsStore.currentEvent" class="text-center py-10">
      <p>Evento no encontrado</p>
    </div>

    <!-- Detalles del evento -->
    <div v-else class="max-w-4xl mx-auto">
      <!-- Encabezado -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 class="text-4xl font-extrabold text-primary-900 mb-2 tracking-tight">{{ eventsStore.currentEvent.title }}</h1>
          </div>
          <button
            v-if="authStore.isAuthenticated && isTraveler"
            @click="handleAttendance"
            class="transition-all duration-200 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transform hover:scale-105"
            :class="{ 'bg-red-600 hover:bg-red-700': isAttending }"
          >
            {{ isAttending ? 'Cancelar asistencia' : 'Asistir al evento' }}
          </button>
          <button
            v-else
            @click="handleAttendance"
            class="transition-all duration-200 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transform hover:scale-105"
          >
            Inicia sesión como viajero para asistir
          </button>
        </div>
      </div>

      <!-- Imagen principal -->
      <div class="relative h-80 mb-8 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
        <img
          :src="getEventImage()"
          :alt="eventsStore.currentEvent.title"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        >
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Columna principal -->
        <div class="md:col-span-2">
          <!-- Descripción -->
          <div class="bg-white rounded-xl shadow-md p-8 mb-6 border border-gray-100">
            <h2 class="text-2xl font-bold mb-4 text-primary-900">Descripción</h2>
            <p class="text-gray-700 whitespace-pre-line text-lg">
              {{ eventsStore.currentEvent.description || 'Sin descripción' }}
            </p>
          </div>

          <!-- Precio -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-2xl font-semibold mb-4">Precio</h2>
            <p class="text-gray-700 text-lg">
              <span v-if="eventsStore.currentEvent.price">{{ eventsStore.currentEvent.price }} {{ eventsStore.currentEvent.currency }}</span>
              <span v-else>Gratis</span>
            </p>
          </div>

          <!-- Estadísticas -->
          <div class="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <h3 class="text-xl font-bold mb-4 text-primary-900">Estadísticas</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Fecha de inicio</span>
                <span class="font-semibold">{{ new Date(eventsStore.currentEvent.start_datetime).toLocaleDateString('es-ES') }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Fecha de fin</span>
                <span class="font-semibold">{{ new Date(eventsStore.currentEvent.end_datetime).toLocaleDateString('es-ES') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Precio y botón de asistencia -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="mb-4">
              <span v-if="eventsStore.currentEvent.price" class="text-2xl font-bold text-primary-600">
                {{ eventsStore.currentEvent.price }} {{ eventsStore.currentEvent.currency }}
              </span>
              <span v-else class="text-2xl font-bold text-green-600">Gratis</span>
            </div>

            <div v-if="isPastEvent" class="text-center text-gray-500">
              Este evento ya ha finalizado
            </div>
            <div v-else-if="isEventFull" class="text-center text-gray-500">
              Evento completo
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de autenticación -->
    <div v-if="showAuthMessage" class="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm">{{ authMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template> 