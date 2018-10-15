<template>
    <div class="edit-card" >
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <b-container fluid >
        <div class="d-flex pt-4 mb-3 justify-content-between">
          <h4>{{title}}</h4>
          <div class="align-self-start">
          <b-button class="mr-3" @click="saveTruck()" variant="success">Save All</b-button>
          <b-button v-if="!isNew" @click="deleteTruck()" variant="danger"><i class="fa fa-trash"></i> Delete</b-button>
          
          </div>
        </div>
      <b-nav v-if="!isNew" justified tabs>
        <b-nav-item class="text-md-left" :to="{name: 'truck-general'}"><i class="fa fa-info-circle"></i> <span class="d-none d-md-inline"> General</span></b-nav-item>
        <b-nav-item class="text-md-left" :to="{name: 'truck-boundaries'}"><i class="fa fa-minus-circle"></i> <span class="d-none d-md-inline"> Boundaries</span></b-nav-item>
        <b-nav-item class="text-md-left" :to="{name: 'truck-location'}"><i class="fa fa-map"></i> <span class="d-none d-md-inline"> Location</span></b-nav-item>
        <b-nav-item class="text-md-left" :to="{name: 'truck-menu'}"><i class="fa fa-coffee"></i> <span class="d-none d-md-inline"> Menu</span></b-nav-item>
      </b-nav>
      <b-nav v-else justified tabs>
        <b-nav-item class="text-md-left" :to="{name: 'create-truck-general'}"><i class="fa fa-info-circle"></i> <span class="d-none d-md-inline"> General</span></b-nav-item>
        <b-nav-item class="text-md-left" :to="{name: 'create-truck-boundaries'}"><i class="fa fa-minus-circle"></i> <span class="d-none d-md-inline"> Boundaries</span></b-nav-item>
        <b-nav-item class="text-md-left" :to="{name: 'create-truck-location'}"><i class="fa fa-map"></i> <span class="d-none d-md-inline"> Location</span></b-nav-item>
        <b-nav-item class="text-md-left" disabled><i class="fa fa-coffee"></i> <span class="d-none d-md-inline"> Menu</span></b-nav-item>
      </b-nav>
      <div class="mt-4">
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
    ...mapGetters({truck: 'trucks/singleTruck'}),
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
  async beforeRouteEnter(to, from, next) {
    await next( async vm => {
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
