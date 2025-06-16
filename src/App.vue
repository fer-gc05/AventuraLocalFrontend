<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';
import { useAuthStore } from './stores/auth';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  // Check for saved token and validate on refresh/reload
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await authStore.getUserProfile();
    } catch (error) {
      console.error('Session expired or invalid', error);
      authStore.logout();
      router.push('/login');
    }
  }
});
</script>

<template>
  <div class="app-container min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>