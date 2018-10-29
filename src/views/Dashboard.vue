<template>
  <div class="wrapper" :class="{'show-sidebar' : showSidebar}">
    <app-header></app-header>
    <div class="app-body">

      <nav class="sidebar" >

        <b-nav vertical >
          <b-nav-item  v-if="$store.getters['auth/hasType']('vendor')" to="/dashboard/orders"> <i class="fa fa-fw fa-list"></i> Orders</b-nav-item>
          <b-nav-item  id="sidebar-truck" v-if="$store.getters['auth/hasType']('vendor')" @click="goToTrucks" > <i class="fa fa-fw fa-truck"></i> Trucks</b-nav-item>
          <b-nav-item v-if="$store.getters['auth/hasType']('admin')" to="/dashboard/vendors"> <i class="fa fa-fw fa-user"></i> Vendors</b-nav-item>
        </b-nav>
      </nav>

      <div class="main">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <div class="alert-wrapper">
      <b-alert class="main-alert" :variant="alertVariant" :show="alertTimer" >{{alertMessage}}</b-alert>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import AppHeader from '@/components/Header.vue'
import {mapGetters, mapState, mapActions} from 'vuex'
export default {
  name: 'dashboard',
  components: {
    AppHeader
  },
  computed: {
    ...mapState(['stepIndex']),
    ...mapGetters(['showSidebar', 'alertVariant', 'alertTimer', 'alertMessage']),
  },
  methods : {
    ...mapActions(['goToStep']),
    goToTrucks() {
      this.$router.push({'name': 'trucks'})
    }
  }
}
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";

.app-body { 
  display: flex;
  width: 100%;
  align-items: stretch;
}

.navbar-brand img {max-height: 25px }

.sidebar {
  min-width: 250px;
  max-width: 250px;
  margin-left: -250px;
  position:fixed;
  margin-top:56px;
  background: $gray-900;
  color: #fff;
  z-index:1020;
  transition: all 0.3s;
  height: calc(100vh - 56px);
  a {
    color: $gray-300;
    i.fa-fw {
      color: $red;
    }

    &:hover {

      background: $gray-700;
    }
  }

  .nav-link.active, .dropdown-item.active {
    color: $primary;
  }


  .nav-item.dropdown {
    .dropdown-menu {
      padding-top: 40px;
      position: static !important;
      background: none;
      width:100%;
      border:none;
      transform: translate3d(0px, 0px, 0px) !important; 
      padding: 0;
      margin: 0;
      max-height: 0;
      overflow:hidden;
      //transition: max-height 0.5s;
      display:block;

      a {
        padding-left: 40px;
        width: 100%;
        &:hover, &:focus {
          background: $gray-700;
          color: $gray-300;
        }
      }
    }

    &.show {
      .dropdown-menu {
        position:static;
        max-height: 200px;
      }
    }
  }
}

.show-sidebar .sidebar {
  margin-left: 0px;
}

.show-sidebar .main {
  margin-left: 250px;
}

.sidebar.active {
  margin-left: -250px;
}

.main {
  background: $gray-200;
  position: relative;
  width:100%;
  margin-top:56px;
  padding-bottom:200px;
  min-height:calc(100vh - 56px);
  transition: all 0.3s;
}



@media (max-width: 992px) {

  .show-sidebar .main {
    margin-left: 0;
  }

  .show-sidebar .main::before, .aside-menu-show .main::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1018;
    width: 100%;
    height: 100vh;
    content: "";
    background: rgba(0, 0, 0, 0.7);
    animation: opacity .25s;
  }
}

.alert-wrapper {
  position: fixed;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  padding: 0 20px;
}

@media (min-width: 992px) {
.alert-wrapper {
  padding: 0 150px;
}
}

@media (min-width: 1400px) {
.alert-wrapper {
  padding: 0 300px;
}
}
</style>
