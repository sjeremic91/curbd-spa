<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <app-tutor ref="tutor"></app-tutor>
  </div>
</template>

<script>
import axios from 'axios'
import AppTutor from '@/components/Tutor';
export default {

  components: {AppTutor},
  mounted() {
    window.addEventListener('load', () => {
         // run after everything is in-place
      //this.$tours['myTour'].start()
    })

  },
  async created() {
    axios.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('auth/logout')
        }
        throw err;
      });
    });
    
  }
}
</script>
<style lang="scss">
@import "./assets/scss/_variables.scss";
@import 'bootstrap/scss/bootstrap.scss';
@import url('https://fonts.googleapis.com/css?family=Montserrat');
//@import '/bootstrap-vue/dist/bootstrap-vue.css';

body {
  font-family: 'Montserrat', sans-serif;
}

.overflow-container {
  overflow: auto;
}

.table {
 white-space: nowrap;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter {
  transform: translateX(100px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.v-step {
  z-index: 99999;
}

.focused-element {
  z-index: 100000 !important;
  position: relative;
}
</style>
