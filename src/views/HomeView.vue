<section class="mb-12">
  <h2 class="text-3xl font-extrabold text-primary-900 mb-6">Próximos eventos</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div v-for="event in upcomingEvents" :key="event.id" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
      <img :src="event.media?.[0] || 'https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg'" :alt="event.name" class="h-48 w-full object-cover transition-transform duration-300 hover:scale-105">
      <div class="p-6 flex-1 flex flex-col">
        <h3 class="text-xl font-bold text-primary-900 mb-2">{{ event.name }}</h3>
        <div class="text-gray-500 text-sm mb-2">{{ new Date(event.start_date).toLocaleDateString('es-ES') }}</div>
        <p class="text-gray-700 flex-1 mb-4">{{ event.description?.slice(0, 100) || 'Sin descripción' }}...</p>
        <router-link :to="`/events/${event.id}`" class="mt-auto inline-block transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transform hover:scale-105">Ver detalles</router-link>
      </div>
    </div>
  </div>
</section> 