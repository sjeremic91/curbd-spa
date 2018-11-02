<template>
  <b-navbar id="app-navbar" fixed="top" toggleable="md" type="dark" variant="primary">

    <div id="logo" >
      <b-navbar-brand  @click="toggleSidebar()" href="#">
        <img @load="prepareOverlay();" src="../assets/img/logo.png" alt="Logo">
      </b-navbar-brand>

    </div>

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>


    <b-collapse is-nav id="nav_collapse">


      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">


        <b-nav-item-dropdown right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{user.email}}</em>
          </template>
          <!--b-dropdown-item href="#">Profile</b-dropdown-item-->
          <b-dropdown-item @click="startTutorial()">Tutorial</b-dropdown-item>
          <b-dropdown-item @click="logout()">Signout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
import {mapMutations, mapActions, mapState} from 'vuex';

export default {
  computed: {
    ...mapState({user: (state) => state.auth.user, truck: (state) => state.trucks.singleTruck, stepIndex : (state)=> state.stepIndex}),
  },
  methods: {
    prepareOverlay() {
      let currentStep = this.$store.getters['tutor/currentStep']
      if (currentStep && currentStep.name == 'logo')
        this.$root.$emit('show-tutor-overlay')
    },

    async logout() {
      await this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    async startTutorial() {
      this.$store.commit('tutor/startTutor');
     this.$store.dispatch('goToStep', 'logo');
      this.$router.push('/dashboard/orders');
      this.$root.$emit('show-tutor-overlay')
    },
    async toggleSidebar() {
      await this.$store.dispatch('toggleSidebar')
      this.$root.$emit('show-tutor-overlay')
    }
  }

}
</script>
