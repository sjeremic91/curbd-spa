<template>
    <div class="edit-card pb-5" >
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <b-container fluid >
        <b-row class="mb-2">
          <h4 class="col-6">{{title}}</h4>
          <div class="d-flex flex-row-reverse col-6">
            <b-button v-if="!isNew" size="sm" @click="deleteTruck()" variant="danger"><i class="fa fa-trash"></i> Delete</b-button>
            <b-button class="mr-1" size="sm" id="save-truck" @click="saveTruck()" variant="success">Save</b-button>
          </div>
        </b-row>
      <b-nav v-if="!isNew" justified tabs>
        <b-nav-item class="text-md-left" :to="{name: 'truck-general'}"><i class="fa fa-info-circle"></i> <span class="d-none d-md-inline"> General</span></b-nav-item>
        <b-nav-item class="text-md-left"  :to="{name: 'truck-boundaries'}"><i class="fa fa-minus-circle"></i> <span class="d-none d-md-inline"> Boundaries</span></b-nav-item>
        <b-nav-item class="text-md-left" :to="{name: 'truck-location'}"><i class="fa fa-map"></i> <span class="d-none d-md-inline"> Location</span></b-nav-item>
        <b-nav-item class="text-md-left" id="step-menu" @click="goToMenu"><i class="fa fa-coffee"></i> <span class="d-none d-md-inline"> Menu</span></b-nav-item>
      </b-nav>
      <b-nav v-else justified tabs>
        <b-nav-item class="text-md-left" :to="{name: 'create-truck-general'}"><i class="fa fa-info-circle"></i> <span class="d-none d-md-inline"> General</span></b-nav-item>
        <b-nav-item class="text-md-left" id="step-boundaries" :to="{name: 'create-truck-boundaries'}"><i class="fa fa-minus-circle"></i> <span class="d-none d-md-inline"> Boundaries</span></b-nav-item>
        <b-nav-item class="text-md-left" id="step-location" :to="{name: 'create-truck-location'}"><i class="fa fa-map"></i> <span class="d-none d-md-inline"> Location</span></b-nav-item>
        <b-nav-item class="text-md-left" disabled><i class="fa fa-coffee"></i> <span class="d-none d-md-inline"> Menu</span></b-nav-item>
      </b-nav>
      <div class="mt-4 mb-5 pb-5">
        <transition name="slide-fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
      </b-container>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {

  computed : {
    ...mapGetters({truck: 'trucks/singleTruck', currentStep: 'tutor/currentStep'}),
    isNew() {
      return this.$route.matched.some(m => m.name == 'create-truck')
    },
    title() {
      return  !this.isNew ? 'Edit Truck' : 'Create Truck'
    }
  },
  data() {
    return {
      breadcrumbItems: [
        {text: 'Trucks' , to: '/dashboard/trucks'},
        {text: 'Truck Details' , active: true},
      ]
    }
  },

  beforeRouteEnter(to, from, next) {
    next( async vm => {
      console.log('poceo');
      if (!vm.isNew)  {
        try {
        await vm.$store.dispatch('trucks/fetchSingle', to.params.id);
        vm.$store.commit('trucks/setSelectedMealCategoryId', vm.truck.mealCategories.length ? vm.truck.mealCategories[0].id : null)
        } catch (e) {
          vm.$router.push({name: 'trucks'})
        }
      } else {
        vm.$store.dispatch('trucks/initSingle')
      }
      await vm.$store.dispatch('trucks/fetchCategories');
      vm.$root.$emit('show-tutor-overlay')
      console.log('gotovo');
    })
    console.log('izasao');

  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == 'truck-general' && (to.params.id != from.params.id)) {
      await this.$store.dispatch('trucks/fetchSingle', to.params.id);
      this.$store.commit('trucks/setSelectedMealCategoryId', this.truck.mealCategories.length ? this.truck.mealCategories[0].id : null)
    }
    next();
  },
  methods: {
    goToMenu() {
      this.$router.push({name: 'truck-menu'})
      this.$store.dispatch('nextStep');
      setTimeout(() => {
        this.$root.$emit('show-tutor-overlay')
      }, 500)
    },
    async saveTruck() {
      await this.$store.dispatch('trucks/saveTruck')
      this.$router.push({name: 'trucks'})
    },
    async deleteTruck() {
      await this.$store.dispatch('trucks/deleteTruck', this.truck)
      this.$router.push({name: 'trucks'})
    }
  }

}
</script>

<style>
.edit-card {
  min-height: calc(100vh - 56px);
  background: white;
}
</style>
