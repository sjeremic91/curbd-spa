<template>
  <b-card no-body class="h-100" >
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

    <b-card-body class="d-flex flex-column justify-content-between">
      <div class="d-flex mb-2">

        <img :src="getImage('/trucks/'+imgName)" class="mr-3 w-25 align-self-start img-thumbnail">

        <p class="card-text">
        <i class="fa fa-truck"></i> <strong> Description:</strong>
        {{truck.description}} 
        </p>
      </div>
      <div class="mt-auto">
        <a v-if="truck.stripe_acc" href="#" @click.prevent="disconnect">
          <b-badge variant="danger">Disconnect from Stripe</b-badge>
        </a>
        <a v-else href="#" @click.prevent="connect">
          <b-badge variant="warning">Connect to Stripe</b-badge>
        </a>
      </div>

    </b-card-body>
  </b-card>
</template>

<script>
import {mapActions} from 'vuex'
import axios from 'axios'
import {STRIPE_CLIENT_ID, STRIPE_REDIRECT_URI} from '@/config/env'

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
    imgName() {
      return this.truck.featured_image_path ? this.truck.featured_image_path : 'noimagefound.jpg'
    },
    stripeUrl() {
      return `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${STRIPE_REDIRECT_URI}` 
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

