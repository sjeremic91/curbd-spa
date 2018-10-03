<template>
  <b-card class="h-100" >
    <div slot="header" class="d-flex justify-content-between">
      <strong class="align-self-center">
        #{{truck.name}}
        <a target="_blank" :href="mapLink">
          <i class="fa fa-map-marker text-danger"></i>
        </a>
      </strong> 
      <div class="d-flex flex-nowrap align-self-start">
        <b-button size="sm" class="mr-2" variant="warning" @click="$emit('edit-truck', truck)">
          <i class="fa fa-edit"></i>
        </b-button>
        <b-button size="sm mr-2" :variant="truck.published ? 'success' : 'danger'" @click="publish(truck)">
          <i class="fa fa-eye"></i>
        </b-button>
        <b-button size="sm" :variant="truck.user.verified ? 'success' : 'danger'" @click="verify(truck)">
          <i class="fa fa-check"></i>
        </b-button>
      </div>
    </div>

    <div class="d-flex flex-column justify-content-between">
      <div class="d-flex">

        <img :src="getImage('/trucks/'+truck.featured_image_path)" class="mr-3 w-25 align-self-start img-thumbnail">

        <p class="card-text">
        <i class="fa fa-truck"></i> <strong> Description:</strong>
        {{truck.description}} 
        </p>
      </div>
      <div class="mt-2">
        <a v-if="truck.stripe_acc" href="#" @click.prevent="disconnect">
          <b-badge variant="danger">Disconnect from Stripe</b-badge>
        </a>
        <a v-else href="#" @click.prevent="connect">
          <b-badge variant="warning">Connect to Stripe</b-badge>
        </a>
      </div>

    </div>
  </b-card>
</template>

<script>
import {mapActions} from 'vuex'
import axios from 'axios'
export default {
  props: {
    truck: {
      required: true,
      type: Object
    }
  },
  computed: {
    mapLink() {
      return `http://maps.google.com/maps?q=${this.truck.latitude},${this.truck.longitude}`;
    },
    stripeUrl() {
      return 'https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_DiEuWG3LP5IskJR5W37loj8WwYbdbSzs&scope=read_write&redirect_uri=http://localhost:8081/dashboard/trucks' 
    },
  },
  methods: {
    ...mapActions({publish: 'trucks/publish', verify: 'trucks/verify'}),
    async disconnect() {
      await axios.post('api/stripe/truck/'+this.truck.id+'/disconnect')
      await this.$store.dispatch('trucks/fetch')
    },
    connect() {
      localStorage.setItem('truckId', this.truck.id)
      window.location.href = this.stripeUrl
    }
  }
}

</script>

