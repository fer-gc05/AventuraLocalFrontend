<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-photo-container">
        <img :src="userProfile.photo_url || '/default-avatar.png'" alt="Foto de perfil" class="profile-photo">
        <button @click="triggerFileInput" class="change-photo-btn">
          <i class="fas fa-camera"></i>
        </button>
        <input
          type="file"
          ref="fileInput"
          @change="handlePhotoChange"
          accept="image/*"
          class="hidden"
        >
      </div>
      <div class="profile-info">
        <h1>{{ userProfile.name }}</h1>
        <p class="email">{{ userProfile.email }}</p>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <h2>Información Personal</h2>
        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              class="form-control"
            >
          </div>
          <button type="submit" class="btn-primary">Guardar Cambios</button>
        </form>
      </div>

      <div class="profile-stats">
        <div class="stat-card">
          <h3>Rutas Favoritas</h3>
          <p>{{ userStats.favorite_routes_count || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Destinos Favoritos</h3>
          <p>{{ userStats.favorite_destinations_count || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Eventos Asistidos</h3>
          <p>{{ userStats.events_attended_count || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfileView',
  data() {
    return {
      userProfile: {},
      userStats: {},
      formData: {
        name: '',
        email: ''
      }
    }
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.userProfile = response.data;
        this.formData.name = response.data.name;
        this.formData.email = response.data.email;
        await this.fetchUserStats();
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    },
    async fetchUserStats() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${this.userProfile.id}/statistics`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.userStats = response.data;
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    },
    async updateProfile() {
      try {
        await axios.put(`http://127.0.0.1:8000/api/users/${this.userProfile.id}`, this.formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.$toast.success('Perfil actualizado correctamente');
        await this.fetchUserProfile();
      } catch (error) {
        this.$toast.error('Error al actualizar el perfil');
        console.error('Error:', error);
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handlePhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('photo', file);
        
        try {
          await axios.post('http://127.0.0.1:8000/api/users/profile-photo', formData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          this.$toast.success('Foto de perfil actualizada');
          await this.fetchUserProfile();
        } catch (error) {
          this.$toast.error('Error al actualizar la foto de perfil');
          console.error('Error:', error);
        }
      }
    }
  },
  mounted() {
    this.fetchUserProfile();
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.profile-photo-container {
  position: relative;
  width: 150px;
  height: 150px;
}

.profile-photo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.change-photo-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hidden {
  display: none;
}

.profile-info h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.email {
  color: #666;
  margin: 0.5rem 0;
}

.profile-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.profile-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #45a049;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.stat-card p {
  margin: 0.5rem 0 0;
  font-size: 2rem;
  color: #4CAF50;
  font-weight: bold;
}
</style> 