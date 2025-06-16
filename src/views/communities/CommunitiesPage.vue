<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCommunitiesStore } from '../../stores/communities';


const communitiesStore = useCommunitiesStore();

// Estado local
const searchQuery = ref('');
const selectedCategory = ref('');
const showAuthMessage = ref(false);
const authMessage = 'Para esta acción debes hacer parte de nuestro gran equipo.';

// Comunidades filtradas
const filteredCommunities = computed(() => {
  let result = communitiesStore.communitiesList;
  
  if (searchQuery.value) {
    result = result.filter(community => 
      community.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (selectedCategory.value) {
    result = result.filter(community => 
      String(community.category_id) === selectedCategory.value
    );
  }
  
  return result;
});

// Cargar comunidades al montar el componente
onMounted(async () => {
  await communitiesStore.fetchCommunities();
});





</script>

<template>
  <div class="container-custom mx-auto py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">Comunidades</h1>
      <p class="text-gray-600">
        Únete a comunidades de viajeros, comparte experiencias y
        conecta con personas que comparten tus intereses.
      </p>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Búsqueda -->
        <div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar comunidades..."
            class="form-input w-full"
          >
        </div>

        <!-- Filtro por categoría -->
        <div>
          <select v-model="selectedCategory" class="form-select w-full">
            <option value="">Todas las categorías</option>
            <option value="nature">Naturaleza</option>
            <option value="culture">Cultura</option>
            <option value="adventure">Aventura</option>
            <option value="food">Gastronomía</option>
            <option value="photography">Fotografía</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Mensaje de autenticación -->
    <div v-if="showAuthMessage" class="alert alert-warning mb-4">
      {{ authMessage }}
    </div>

    <!-- Lista de comunidades -->
    <div v-if="communitiesStore.isLoading" class="text-center py-10">
      <p>Cargando comunidades...</p>
    </div>

    <div v-else-if="communitiesStore.error" class="text-center py-10">
      <p class="text-red-500">{{ communitiesStore.error }}</p>
    </div>

    <div v-else-if="filteredCommunities.length === 0" class="text-center py-10">
      <p>No se encontraron comunidades que coincidan con los criterios de búsqueda.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="community in filteredCommunities"
        :key="community.id"
        class="card group"
      >
        <!-- Imagen de la comunidad -->
        <div class="h-48 overflow-hidden">
          <img
            :src="community.media?.[0] || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'"
            :alt="community.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          >
        </div>

        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2">{{ community.name }}</h3>
          
          <!-- Categoría -->
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span class="capitalize">{{ community.category?.name || 'Sin categoría' }}</span>
          </div>

          <!-- Descripción -->
          <p class="text-gray-500 line-clamp-2 mb-4">
            {{ community.description || 'Sin descripción' }}
          </p>

          <!-- Miembros -->
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{{ community.member_count || 0 }} miembros</span>
          </div>

          <!-- Botones -->
          <div class="flex justify-between items-center">
            <router-link
              :to="`/communities/${community.id}`"
              class="text-secondary-600 hover:text-secondary-700"
            >
              Ver detalles →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 