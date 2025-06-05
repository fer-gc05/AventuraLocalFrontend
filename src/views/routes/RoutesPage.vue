<template>
  <div class="container-custom mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold mb-8 text-gray-800">{{ $t('routes.explore') }}</h1>

    <!-- Search bar -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="$t('routes.search')"
          class="form-input flex-grow rounded-md border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        >
        <button @click="handleSearch" class="btn-primary">
          {{ $t('common.search') }}
        </button>
      </div>
    </div>

    <!-- Routes grid -->
    <div v-if="routesStore.isLoading">
      <LoadingIndicator />
    </div>
    <div v-else-if="routesStore.error" class="text-center py-10">
      <p class="text-red-500 text-lg font-medium">{{ routesStore.error }}</p>
    </div>
    <div v-else-if="routesStore.routes.length === 0" class="text-center py-10">
      <p class="text-gray-600 text-lg">{{ $t('common.noResults') }}</p>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="route in routesStore.routes" :key="route.id" class="card group bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-xl">
        <div class="p-5">
          <h3 class="font-semibold text-xl mb-2 text-gray-800">{{ route.name }}</h3>
          <p class="text-gray-600 text-sm mb-2">
            <span :class="difficultyClass(route.difficulty)">{{ $t(`routes.${route.difficulty}`) }}</span>
          </p>
          <p v-if="route.total_distance" class="text-gray-600 text-sm mb-2">
            {{ route.total_distance }} km
          </p>
          <p class="text-gray-500 text-sm line-clamp-2 mb-4">{{ route.description || $t('routes.description') }}</p>
          <div class="flex justify-between items-center">
            <router-link :to="`/routes/${route.id}`" class="text-secondary-600 hover:text-secondary-700 font-medium">
              {{ $t('common.view') }} →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
      :pagination="routesStore.pagination"
      :change-page="changePage"
      :change-page-by-url="changePageByUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoutesStore } from '../../stores/routes';
import LoadingIndicator from '../../components/shared/LoadingIndicator.vue';
import Pagination from '../../components/shared/Pagination.vue';

const router = useRouter();
const routesStore = useRoutesStore();
const searchQuery = ref('');

onMounted(async () => {
  await routesStore.fetchRoutes(1, 6);
  console.log('Routes:', routesStore.routes);
  console.log('Is Loading:', routesStore.isLoading);
  console.log('Error:', routesStore.error);
  console.log('Pagination:', routesStore.pagination);
});

const changePage = async (page: number) => {
  if (page >= 1 && page <= routesStore.pagination.last_page) {
    await routesStore.fetchRoutes(page, 6, searchQuery.value);
  }
};

const changePageByUrl = async (url: string | null) => {
  if (url) {
    const page = new URL(url).searchParams.get('page');
    if (page) {
      await routesStore.fetchRoutes(Number(page), 6, searchQuery.value);
    }
  }
};

const handleSearch = async () => {
  await routesStore.fetchRoutes(1, 6, searchQuery.value);
  router.push({
    path: '/routes',
    query: { q: searchQuery.value }
  });
};

const difficultyClass = (difficulty: string) => {
  return {
    'text-green-600': difficulty === 'easy',
    'text-yellow-600': difficulty === 'medium',
    'text-red-600': difficulty === 'hard',
  };
};
</script>