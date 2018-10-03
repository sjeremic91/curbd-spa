import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VeeValidate from 'vee-validate';
import moment from 'moment'
import * as VueGoogleMaps from 'vue2-google-maps'


import router from './router'
import store from '@/store'
import '@/config/axios'
import _ from 'lodash'

Vue.use(VeeValidate, { fieldsBagName: 'veeFields' });


//import 'bootstrap-vue/dist/bootstrap-vue.css';
const IMAGE_ROOT = 'http://192.168.0.29/api-curbd/public/images'

Vue.config.productionTip = false


Vue.prototype.moment = moment;

Vue.prototype.getImage = (path) =>  IMAGE_ROOT+path

Vue.use(BootstrapVue);

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAvSMb7TLdpqKiYkv4vlZFEznxZcOY7si4',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
})

router.beforeEach(async (to, from, next) => {
  store.commit('hideSidebar')
  try {
  if (!store.getters['auth/user'].id)
    await store.dispatch('auth/fetchUser');
  } catch (e) {
    await store.dispatch('auth/logout');
  }
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/isLoggedIn'] && to.matched.some(record => record.meta.visibleTo == store.getters['auth/user'].type)) {
      next()
      return
    }
    store.dispatch('auth/logout')
    next('/login')
    return
  } 
  else if(to.matched.some(record => record.meta.requiresNoAuth)) {
    if (!store.getters['auth/isLoggedIn']) {
      console.log('abc', store.getters['auth/isLoggedIn'])
      next()
      return
    }
    if (store.getters['auth/user'].type == 'admin')
      next('/dashboard/vendors')
    else
      next('/dashboard/orders')
    return
  }
  else {
    next()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
