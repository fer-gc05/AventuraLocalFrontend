import { defineStore } from 'pinia';
import api from '../api';

interface RouteDestination {
  id: number;
  name: string;
  short_description?: string;
  latitude: string; // Changed to string to match endpoint
  longitude: string; // Changed to string to match endpoint
  media?: string[];
}

interface TravelRoute {
  id: number;
  name: string;
  slug: string; // Added to match endpoint
  description?: string;
  total_distance?: string; // Changed to string to match endpoint
  estimated_duration?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  user_id: number;
  destinations?: RouteDestination[];
  created_at?: string;
  media?: string[];
  best_season?: string;
}

interface RoutesState {
  routes: TravelRoute[];
  popularRoutes: TravelRoute[];
  currentRoute: TravelRoute | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    per_page: number;
    links: any[];
  };
}

export const useRoutesStore = defineStore('routes', {
  state: (): RoutesState => ({
    routes: [],
    popularRoutes: [],
    currentRoute: null,
    isLoading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
      total: 0,
      per_page: 6,
      links: [],
    },
  }),

  actions: {
    async fetchRoutes(page = 1, perPage = 6, search = '') {
      this.isLoading = true;
      this.error = null;

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
        });
        if (search) params.append('name', search);

        const response = await api.get(`/routes?${params.toString()}`);

        if (response.data.success) {
          this.routes = response.data.data.data;
          this.pagination = {
            current_page: response.data.data.current_page,
            last_page: response.data.data.last_page,
            next_page_url: response.data.data.next_page_url,
            prev_page_url: response.data.data.prev_page_url,
            total: response.data.data.total,
            per_page: response.data.data.per_page,
            links: response.data.data.links || [],
          };
        } else {
          throw new Error(response.data.message || 'Error al obtener rutas');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener rutas';
        this.routes = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPopularRoutes(limit = 4) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get(`/routes/popular?limit=${limit}`);

        if (response.data.success) {
          this.popularRoutes = response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener rutas populares');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener rutas populares';
        this.popularRoutes = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRouteById(id: number) {
      this.isLoading = true;
      this.error = null;
      this.currentRoute = null;

      try {
        const response = await api.get(`/routes/${id}`);

        if (response.data.success) {
          this.currentRoute = response.data.data;
          return this.currentRoute;
        } else {
          throw new Error(response.data.message || 'Error al obtener ruta');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener ruta';
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async createRoute(routeData: Partial<TravelRoute>) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.post('/routes', routeData);

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al crear ruta');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear ruta';
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async updateRoute(id: number, routeData: Partial<TravelRoute>) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.put(`/routes/${id}`, routeData);

        if (response.data.success) {
          if (this.currentRoute && this.currentRoute.id === id) {
            this.currentRoute = response.data.data;
          }
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al actualizar ruta');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar ruta';
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async toggleFavoriteRoute(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.post(`/users/routes/${id}/toggle-favorite`);

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al añadir a favoritos');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al añadir a favoritos';
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async updateRouteStatus(id: number, status: 'pending' | 'in_progress' | 'completed') {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.post(`/users/routes/${id}/update-status`, { status });

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al actualizar estado de la ruta');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar estado de la ruta';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});