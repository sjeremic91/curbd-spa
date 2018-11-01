import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VeeValidate from 'vee-validate';
import moment from 'moment'
import * as VueGoogleMaps from 'vue2-google-maps'
import {IMAGE_ROOT, GOOGLE_MAP_KEY} from '@/config/env'

import router from './router'
import store from '@/store'
import '@/config/axios'
import _ from 'lodash'



Vue.use(VeeValidate, { fieldsBagName: 'veeFields' });


//import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false


Vue.prototype.moment = moment;

Vue.prototype.getImage = (path) =>  IMAGE_ROOT+path

Vue.prototype.isMobile = () => {
  let isMobile = false; //initiate as false
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
    }
  return isMobile
}

Vue.use(BootstrapVue);


Vue.use(VueGoogleMaps, {
  load: {
    key: GOOGLE_MAP_KEY,
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

  //Prompt for tutorial
  let user = store.state.auth.user;
  if (!store.state.tutor.startTutor && !store.state.tutor.tutorCanceled && user && user.type == 'vendor' && user.tutorial_checkpoint < 10) {
    let answer = await swal({
      title: 'Start tutorial?',
      buttons: true
    })
    if (answer) {
      //disableScroll();
      const START_TUTORIAL = null;
      const TRUCK_CREATED = 1;
      const CATEGORY_CREATED = 2;
      const MEAL_CREATED = 3;
      console.log(user)
      store.commit('tutor/startTutor');
      if (user.tutorial_checkpoint === START_TUTORIAL) {
        await store.dispatch('goToStep', 'logo');
        next('/dashboard/orders');
        return;
        //router.app.$emit('show-tutor-overlay');
      }
      if (user.tutorial_checkpoint === TRUCK_CREATED)  {
        next('/dashboard/trucks');
        return;
      }
      if (user.tutorial_checkpoint === CATEGORY_CREATED)  {
        await store.dispatch('trucks/fetch')
        let id = store.state.trucks.trucks[store.state.trucks.trucks.length-1].id
        next('/dashboard/trucks/'+id+'/edit/menu');
        store.dispatch('goToStep', 'btn-add-meal');
        return;
      }
      if (user.tutorial_checkpoint === MEAL_CREATED)  {
        await store.dispatch('trucks/fetch')
        let id = store.state.trucks.trucks[store.state.trucks.trucks.length-1].id
        next('/dashboard/trucks/'+id+'/edit/menu');
        store.dispatch('goToStep', 'meal-card');
        return;
      }

      //window.onscroll = () => this.showCurrentStep();
      ///window.ontouchmove = this.showCurrentStep;
      //window.ontouchend = this.showCurrentStep;
    }
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
    else {
      next('/dashboard/orders')
    }
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
