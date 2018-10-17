<template>
  <div class="container-fluid">
    <div class="d-flex mb-5 mt-4 justify-content-between">
    
    <h4>Trucks</h4>
    <b-form-group v-if="!connectingTruck">
      <b-button id="v-step-3" @click="addTruck" to="" variant="primary">Add Truck</b-button>   
    </b-form-group>
    </div>

    <b-row v-if="!connectingTruck">
      <b-col sm="12" md="6" lg="4" class="mb-3" v-for="truck in trucks">
        <app-truck :truck="truck" :key="truck.id" @edit-truck="$router.push('/dashboard/trucks/'+$event.id+'/edit/general')"></app-truck>
      </b-col>
    </b-row> 

    <h1 class="text-muted text-center" v-if="connectingTruck">Connecting Truck, Please Wait...</h1>
  </div>
</template>

<script>
import AppTruck from '@/components/Truck'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import axios from 'axios'

export default {
  components: {AppTruck},
  computed: mapGetters({trucks: 'trucks/trucks'}),
  data() {
    return {
      connectingTruck: false
    }
  },
  async created() {
    let code = this.$route.query.code
    console.log(code)
    let truck_id = localStorage.getItem('truckId')
    if (code && truck_id) {
      this.connectingTruck = true
      await axios.get(`api/stripe/create-vendor?code=${code}&id=${truck_id}`)
      localStorage.removeItem('truckId')
      swal('Good job!', 'Truck is connected', 'success')
      this.connectingTruck = false
    }
    await this.fetch();
    this.setStepIndex(3)
  },
  methods: {
    ...mapActions({fetch: 'trucks/fetch'}),
    ...mapMutations(['setStepIndex']),
    addTruck() {
      this.$router.push('/dashboard/trucks/create/general');
    }
  }


}

</script>
