import { defineStore } from 'pinia';
import api from '../api';

interface Event {
  id: number;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  location: string;
  latitude: number;
  longitude: number;
  price?: number;
  currency?: string;
  max_attendees?: number;
  destination_id: number;
  user_id: number;
  media?: string[];
}

interface EventsState {
  events: Event[];
  popularEvents: Event[];
  upcomingEvents: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
}

export const useEventsStore = defineStore('events', {
  state: (): EventsState => ({
    events: [],
    popularEvents: [],
    upcomingEvents: [],
    currentEvent: null,
    isLoading: false,
    error: null
  }),
  
  actions: {
    async fetchEvents() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get('/events');
        
        if (response.data.success) {
          this.events = response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener eventos');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener eventos';
        this.events = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchPopularEvents(limit = 4) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get(`/events/popular?limit=${limit}`);
        
        if (response.data.success) {
          this.popularEvents = response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener eventos populares');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener eventos populares';
        this.popularEvents = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchUpcomingEvents() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get(`/events/upcoming/`);
        
        if (response.data.success) {
          this.upcomingEvents = response.data.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener próximos eventos');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener próximos eventos';
        this.upcomingEvents = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchEventById(id: number) {
      this.isLoading = true;
      this.error = null;
      this.currentEvent = null;
      
      try {
        const response = await api.get(`/events/${id}`);
        
        if (response.data.success) {
          this.currentEvent = response.data.data;
          return this.currentEvent;
        } else {
          throw new Error(response.data.message || 'Error al obtener evento');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener evento';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async attendEvent(id: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.post(`/events/${id}/attend`);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al asistir al evento');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al asistir al evento';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async cancelAttendance(id: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.post(`/events/${id}/cancel-attendance`);
        
        if (response.data.success) {
          return true;
        } else {
          throw new Error(response.data.message || 'Error al cancelar asistencia');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cancelar asistencia';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async getEventAttendees(id: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get(`/events/${id}/attendees`);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener asistentes');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener asistentes';
        return [];
      } finally {
        this.isLoading = false;
      }
    }
  }
});