import { defineStore } from 'pinia';
import api from '../api';
import { useAuthStore } from './auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

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
  is_member?: boolean;
  users?: User[];
  category?: Category;
  user?: User;
  created_at: string;
  rules?: string;
}

interface CommunitiesState {
  communities: {
    data: Community[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  popularCommunities: Community[];
  currentCommunity: Community | null;
  isLoading: boolean;
  error: string | null;
}

export const useCommunitiesStore = defineStore('communities', {
  state: (): CommunitiesState => ({
    communities: null,
    popularCommunities: [],
    currentCommunity: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    communitiesList: (state) => state.communities?.data || [],
  },
  
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
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.error = 'Debes iniciar sesión como viajero para realizar esta acción.';
        } else {
          this.error = error.response?.data?.message || 'Error al obtener comunidades';
        }
        this.communities = null;
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
          this.popularCommunities = response.data.data || [];
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
          // Actualizar el estado de la comunidad actual
          if (this.currentCommunity?.id === id) {
            this.currentCommunity.is_member = true;
          }
          // Actualizar el estado en la lista de comunidades
          if (this.communities?.data) {
            const communityIndex = this.communities.data.findIndex(c => c.id === id);
            if (communityIndex !== -1) {
              this.communities.data[communityIndex].is_member = true;
            }
          }
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

    async leaveCommunity(id: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.post(`/communities/${id}/leave`);
        
        if (response.data.success) {
          const authStore = useAuthStore();
          // Actualizar el estado de la comunidad actual
          if (this.currentCommunity?.id === id) {
            this.currentCommunity.is_member = false;
            // Actualizar también la lista de usuarios
            if (this.currentCommunity.users) {
              this.currentCommunity.users = this.currentCommunity.users.filter(
                user => user.id !== (authStore.user?.id || 0)
              );
            }
          }
          
          // Actualizar el estado en la lista de comunidades
          if (this.communities?.data) {
            const communityIndex = this.communities.data.findIndex(c => c.id === id);
            if (communityIndex !== -1) {
              this.communities.data[communityIndex].is_member = false;
              // Actualizar también el contador de miembros
              if (this.communities.data[communityIndex].member_count) {
                this.communities.data[communityIndex].member_count--;
              }
            }
          }
          
          return true;
        } else {
          throw new Error(response.data.message || 'Error al abandonar la comunidad');
        }
      } catch (error: any) {
        if (error.response?.status === 403) {
          this.error = 'No puedes abandonar esta comunidad porque eres el administrador';
        } else {
          this.error = error.response?.data?.message || 'Error al abandonar la comunidad';
        }
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async getCommunityMembers(id: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get(`/communities/${id}/members`);
        
        if (response.data.success) {
          return response.data.data || [];
        } else {
          throw new Error(response.data.message || 'Error al obtener miembros de la comunidad');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener miembros de la comunidad';
        return [];
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
          this.error = response.data.message || 'Error al obtener eventos de la comunidad';
          return [];
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener eventos de la comunidad';
        console.error('Error al obtener eventos:', error);
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
          return response.data.data || [];
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