import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/update/:id',
      name: 'update',
      component: () => import('../views/UpdateView.vue')
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../views/product/ProductsView.vue')
    },
    {
      path: '/updateproduct/:id',
      name: 'updateproduct',
      component: () => import('../views/product/UpdateproductView.vue')
    },
    {
      path: '/createproduct',
      name: 'createproduct',
      component: () => import('../views/product/CreateproductView.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/user/UserView.vue')
    },
    {
      path: '/updateuser/:id',
      name: 'updateuser',
      component: () => import('../views/user/UpdateuserView.vue')
    },
    {
      path: '/createuser',
      name: 'createuser',
      component: () => import('../views/user/CreateuserView.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/order/OrderView.vue')
    },
    {
      path: '/updateorder/:id',
      name: 'updateorder',
      component: () => import('../views/order/UpdateorderView.vue')
    },
    {
      path: '/createorder',
      name: 'createorder',
      component: () => import('../views/order/Createorderview.vue')
    },
  ],
})

export default router
