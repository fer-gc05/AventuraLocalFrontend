<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useAlert } from '../../composables/useAlert';
import api from '../../api';

const authStore = useAuthStore();
const alert = useAlert();
const fileInput = ref<HTMLInputElement | null>(null);
const userStats = ref({
  favorite_routes_count: 0,
  favorite_destinations_count: 0,
  events_attended_count: 0
});

const formData = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || ''
});

const defaultAvatar = computed(() => {
  if (!authStore.user?.email) return '/default-avatar.png';
  // Generar un hash simple del email para mantener consistencia
  const hash = authStore.user.email.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  // Usar el hash para generar un avatar único pero consistente con un estilo más moderno
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${hash}&backgroundColor=4CAF50&textureChance=0&mouthChance=0&sidesChance=0&topChance=0&bottomChance=0&baseColor=4CAF50&backgroundColor=ffffff`;
});

const fetchUserStats = async () => {
  try {
    const response = await api.get(`/users/${authStore.user?.id}/statistics`);
    userStats.value = response.data;
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    alert.error('Error al cargar estadísticas');
  }
};

const updateProfile = async () => {
  try {
    const success = await authStore.updateProfile(formData.value);
    if (success) {
      alert.success('Perfil actualizado correctamente');
    }
  } catch (error) {
    console.error('Error:', error);
    alert.error('Error al actualizar el perfil');
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handlePhotoChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    try {
      const success = await authStore.updateProfilePhoto(file);
      if (success) {
        alert.success('Foto de perfil actualizada');
      }
    } catch (error) {
      console.error('Error:', error);
      alert.error('Error al actualizar la foto de perfil');
    }
  }
};

onMounted(() => {
  if (authStore.user) {
    formData.value.name = authStore.user.name;
    formData.value.email = authStore.user.email;
    fetchUserStats();
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Header del perfil -->
      <div class="flex items-center space-x-6 mb-8">
        <div class="relative">
          <img 
            :src="authStore.user?.profile_photo || defaultAvatar" 
            alt="Foto de perfil" 
            class="w-32 h-32 rounded-full object-cover border-4 border-primary bg-white"
          >
          <button 
            @click="triggerFileInput" 
            class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors shadow-lg"
          >
            <i class="fas fa-camera"></i>
          </button>
          <input
            type="file"
            ref="fileInput"
            @change="handlePhotoChange"
            accept="image/*"
            class="hidden"
          >
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{{ authStore.user?.name }}</h1>
          <p class="text-gray-600">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Información personal -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Información Personal</h2>
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
              </div>
              <button 
                type="submit" 
                class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                :disabled="authStore.isLoading"
              >
                {{ authStore.isLoading ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Estadísticas</h2>
            <div class="space-y-4">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <h3 class="text-sm font-medium text-gray-600">Rutas Favoritas</h3>
                <p class="text-3xl font-bold text-primary">{{ userStats.favorite_routes_count || 0 }}</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <h3 class="text-sm font-medium text-gray-600">Destinos Favoritos</h3>
                <p class="text-3xl font-bold text-primary">{{ userStats.favorite_destinations_count || 0 }}</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <h3 class="text-sm font-medium text-gray-600">Eventos Asistidos</h3>
                <p class="text-3xl font-bold text-primary">{{ userStats.events_attended_count || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-primary {
  background-color: #4CAF50;
}

.bg-primary-dark {
  background-color: #45a049;
}

.text-primary {
  color: #4CAF50;
}

.border-primary {
  border-color: #4CAF50;
}

.focus\:border-primary:focus {
  border-color: #4CAF50;
}

.focus\:ring-primary:focus {
  --tw-ring-color: #4CAF50;
}
</style> 