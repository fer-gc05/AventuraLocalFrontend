import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Page components
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/auth/LoginPage.vue';
import RegisterPage from '../views/auth/RegisterPage.vue';
import DestinationsPage from '../views/destinations/DestinationsPage.vue';
import DestinationDetailPage from '../views/destinations/DestinationDetailPage.vue';
import RoutesPage from '../views/routes/RoutesPage.vue';
import RouteDetailPage from '../views/routes/RouteDetailPage.vue';
// import CreateRoutePage from '../views/routes/CreateRoutePage.vue';
// import CommunitiesPage from '../views/communities/CommunitiesPage.vue';
// import CommunityDetailPage from '../views/communities/CommunityDetailPage.vue';
// import EventsPage from '../views/events/EventsPage.vue';
// import EventDetailPage from '../views/events/EventDetailPage.vue';
// import ProfilePage from '../views/user/ProfilePage.vue';
// import NotFoundPage from '../views/NotFoundPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: 'AventuraLocal - Descubre destinos turísticos locales' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: 'Iniciar sesión', guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { title: 'Registrarse', guest: true }
  },
  {
    path: '/destinations',
    name: 'destinations',
    component: DestinationsPage,
    meta: { title: 'Descubre destinos' }
  },
  {
    path: '/destinations/:id',
    name: 'destinationDetail',
    component: DestinationDetailPage,
    props: true,
    meta: { title: 'Detalles del destino' }
  },
  {
    path: '/routes',
    name: 'routes',
    component: RoutesPage,
    meta: { title: 'Rutas turísticas' }
  },
  {
    path: '/routes/:id',
    name: 'routeDetail',
    component: RouteDetailPage,
    props: true,
    meta: { title: 'Detalle de ruta' }
  },
  //  {
  //   path: '/routes/create',
  //   name: 'createRoute',
  //   component: CreateRoutePage,
  //   meta: { title: 'Crear ruta', requiresAuth: true }
  // },
  // {
  //   path: '/communities',
  //   name: 'communities',
  //   component: CommunitiesPage,
  //   meta: { title: 'Comunidades' }
  // },
  // {
  //   path: '/communities/:id',
  //   name: 'communityDetail',
  //   component: CommunityDetailPage,
  //   props: true,
  //   meta: { title: 'Detalle de comunidad' }
  // },
  // {
  //   path: '/events',
  //   name: 'events',
  //   component: EventsPage,
  //   meta: { title: 'Eventos' }
  // },
  // {
  //   path: '/events/:id',
  //   name: 'eventDetail',
  //   component: EventDetailPage,
  //   props: true,
  //   meta: { title: 'Detalle de evento' }
  // },
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   component: ProfilePage,
  //   meta: { title: 'Mi perfil', requiresAuth: true }
  // },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'notFound',
  //   component: NotFoundPage,
  //   meta: { title: 'Página no encontrada' }
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title as string || 'AventuraLocal';
  
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestRoute = to.matched.some(record => record.meta.guest);
  
  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (isGuestRoute && authStore.isAuthenticated) {
    // Redirect to home if route is for guests only and user is authenticated
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;