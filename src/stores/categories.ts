import { defineStore } from 'pinia';
import api from '../api';

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    categories: [],
    currentCategory: null,
    isLoading: false,
    error: null
  }),
  
  actions: {
    async fetchCategories() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get('/categories');
        
        if (response.data.success) {
          this.categories = response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener categorías');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener categorías';
        this.categories = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchCategoryById(id: number) {
      this.isLoading = true;
      this.error = null;
      this.currentCategory = null;
      
      try {
        const response = await api.get(`/categories/${id}`);
        
        if (response.data.success) {
          this.currentCategory = response.data.data;
          return this.currentCategory;
        } else {
          throw new Error(response.data.message || 'Error al obtener categoría');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener categoría';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchCategoryDestinations(id: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get(`/categories/${id}/destinations`);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Error al obtener destinos de la categoría');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener destinos de la categoría';
        return [];
      } finally {
        this.isLoading = false;
      }
    }
  }
});