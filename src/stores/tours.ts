import { defineStore } from 'pinia';
import api from '../api';

interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_days: number;
  max_participants: number;
  start_date: string;
  end_date: string;
  destinations: any[];
  user_id: number;
  media?: string[];
}

interface ToursState {
  tours: Tour[];
  currentTour: Tour | null;
  isLoading: boolean;
  error: string | null;
}

export const useToursStore = defineStore('tours', {
  state: (): ToursState => ({
    tours: [],
    currentTour: null,
    isLoading: false,
    error: null
  }),
  
  actions: {
    async fetchTours() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get('/tours');
        
        if (response.data.success) {
          this.tours = response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener tours');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener tours';
        this.tours = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchTourById(id: number) {
      this.isLoading = true;
      this.error = null;
      this.currentTour = null;
      
      try {
        const response = await api.get(`/tours/${id}`);
        
        if (response.data.success) {
          this.currentTour = response.data.data;
          return this.currentTour;
        } else {
          throw new Error(response.data.message || 'Error al obtener tour');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener tour';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async createTour(tourData: Partial<Tour>) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.post('/tours', tourData);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al crear tour');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear tour';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async updateTour(id: number, tourData: Partial<Tour>) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.put(`/tours/${id}`, tourData);
        
        if (response.data.success) {
          if (this.currentTour && this.currentTour.id === id) {
            this.currentTour = response.data.data;
          }
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al actualizar tour');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar tour';
        return null;
      } finally {
        this.isLoading = false;
      }
    }
  }
});