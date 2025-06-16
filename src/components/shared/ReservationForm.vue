<template>
  <div class="fixed inset-0 z-[120] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
      <h2 class="text-2xl font-bold mb-6 text-primary-800">Reservar destino</h2>
      <form @submit.prevent="submitReservation">
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1">Fecha de inicio</label>
          <input type="date" v-model="startDate" class="input w-full" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1">Fecha de fin</label>
          <input type="date" v-model="endDate" class="input w-full" required :min="startDate" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1">Participantes</label>
          <input type="number" v-model.number="participants" min="1" class="input w-full" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1">Solicitudes especiales</label>
          <textarea v-model="specialRequests" class="input w-full" rows="2" placeholder="Opcional"></textarea>
        </div>
        <div v-if="error" class="mb-4 text-red-600 text-sm">{{ error }}</div>
        <div v-if="success" class="mb-4 text-green-600 text-sm">¡Reserva realizada con éxito!</div>
        <button type="submit" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200">
          <span v-if="loading">Procesando...</span>
          <span v-else>Confirmar reserva</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  destinationId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['close', 'success']);

const startDate = ref('');
const endDate = ref('');
const participants = ref(1);
const specialRequests = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const authStore = useAuthStore();

watch(startDate, (val) => {
  if (endDate.value && endDate.value < val) {
    endDate.value = val;
  }
});

const submitReservation = async () => {
  error.value = '';
  success.value = false;
  if (!startDate.value || !endDate.value || !participants.value) {
    error.value = 'Todos los campos son obligatorios';
    return;
  }
  if (endDate.value < startDate.value) {
    error.value = 'La fecha de fin debe ser posterior a la de inicio';
    return;
  }
  loading.value = true;
  try {
    await axios.post(
      '/api/reservations',
      {
        destination_id: props.destinationId,
        start_date: startDate.value,
        end_date: endDate.value,
        participants: participants.value,
        special_requests: specialRequests.value
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }
    );
    success.value = true;
    emit('success');
    setTimeout(() => {
      emit('close');
    }, 1200);
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al realizar la reserva';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition;
}
.animate-fadeIn {
  animation: fadeIn 0.2s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 