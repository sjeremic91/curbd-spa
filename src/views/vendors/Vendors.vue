<template>
  <b-container fluid>
    <b-card class="mt-2" >
      <div class="d-flex justify-content-between">
      <h4 class="card-title">Vendors</h4>
      <b-button to="/dashboard/vendors/create" variant="primary">Create Vendor</b-button>
      </div>
      <p class="card-text">Starting point for creating new vendors and manage existing.</p>
      <b-list-group>
        <b-list-group-item :key="vendor.id" v-for="vendor in vendors">
          <b-row>
            <b-col class="mb-2" cols="12" sm="6" md="4" xl="3">
              <strong> <i class="fa fa-user"></i> {{vendor.company_name}}</strong>
            </b-col>
            <b-col class="mb-2 text-sm-right text-md-left" cols="12" sm="6" md="5" xl="3">
              <b-link :href="'mailto:'+vendor.email"> <i class="fa fa-envelope"></i> {{vendor.email}}</b-link>
            </b-col>
            <b-col class="mb-2 text-md-right" cols="12" sm="6" md="3" xl="2">
              <b-link :href="'tel:'+vendor.phone"><i class="fa fa-phone"></i> {{vendor.phone ? vendor.phone : 'Not Available'}}</b-link>
            </b-col>
            <b-col class="align-self-center text-sm-right text-md-left text-xl-right" cols="4" sm="6" md="6" xl="2">
              ${{vendor.fee}}
            </b-col>
            <b-col cols="8" md="6" xl="2" class="text-right" >
              <b-button class="mr-1" variant="warning" :to="'/dashboard/vendors/'+vendor.id+'/edit'" size="sm"><i class="fa fa-edit"></i></b-button>
              <b-button class="mr-1" @click="validateVendor(vendor)" :variant="isValidVendor(vendor)" size="sm"><i class="fa fa-check-circle"></i></b-button>
              <b-button variant="danger" @click="promptDelete(vendor.id)" size="sm"><i class="fa fa-trash"></i></b-button>
            </b-col>
          </b-row>
        
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-container>
</template>

<script>

import {mapState} from 'vuex'

export default {
  computed : mapState({vendors : state => state.vendors.vendors}),
  async beforeRouteEnter(to, from, next) {
    await next(async vm => { 
      await vm.$store.dispatch('vendors/fetchVendors');
    })
  },
  methods: {
    promptDelete(id) {
      swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await this.$store.dispatch('vendors/deleteVendor', id)
        }
      });
    },
    isValidVendor(vendor) {
      return vendor.user.verified ? 'success' : 'danger'
    },
    validateVendor(vendor) {
      this.$store.dispatch('vendors/validate', vendor)
    }
  }
}
</script>
