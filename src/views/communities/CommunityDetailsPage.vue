<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCommunitiesStore } from '../../stores/communities';
import { useAuthStore } from '../../stores/auth';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Event {
  id: number;
  title: string;
  description?: string;
  start_datetime: string;
  location: string;
  price?: number;
  currency?: string;
}


const route = useRoute();
const router = useRouter();
const communitiesStore = useCommunitiesStore();
const authStore = useAuthStore();

const communityId = computed(() => Number(route.params.id));
const isMember = ref(false);
const showAuthMessage = ref(false);
const authMessage = ref('Para unirte a comunidades debes iniciar sesión como viajero.');
const communityEvents = ref<Event[]>([]);

const modules = [Navigation, Pagination];

// Verificar si el usuario es Traveler
const isTraveler = computed(() => {
  return authStore.user?.role === 'Traveler';
});

// Cargar datos de la comunidad y sus eventos
onMounted(async () => {
  await communitiesStore.fetchCommunityById(communityId.value);
  const events = await communitiesStore.getCommunityEvents(communityId.value);
  // Asegurarse de que communityEvents sea siempre un array de eventos
  communityEvents.value = Array.isArray(events) ? events : (events?.data ?? []);
  if (
    communitiesStore.currentCommunity &&
    Array.isArray(communitiesStore.currentCommunity.users) &&
    authStore.user
  ) {
    isMember.value = communitiesStore.currentCommunity.users.some(
      user => user.id === Number(authStore.user?.id)
    );
  } else {
    isMember.value = false;
  }
});

// Manejar unión a la comunidad
const handleJoin = async () => {
  if (!authStore.isAuthenticated) {
    showAuthMessage.value = true;
    setTimeout(() => {
      showAuthMessage.value = false;
    }, 3000);
    return;
  }

  if (!isTraveler.value) {
    showAuthMessage.value = true;
    authMessage.value = 'Solo los viajeros pueden unirse a comunidades.';
    setTimeout(() => {
      showAuthMessage.value = false;
    }, 3000);
    return;
  }

  try {
    if (isMember.value) {
      const success = await communitiesStore.leaveCommunity(communityId.value);
      if (success) {
        isMember.value = false;
        showAuthMessage.value = true;
        authMessage.value = 'Has abandonado la comunidad exitosamente';
        setTimeout(() => {
          showAuthMessage.value = false;
        }, 3000);
      }
    } else {
      await communitiesStore.joinCommunity(communityId.value);
      isMember.value = true;
      showAuthMessage.value = true;
      authMessage.value = 'Te has unido a la comunidad exitosamente';
      setTimeout(() => {
        showAuthMessage.value = false;
      }, 3000);
    }
    await communitiesStore.fetchCommunityById(communityId.value);
  } catch (error) {
    console.error('Error al manejar la membresía:', error);
    showAuthMessage.value = true;
    authMessage.value = communitiesStore.error || 'Error al procesar la solicitud';
    setTimeout(() => {
      showAuthMessage.value = false;
    }, 3000);
  }
};

