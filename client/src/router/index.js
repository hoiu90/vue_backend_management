import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        redirect: '/dashboard/home'
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'express',
        name: 'Express',
        component: () => import('@/views/Express.vue')
      },
      {
        path: 'insurance',
        name: 'Insurance',
        component: () => import('@/views/Insurance.vue')
      },
      {
        path: 'secondhand',
        name: 'SecondHand',
        component: () => import('@/views/SecondHand.vue')
      },
      {
        path: 'errand',
        name: 'Errand',
        component: () => import('@/views/Errand.vue')
      },
      {
        path: 'housing',
        name: 'Housing',
        component: () => import('@/views/Housing.vue')
      },
      {
        path: 'tips',
        name: 'Tips',
        component: () => import('@/views/Tips.vue')
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router; 