import { defineStore } from 'pinia';
import api from '../api';

interface User {
  id: string;
  name: string;
  email: string;
  profile_photo?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userRole: (state) => state.user?.role
  },
  
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.post('/auth/login', { email, password });
        
        if (response.data.success) {
          const { token } = response.data;
          this.token = token;
          localStorage.setItem('token', token);
          
          // Fetch user profile after successful login
          await this.getUserProfile();
          return true;
        } else {
          throw new Error(response.data.message || 'Error al iniciar sesión');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async register(userData: any) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const formData = new FormData();
        
        // Append all user data to formData
        Object.keys(userData).forEach(key => {
          if (userData[key] !== null && userData[key] !== undefined) {
            formData.append(key, userData[key]);
          }
        });
        
        const response = await api.post('/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.success) {
          return true;
        } else {
          throw new Error(response.data.message || 'Error al registrarse');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al registrarse';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async getUserProfile() {
      if (!this.token) return null;
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get('/auth/me');
        
        if (response.data.success) {
          this.user = response.data.user;
          return this.user;
        } else {
          throw new Error(response.data.message || 'Error al obtener perfil');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener perfil';
        this.logout();
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async logout() {
      this.isLoading = true;
      
      try {
        if (this.token) {
          await api.post('/auth/logout');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        // Clear user data regardless of API response
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        this.isLoading = false;
      }
    },
    
    async updateProfile(userData: Partial<User>) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.put(`/users/${this.user?.id}`, userData);
        
        if (response.data.success) {
          this.user = response.data.data;
          return true;
        } else {
          throw new Error(response.data.message || 'Error al actualizar perfil');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar perfil';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async updateProfilePhoto(photo: File) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const formData = new FormData();
        formData.append('profile_photo', photo);
        
        const response = await api.post('/users/profile-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.success) {
          if (this.user) {
            this.user.profile_photo = response.data.profile_photo;
          }
          return true;
        } else {
          throw new Error(response.data.message || 'Error al actualizar foto de perfil');
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar foto de perfil';
        return false;
      } finally {
        this.isLoading = false;
      }
    }
  }
});