import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/db'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    component: async () => await import('@/layouts/Public.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: async () => await import('@/views/Home.vue')
      },
      {
        path: 'temporada/:temporada',
        name: 'Temporada',
        component: async () => await import('@/views/Home.vue')
      },
      {
        path: ':temporada/gatador/:id',
        name: 'Gatador',
        component: async () => await import('@/views/Gatador.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: async () => await import('@/layouts/Admin.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: async () => await import('../views/admin/Login.vue')
      },
      {
        path: 'gatadores',
        name: 'AdminGatadores',
        component: async () => await import('../views/admin/GatadorAdmin.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'gatadas',
        name: 'AdminGatadas',
        component: async () => await import('../views/admin/GatadaAdmin.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'temporada',
        name: 'AdminTemporada',
        component: async () => await import('../views/admin/SedeAdmin.vue'),
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '*',
    redirect: { name: 'Home' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const userLogin: boolean = store.getters.isLogin

  if (to.matched.some(view => view.meta.auth) && !userLogin) next({ name: 'Login' })
  else next()
})

export default router
