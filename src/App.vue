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

.swal-title {
  font-weight: normal;
  font-size: 28px;
}

.swal-button {
  display: inline-block;
  font-weight: $btn-font-weight;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: $btn-border-width solid transparent;
  @include button-size($btn-padding-y, $btn-padding-x, $font-size-base, $btn-line-height, $btn-border-radius);
  @include transition($btn-transition);

  // Share hover and focus styles
  @include hover-focus {
    text-decoration: none;
  }

  &:focus,
  &.focus {
    outline: 0;
    box-shadow: $btn-focus-box-shadow;
  }

  // Disabled comes first so active can properly restyle
  &.disabled,
  &:disabled {
    opacity: $btn-disabled-opacity;
    @include box-shadow(none);
  }

  // Opinionated: add "hand" cursor to non-disabled .btn elements
  &:not(:disabled):not(.disabled) {
    cursor: pointer;
  }

  &:not(:disabled):not(.disabled):active,
  &:not(:disabled):not(.disabled).active {
    @include box-shadow($btn-active-box-shadow);

    &:focus {
      @include box-shadow($btn-focus-box-shadow, $btn-active-box-shadow);
    }
  }
}

.swal-button--confirm {
  @include button-variant($primary, $primary);
}

.swal-button--cancel {
  @include button-variant($secondary, $secondary);
}

.fixed-body {
  position: fixed;
  width: 100%;
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
