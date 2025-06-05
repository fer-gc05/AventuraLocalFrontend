import { defineStore } from 'pinia';
import api from '../api';

interface Destination {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude: string;
  longitude: string;
  price: number | null;
  currency: string;
  opening_hours: string;
  contact_phone: string;
  contact_email: string;
  category_id: number;
  user_id: number;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
    color: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    pivot: {
      destination_id: number;
      tag_id: number;
    };
  }>;
  media: string[];
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

interface Pagination {
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
  per_page: number;
  links: { url: string | null; label: string; active: boolean; }[];
}

interface DestinationsState {
  destinations: Destination[];
  popularDestinations: Destination[];
  currentDestination: Destination | null;
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
}

export const useDestinationsStore = defineStore('destinations', {
  state: (): DestinationsState => ({
    destinations: [],
    popularDestinations: [],
    currentDestination: null,
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
    async fetchDestinations(page = 1, perPage = 6, search = '') {
      this.isLoading = true;
      this.error = null;

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
        });
        if (search) params.append('search', search);

        const response = await api.get(`/destinations?${params.toString()}`);
        if (response.data.success) {
          this.destinations = response.data.data.data;
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
          throw new Error(response.data.message || 'Error al obtener destinos');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener destinos';
        this.destinations = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPopularDestinations(limit = 6) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get(`/destinations/popular?limit=${limit}`);
        if (response.data.success) {
          this.popularDestinations = response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener destinos populares');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener destinos populares';
        this.popularDestinations = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchDestinationById(id: number) {
      console.log('Fetching destination with ID:', id);
      this.isLoading = true;
      this.error = null;
      this.currentDestination = null;

      try {
        const response = await api.get(`/destinations/${id}`);
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          const destinationData = response.data.data;
          this.currentDestination = {
            ...destinationData,
            latitude: destinationData.latitude.toString(),
            longitude: destinationData.longitude.toString(),
            media: destinationData.media || [],
            tags: destinationData.tags || []
          };
          console.log('Destination set in store:', this.currentDestination);
          return this.currentDestination;
        } else {
          throw new Error(response.data.message || 'Error al obtener destino');
        }
      } catch (error: any) {
        console.error('Error in fetchDestinationById:', error);
        this.error = error.response?.data?.message || 'Error al obtener destino';
        return null;
      } finally {
        this.isLoading = false;
        console.log('Final store state:', {
          isLoading: this.isLoading,
          error: this.error,
          currentDestination: this.currentDestination
        });
      }
    },

    async fetchDestinationReviews(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get(`/destinations/${id}/reviews`);
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener reseñas');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener reseñas';
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async toggleFavoriteDestination(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.post(`/users/destinations/${id}/toggle-favorite`);
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

    async fetchNearbyDestinations(destinationId: number, radius = 50) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get(`/destinations/nearby?destination_id=${destinationId}&radius=${radius}`);
        if (response.data.success) {
          return response.data.data.results;
        } else {
          throw new Error(response.data.message || 'Error al obtener destinos cercanos');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener destinos cercanos';
        return [];
      } finally {
        this.isLoading = false;
      }
    },
  },
});