<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const logout = async () => {
  await authStore.logout();
  router.push('/login');
  closeMenu();
};
</script>

<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container-custom mx-auto">
      <nav class="flex items-center justify-between py-4">
        <!-- Logo and site name -->
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-2xl font-display font-bold text-primary-600">AventuraLocal</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <router-link to="/" class="font-medium text-gray-700 hover:text-primary-600 transition-colors">
            {{ $t('navigation.home') }}
          </router-link>
          <router-link to="/destinations" class="font-medium text-gray-700 hover:text-primary-600 transition-colors">
            {{ $t('navigation.destinations') }}
          </router-link>
          <router-link to="/routes" class="font-medium text-gray-700 hover:text-primary-600 transition-colors">
            {{ $t('navigation.routes') }}
          </router-link>
          <router-link to="/communities" class="font-medium text-gray-700 hover:text-primary-600 transition-colors">
            {{ $t('navigation.communities') }}
          </router-link>
          <router-link to="/events" class="font-medium text-gray-700 hover:text-primary-600 transition-colors">
            {{ $t('navigation.events') }}
          </router-link>
          
          <!-- Auth Links -->
          <template v-if="isAuthenticated">
            <div class="relative ml-3">
              <div @click="toggleMenu" class="flex items-center gap-2 cursor-pointer">
                <span class="text-sm font-medium text-gray-700">{{ user?.name }}</span>
                <img 
                  :src="user?.profile_photo || 'https://via.placeholder.com/40'" 
                  alt="Profile" 
                  class="h-8 w-8 rounded-full object-cover"
                >
              </div>
              
              <!-- Profile dropdown -->
              <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <router-link to="/profile" @click="closeMenu" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {{ $t('navigation.profile') }}
                </router-link>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {{ $t('navigation.logout') }}
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-outline">
              {{ $t('navigation.login') }}
            </router-link>
            <router-link to="/register" class="btn-primary">
              {{ $t('navigation.register') }}
            </router-link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button @click="toggleMenu" class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-800">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </nav>
      
      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="md:hidden py-2 space-y-1">
        <router-link to="/" @click="closeMenu" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
          {{ $t('navigation.home') }}
        </router-link>
        <router-link to="/destinations" @click="closeMenu" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
          {{ $t('navigation.destinations') }}
        </router-link>
        <router-link to="/routes" @click="closeMenu" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
          {{ $t('navigation.routes') }}
        </router-link>
        <router-link to="/communities" @click="closeMenu" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
          {{ $t('navigation.communities') }}
        </router-link>
        <router-link to="/events" @click="closeMenu" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
          {{ $t('navigation.events') }}
        </router-link>
        
        <!-- Mobile Auth Links -->
        <template v-if="isAuthenticated">
          <router-link to="/profile" @click="closeMenu" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            {{ $t('navigation.profile') }}
          </router-link>
          <button @click="logout" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            {{ $t('navigation.logout') }}
          </button>
        </template>
        <template v-else>
          <router-link to="/login" @click="closeMenu" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            {{ $t('navigation.login') }}
          </router-link>
          <router-link to="/register" @click="closeMenu" class="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-100">
            {{ $t('navigation.register') }}
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>