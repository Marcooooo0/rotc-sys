import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/LandingPage.vue';
import Auth from '../views/Auth.vue';
import HomePage from '../views/HomePage.vue';
import AnnouncementManager from '../views/AnnouncementManager.vue';


// Update this path if you move supabase.js to a better location like @/lib/
import { getUser } from '../views/supabase.js';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: true }, // Protected route
  },
  {
    path: '/officer/announcements',
    name: 'OfficerAnnouncements',
    component: AnnouncementManager,
    meta: { requiresAuth: true, role: 'officer' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const session = await getUser(); // Always check session

  // ✅ 1. Redirect logged-in users from / or /auth to /home
  if ((to.path === '/' || to.path === '/auth') && session) {
    return next('/home');
  }

  // ✅ 2. Redirect unauthenticated users from protected routes
  if (to.meta.requiresAuth && !session) {
    return next('/auth');
  }

  // ✅ 3. Role-based route guard
  if (to.meta.role && session) {
    const userRole = session.user.user_metadata?.role;

    // 🪵 Debug logs
    console.log('User session:', session);
    console.log('User metadata:', session.user.user_metadata);
    console.log('User role:', userRole);
    console.log('Required role:', to.meta.role);

    if (!userRole || userRole.toLowerCase() !== to.meta.role.toLowerCase()) {
      console.warn(`Role mismatch: user has "${userRole}", but route requires "${to.meta.role}"`);
      return next('/home'); // Or redirect to an error page if needed
    }
  }

  // ✅ 4. Allow access
  return next();
});

export default router;
