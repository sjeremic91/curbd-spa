import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import Vendors from './views/vendors/Vendors.vue'
import EditVendor from './views/vendors/Edit.vue'
import Login from './views/Login.vue'
import Orders from './views/Orders.vue'
import Trucks from './views/trucks/Trucks.vue'
import EditTruck from './views/trucks/Edit.vue'
import TruckGeneral from './views/trucks/edit/General.vue'
import TruckBoundaries from './views/trucks/edit/Boundaries.vue'
import TruckMenu from './views/trucks/edit/Menu.vue'
import TruckLocation from './views/trucks/edit/Location.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresNoAuth: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: 'vendors',
          name: 'vendors',
          component: Vendors,
          meta: {
            requiresAuth: true,
            visibleTo: 'admin'
          },
        },
        {
          path: 'vendors/create',
          name: 'vendor-create',
          component: EditVendor,
          meta: {
            requiresAuth: true,
            visibleTo: 'admin'
          },
        },
        {
          path: 'vendors/:id/edit',
          name: 'vendor-edit',
          component: EditVendor,
          meta: {
            requiresAuth: true,
            visibleTo: 'admin'
          },
        },
        {
          path: 'orders',
          component : Orders,
          name: 'orders',
          meta: {
            requiresAuth: true,
            visibleTo: 'vendor'
          }
        },
        {
          path: 'trucks',
          component : Trucks,
          name: 'trucks',
          meta: {
            requiresAuth: true,
            visibleTo: 'vendor'
          }
        },
        {
          path: 'trucks/create',
          component : EditTruck,
          name: 'create-truck',
          meta: {
            requiresAuth: true,
            visibleTo: 'vendor'
          },
          children: [
            {
              path: 'general',
              name: 'create-truck-general',
              component: TruckGeneral
            },
            {
              path: 'boundaries',
              name: 'create-truck-boundaries',
              component: TruckBoundaries
            },
            {
              path: 'location',
              name: 'create-truck-location',
              component: TruckLocation
            },
          ]
        },
        {
          path: 'trucks/:id/edit',
          component : EditTruck,
          name: 'edit-truck',
          meta: {
            requiresAuth: true,
            visibleTo: 'vendor'
          },
          children: [
            {
              path: 'general',
              name: 'truck-general',
              component: TruckGeneral
            },
            {
              path: 'boundaries',
              name: 'truck-boundaries',
              component: TruckBoundaries
            },
            {
              path: 'location',
              name: 'truck-location',
              component: TruckLocation
            },
            {
              path: 'menu',
              name: 'truck-menu',
              component: TruckMenu
            },
          ]
        }
      ] 
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ],
})
