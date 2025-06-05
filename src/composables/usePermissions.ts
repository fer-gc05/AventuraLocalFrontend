import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

export const usePermissions = () => {
  const authStore = useAuthStore();

  const isAdmin = computed(() => authStore.user?.role === 'admin');
  const isTraveler = computed(() => authStore.user?.role === 'traveler');
  const isEntrepreneur = computed(() => authStore.user?.role === 'entrepreneur');
  const isEventOrganizer = computed(() => authStore.user?.role === 'event_organizer');
  const isEventParticipant = computed(() => authStore.user?.role === 'event_participant');

  const canManageEvents = computed(() => 
    isAdmin.value || isEntrepreneur.value || isEventOrganizer.value
  );

  const canViewEvents = computed(() => true); // Todos pueden ver eventos

  const canRegisterForEvents = computed(() => 
    isTraveler.value || isEventParticipant.value
  );

  return {
    isAdmin,
    isTraveler,
    isEntrepreneur,
    isEventOrganizer,
    isEventParticipant,
    canManageEvents,
    canViewEvents,
    canRegisterForEvents
  };
}; 