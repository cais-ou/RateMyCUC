import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/main' },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: '/main',
          name: 'Main',
          component: () => import('../pages/main.vue')
        },
        {
          path: 'courselist',
          component: () => import('../pages/courselist.vue'),
        },
        {
          path: '/search/',
          component: () => import('../pages/search.vue'),
          props: route => ({ keyword: route.query.keyword }),
        },
        {
          path: '/review/:classID',
          name: 'Review',
          component: () => import('../pages/review.vue'),
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../pages/profile.vue'),
        },
        {
          path:'about-us',
          component: () => import('../pages/about-us.vue'),
        },
        {
          path:'role',
          component: () => import('../pages/role.vue'),
        }
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          path: 'login',
          component: () => import('../pages/login.vue'),
        },
        {
          path: 'register',
          component: () => import('../pages/register.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          name: '404',
          component: () => import('../pages/[...all].vue'),
        },
      ],
    },
  ],
})

export default router
