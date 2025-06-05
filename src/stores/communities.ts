import { defineStore } from 'pinia';
import api from '../api';

interface Community {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category_id: number;
  is_public: boolean;
  user_id: number;
  media?: string[];
  member_count?: number;
}

interface CommunitiesState {
  communities: Community[];
  popularCommunities: Community[];
  currentCommunity: Community | null;
  isLoading: boolean;
  error: string | null;
}

export const useCommunitiesStore = defineStore('communities', {
  state: (): CommunitiesState => ({
    communities: [],
    popularCommunities: [],
    currentCommunity: null,
    isLoading: false,
    error: null
  }),
  
  actions: {
    async fetchCommunities() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get('/communities');
        
        if (response.data.success) {
          this.communities = response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener comunidades');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener comunidades';
        this.communities = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchPopularCommunities(limit = 4) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get(`/communities/popular?limit=${limit}`);
        
        if (response.data.success) {
          this.popularCommunities = response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener comunidades populares');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener comunidades populares';
        this.popularCommunities = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchCommunityById(id: number) {
      this.isLoading = true;
      this.error = null;
      this.currentCommunity = null;
      
      try {
        const response = await api.get(`/communities/${id}`);
        
        if (response.data.success) {
          this.currentCommunity = response.data.data;
          return this.currentCommunity;
        } else {
          throw new Error(response.data.message || 'Error al obtener comunidad');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener comunidad';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async joinCommunity(id: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.post(`/communities/${id}/join`);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al unirse a la comunidad');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al unirse a la comunidad';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async getCommunityEvents(id: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get(`/communities/${id}/events`);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener eventos de la comunidad');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener eventos de la comunidad';
        return [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async getCommunityRoutes(id: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get(`/communities/${id}/routes`);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener rutas de la comunidad');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener rutas de la comunidad';
        return [];
      } finally {
        this.isLoading = false;
      }
    }
  }
});