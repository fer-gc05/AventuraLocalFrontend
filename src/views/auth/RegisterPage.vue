<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('Traveler');
const profilePhoto = ref<File | null>(null);
const validationErrors = ref<Record<string, string>>({});

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    profilePhoto.value = input.files[0];
  }
};

const validateForm = () => {
  const errors: Record<string, string> = {};
  
  if (!name.value) {
    errors.name = 'El nombre es obligatorio';
  }
  
  if (!email.value) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Introduce un correo electrónico válido';
  }
  
  if (!password.value) {
    errors.password = 'La contraseña es obligatoria';
  } else if (password.value.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }
  
  if (!confirmPassword.value) {
    errors.confirmPassword = 'Confirma tu contraseña';
  } else if (password.value !== confirmPassword.value) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const handleRegister = async () => {
  if (!validateForm()) return;
  
  const userData = {
    name: name.value,
    email: email.value,
    password: password.value,
    confirm_password: confirmPassword.value,
    role: role.value,
    profile_photo: profilePhoto.value
  };
  
  const success = await authStore.register(userData);
  
  if (success) {
    router.push('/login');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-3xl font-bold text-gray-900">
          {{ $t('auth.register') }}
        </h1>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.alreadyAccount') }}
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            {{ $t('auth.signIn') }}
          </router-link>
        </p>
      </div>
      
      <div v-if="authStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ authStore.error }}</span>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.name') }}
            </label>
            <input 
              id="name" 
              v-model="name" 
              name="name" 
              type="text" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
            <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">
              {{ validationErrors.name }}
            </p>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.email') }}
            </label>
            <input 
              id="email" 
              v-model="email" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
            <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600">
              {{ validationErrors.email }}
            </p>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.password') }}
            </label>
            <input 
              id="password" 
              v-model="password" 
              name="password" 
              type="password" 
              autocomplete="new-password" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
            <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600">
              {{ validationErrors.password }}
            </p>
          </div>
          
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.confirmPassword') }}
            </label>
            <input 
              id="confirm-password" 
              v-model="confirmPassword" 
              name="confirm-password" 
              type="password" 
              autocomplete="new-password" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
            <p v-if="validationErrors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ validationErrors.confirmPassword }}
            </p>
          </div>
          
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.role') }}
            </label>
            <select 
              id="role" 
              v-model="role" 
              name="role" 
              class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="Traveler">{{ $t('auth.traveler') }}</option>
              <option value="Entrepreneur">{{ $t('auth.entrepreneur') }}</option>
            </select>
          </div>
          
          <div>
            <label for="profile-photo" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.profilePhoto') }}
            </label>
            <input 
              id="profile-photo" 
              type="file" 
              accept="image/*" 
              @change="handleFileUpload" 
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            >
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
              {{ $t('auth.register') }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>