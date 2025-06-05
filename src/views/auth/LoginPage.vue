<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const validationErrors = ref<Record<string, string>>({});

const validateForm = () => {
  const errors: Record<string, string> = {};
  
  if (!email.value) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Introduce un correo electrónico válido';
  }
  
  if (!password.value) {
    errors.password = 'La contraseña es obligatoria';
  }
  
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const handleLogin = async () => {
  if (!validateForm()) return;
  
  const success = await authStore.login(email.value, password.value);
  
  if (success) {
    // Redirect to the requested page or home
    const redirectPath = route.query.redirect as string || '/';
    router.push(redirectPath);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-3xl font-bold text-gray-900">
          {{ $t('auth.login') }}
        </h1>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.noAccount') }}
          <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            {{ $t('auth.signUp') }}
          </router-link>
        </p>
      </div>
      
      <div v-if="authStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ authStore.error }}</span>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">{{ $t('auth.email') }}</label>
            <input 
              id="email" 
              v-model="email" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
              :placeholder="$t('auth.email')"
            >
            <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600">
              {{ validationErrors.email }}
            </p>
          </div>
          <div>
            <label for="password" class="sr-only">{{ $t('auth.password') }}</label>
            <input 
              id="password" 
              v-model="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
              :placeholder="$t('auth.password')"
            >
            <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600">
              {{ validationErrors.password }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              v-model="rememberMe" 
              name="remember-me" 
              type="checkbox" 
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              {{ $t('auth.rememberMe') }}
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              {{ $t('auth.forgotPassword') }}
            </a>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading">
              Cargando...
            </span>
            <span v-else>
              {{ $t('auth.login') }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>