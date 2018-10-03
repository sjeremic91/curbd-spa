<template>
    <div class="edit-card" >
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>

      <b-container fluid >
      <h2 class="mt-2 mb-5">Create Truck</h2>
      <b-nav justified tabs>
        <b-nav-item class="text-md-left" :to="{name: 'create-truck-general'}"><i class="fa fa-info-circle"></i> <span class="d-none d-md-inline"> General</span></b-nav-item>
        <b-nav-item class="text-md-left" disabled :to="{name: 'create-truck-boundaries'}"><i class="fa fa-minus-circle"></i> <span class="d-none d-md-inline"> Boundaries</span></b-nav-item>
        <b-nav-item class="text-md-left" :to="{name: 'create-truck-location'}"><i class="fa fa-map"></i> <span class="d-none d-md-inline"> Location</span></b-nav-item>
      </b-nav>
      <div class="mt-4">
        <router-view></router-view>
      </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {

  computed : mapGetters({truck: 'trucks/singleTruck'}),
  data() {
    return {
      breadcrumbItems: [
        {text: 'Trucks' , to: '/dashboard/trucks'},
        {text: 'Edit Truck' , active: true},
      ]
    }
  },
  async beforeRouteEnter(to, from, next) {
    await next( async vm => {
      vm.$store.dispatch('trucks/initSingle')
      await vm.$store.dispatch('trucks/fetchCategories');
    })

  },
  async beforeRouteUpdate(to, from, next) {
    next();
  }

}
</script>

<style>
.edit-card {
  min-height: calc(100vh - 56px);
  background: white;
  padding-bottom: 100px;
}
</style>