// Función para obtener una imagen basada en el tipo de comunidad
const getCommunityImage = () => {
  const communityName = communitiesStore.currentCommunity?.name?.toLowerCase() || '';
  const communityDescription = communitiesStore.currentCommunity?.description?.toLowerCase() || '';
  const communityText = `${communityName} ${communityDescription}`;

  const communityImages = {
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

  // Buscar coincidencias en el texto de la comunidad
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => communityText.includes(word))) {
      const images = communityImages[category as keyof typeof communityImages];
      return images[Math.floor(Math.random() * images.length)];
    }
  }

  // Si no hay coincidencias, usar imágenes por defecto
  const defaultImages = communityImages.default;
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
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
    <!-- Estado de carga -->
    <div v-if="communitiesStore.isLoading" class="text-center py-10">
      <p>Cargando comunidad...</p>
    </div>

    <!-- Error -->
    <div v-else-if="communitiesStore.error" class="text-center py-10">
      <p class="text-red-500">{{ communitiesStore.error }}</p>
    </div>

    <!-- Comunidad no encontrada -->
    <div v-else-if="!communitiesStore.currentCommunity" class="text-center py-10">
      <p>Comunidad no encontrada</p>
    </div>

    <!-- Detalles de la comunidad -->
    <div v-else class="max-w-4xl mx-auto">
      <!-- Encabezado -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 class="text-4xl font-extrabold text-primary-900 mb-2 tracking-tight">{{ communitiesStore.currentCommunity.name }}</h1>
            <div class="flex items-center gap-2 text-gray-500 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
              </svg>
              <span class="capitalize font-medium">{{ communitiesStore.currentCommunity.category?.name || 'Sin categoría' }}</span>
            </div>
            <div v-if="communitiesStore.currentCommunity.category?.description" class="text-gray-400 text-base mt-1">
              {{ communitiesStore.currentCommunity.category.description }}
            </div>
            <div class="text-sm text-gray-400 mt-2">
              Creada por <span class="font-semibold">{{ communitiesStore.currentCommunity.user?.name || 'Desconocido' }}</span> el <span class="font-semibold">{{ new Date(communitiesStore.currentCommunity.created_at).toLocaleDateString('es-ES') }}</span>
            </div>
            <div class="text-sm text-gray-400 mt-1">
              Miembros: <span class="font-semibold">{{ communitiesStore.currentCommunity.users?.length || 0 }}</span>
            </div>
          </div>
          <button
            v-if="authStore.isAuthenticated && isTraveler"
            @click="handleJoin"
            class="transition-all duration-200 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transform hover:scale-105"
            :class="{ 'bg-red-600 hover:bg-red-700': isMember }"
          >
            {{ isMember ? 'Abandonar comunidad' : 'Unirse a la comunidad' }}
          </button>
          <button
            v-else
            @click="handleJoin"
            class="transition-all duration-200 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transform hover:scale-105"
          >
            Inicia sesión como viajero para unirte
          </button>
        </div>
      </div>

      <!-- Imagen principal -->
      <div class="relative h-80 mb-8 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
        <img
          :src="getCommunityImage()"
          :alt="communitiesStore.currentCommunity.name"
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
              {{ communitiesStore.currentCommunity.description || 'Sin descripción' }}
            </p>
          </div>

          <!-- Reglas -->
          <div class="bg-white rounded-xl shadow-md p-8 mb-6 border border-gray-100">
            <h2 class="text-2xl font-bold mb-4 text-primary-900">Reglas</h2>
            <p class="text-gray-700 whitespace-pre-line text-lg">
              {{ communitiesStore.currentCommunity.rules || 'No hay reglas establecidas' }}
            </p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Estadísticas -->
          <div class="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <h3 class="text-xl font-bold mb-4 text-primary-900">Estadísticas</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Comunidad creada el</span>
                <span class="font-semibold">{{ new Date(communitiesStore.currentCommunity.created_at).toLocaleDateString('es-ES') }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total de miembros</span>
                <span class="font-semibold">{{ communitiesStore.currentCommunity.users?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Eventos -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4 text-primary-900">Eventos de la comunidad</h2>
        <div v-if="communitiesStore.isLoading" class="text-center py-10">
          <p>Cargando eventos...</p>
        </div>
        <div v-else-if="communityEvents.length === 0" class="text-center py-10">
          <p>No hay eventos programados en esta comunidad.</p>
        </div>
        <div v-else>
          <Swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="24"
            :breakpoints="{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }"
            navigation
            pagination
            class="mySwiper"
          >
            <SwiperSlide v-for="event in communityEvents" :key="event.id">
              <div class="event-card group cursor-pointer transition-transform duration-300 hover:scale-105 shadow-lg rounded-2xl bg-white border border-gray-100 flex flex-col h-full" @click="router.push(`/events/${event.id}`)">
                <div class="p-6 flex-1 flex flex-col">
                  <h3 class="font-bold text-xl mb-2 text-primary-900">{{ event.title }}</h3>
                  <!-- Fecha -->
                  <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDate(event.start_datetime) }}</span>
                  </div>
                  <!-- Ubicación -->
                  <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ event.location }}</span>
                  </div>
                  <!-- Descripción -->
                  <p class="text-gray-500 line-clamp-2 mb-4 flex-1">
                    {{ event.description || 'Sin descripción' }}
                  </p>
                  <!-- Precio y botón -->
                  <div class="flex justify-between items-center mt-auto pt-2">
                    <span v-if="event.price" class="font-bold text-green-600 text-lg">
                      {{ event.price.toLocaleString('es-CO', { style: 'currency', currency: event.currency || 'COP', minimumFractionDigits: 0 }) }}
                    </span>
                    <span v-else class="text-green-600 font-medium">Gratis</span>
                    <span class="text-secondary-600 group-hover:text-secondary-700 font-semibold">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
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

<style scoped>
.mySwiper {
  padding-bottom: 40px;
}
.event-card {
  min-height: 320px;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 1.25rem;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.07);
  border: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
}
.event-card:hover {
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.12);
  transform: translateY(-4px) scale(1.03);
}
.swiper-button-next, .swiper-button-prev {
  color: #2563eb;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
  width: 40px;
  height: 40px;
  top: 45%;
}
.swiper-button-next:after, .swiper-button-prev:after {
  font-size: 1.5rem;
  font-weight: bold;
}
.swiper-pagination-bullet {
  background: #2563eb;
  opacity: 0.5;
}
.swiper-pagination-bullet-active {
  background: #2563eb;
  opacity: 1;
}
</style> 