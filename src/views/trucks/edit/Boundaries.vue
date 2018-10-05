<template>
    <b-row class="justify-content-md-center">
      <b-col lg="8">

        <b-form>
          <b-form-group  horizontal  breakpoint="md"  label="Order Failed" label-for="unsuccessfull-order" description="Unable to handle order message">
            <b-form-textarea id="unsuccessfull-order" value="Sorry we are not able to take your order at this moment. Hope to see you tommorow" rows="3"></b-form-textarea>
          </b-form-group>
          <b-form-group  horizontal  breakpoint="md"  label="Condition 1" label-for="condition1" description="Minimum order fulfilment time">
            <b-input-group>
              <b-input-group-text slot="append">
                minutes
              </b-input-group-text> 
              <b-form-input id="condition1" type="time" v-model="truckDeliveryTime"></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-form-group  class="d-none" horizontal  breakpoint="md"  label="Condition 2" label-for="condition2" description="Maximum items per order">
            <b-input-group prepend="#">
              <b-form-input id="condition2" type="number" v-model="truckMaximumItems"></b-form-input>
            </b-input-group>
          </b-form-group>
          <hr class="mt-5 mb-5">
          <app-shifts></app-shifts>
        </b-form>
      </b-col>
    </b-row>
</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import AppShifts from '@/components/Shifts'

export default {

  components: {AppShifts},
  computed: {
    ...mapGetters({isNewTruck: 'trucks/isNew', truck: 'trucks/singleTruck', categories: 'trucks/categories'}),
    truckDeliveryTime: {
      get() { return this.$store.state.trucks.singleTruck.min_delivery_time },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'min_delivery_time', value}) }
    },
    truckMaximumItems: {
      get() { return this.$store.state.trucks.singleTruck.max_items_per_order },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'max_items_per_order', value}) }
    },
  },
  data() {
    return {
      star: '<span class="text-danger">*</span>',
    }
  },
  created() {
  }
}
</script>
