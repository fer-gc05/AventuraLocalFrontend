<template>
    <div v-if="pagination.total > 0" class="flex justify-center items-center mt-8 space-x-2">
      <!-- Previous button -->
      <button
        @click="changePage(pagination.current_page - 1)"
        :disabled="!pagination.prev_page_url"
        class="btn-pagination"
        :class="{ 'opacity-50 cursor-not-allowed': !pagination.prev_page_url }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
  
      <!-- Page numbers -->
      <button
        v-for="link in filteredLinks"
        :key="link.label"
        @click="changePageByUrl(link.url)"
        :disabled="!link.url || link.active"
        class="btn-pagination"
        :class="{ 'bg-primary-600 text-white': link.active, 'hover:bg-primary-100': link.url && !link.active }"
      >
        {{ link.label }}
      </button>
  
      <!-- Next button -->
      <button
        @click="changePage(pagination.current_page + 1)"
        :disabled="!pagination.next_page_url"
        class="btn-pagination"
        :class="{ 'opacity-50 cursor-not-allowed': !pagination.next_page_url }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  // Definimos las props que el componente necesita
  const props = defineProps<{
    pagination: {
      current_page: number;
      last_page: number;
      links: Array<{ url: string | null; label: string; active: boolean }>;
      prev_page_url: string | null;
      next_page_url: string | null;
      total: number;
    };
    changePage: (page: number) => void;
    changePageByUrl: (url: string | null) => void;
  }>();
  
  // Filtrar enlaces de paginación
  const filteredLinks = computed(() => {
    const links = props.pagination.links || [];
    const currentPage = props.pagination.current_page;
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
  
    let start = Math.max(1, currentPage - half);
    let end = Math.min(props.pagination.last_page, start + maxPagesToShow - 1);
  
    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
  
    return links.filter(link => {
      const pageNumber = parseInt(link.label);
      return !isNaN(pageNumber) && pageNumber >= start && pageNumber <= end;
    });
  });
  </script>