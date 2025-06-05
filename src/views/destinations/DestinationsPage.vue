<template>
  <div class="container-custom mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold mb-8 text-gray-800">{{ $t('destinations.explore') }}</h1>

    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="$t('destinations.search')"
          class="form-input flex-grow rounded-md border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors"
        >
        <button @click="handleSearch" class="btn-primary">
          {{ $t('common.search') }}
        </button>
      </div>
    </div>

    <!-- Destinations grid -->
    <div v-if="destinationsStore.isLoading">
      <LoadingIndicator />
    </div>
    <div v-else-if="destinationsStore.error" class="text-center py-10">
      <p class="text-red-500 text-lg font-medium">{{ destinationsStore.error }}</p>
    </div>
    <div v-else-if="destinationsStore.destinations.length === 0" class="text-center py-10">
      <p class="text-gray-600 text-lg">{{ $t('common.noResults') }}</p>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="destination in destinationsStore.destinations" :key="destination.id" class="card group bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-xl">
        <div class="h-48 overflow-hidden">
          <img
            :src="destination.media?.length ? destination.media[0] : 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'"
            :alt="destination.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          >
        </div>
        <div class="p-5">
          <h3 class="font-semibold text-xl mb-2 text-gray-800">{{ destination.name }}</h3>
          <p class="text-gray-600 text-sm mb-3">{{ destination.city }}, {{ destination.country }}</p>
          <p class="text-gray-500 text-sm line-clamp-2 mb-4">{{ destination.short_description }}</p>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-primary-600">
              {{ destination.price ? destination.price : 'Gratis' }} {{ destination.currency }}
            </span>
            <router-link :to="`/destinations/${destination.id}`" class="text-secondary-600 hover:text-secondary-700 font-medium">
              {{ $t('common.view') }} →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
      :pagination="destinationsStore.pagination"
      :change-page="changePage"
      :change-page-by-url="changePageByUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDestinationsStore } from '../../stores/destinations';
import LoadingIndicator from '../../components/shared/LoadingIndicator.vue';
import Pagination from '../../components/shared/Pagination.vue';

const router = useRouter();
const destinationsStore = useDestinationsStore();
const searchQuery = ref('');

onMounted(async () => {
  await destinationsStore.fetchDestinations(1, 6, '');
  console.log('Destinations:', destinationsStore.destinations);
  console.log('Is Loading:', destinationsStore.isLoading);
  console.log('Error:', destinationsStore.error);
  console.log('Pagination:', destinationsStore.pagination);
});

const changePage = async (page: number) => {
  if (page >= 1 && page <= destinationsStore.pagination.last_page) {
    await destinationsStore.fetchDestinations(page, 6, searchQuery.value);
  }
};

const handleSearch = async () => {
  await destinationsStore.fetchDestinations(1, 6, searchQuery.value);
  router.push({
    path: '/destinations',
    query: { q: searchQuery.value }
  });
};

const changePageByUrl = async (url: string | null) => {
  if (url) {
    const page = new URL(url).searchParams.get('page');
    if (page) {
      await destinationsStore.fetchDestinations(Number(page), 6, searchQuery.value);
    }
  }
};
</script>