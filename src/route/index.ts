import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/db'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: () => import('@/layouts/Public.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/gatador/:id',
        name: 'Gatador',
        component: () => import('@/views/Gatador.vue'),
        beforeEnter: (to, from, next) => {
          store.commit('SET_CURRENT_GATADOR', {id: to.params.id})
          next()
        }
      },
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/Admin.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('../views/admin/Login.vue')
      },
      {
        path: 'gatadores',
        name: 'AdminGatadores',
        component: () => import('../views/admin/GatadorAdmin.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'gatadas',
        name: 'AdminGatadas',
        component: () => import('../views/admin/GatadaAdmin.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'sedes',
        name: 'AdminSedes',
        component: () => import('../views/admin/SedeAdmin.vue'),
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
  const userLogin = store.getters.isLogin

  if (to.matched.some(view => view.meta.auth) && !userLogin) next({ name: 'Login' })
  else next()
})

export default router
