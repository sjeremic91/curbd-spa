<template>
  <b-row  class="justify-content-md-center">
    <b-col lg="8">
      <b-form>
        <b-form-group  horizontal  breakpoint="md"   :label="'Email ' + star " label-for="email" >
          <b-form-input :disabled="!isNewTruck" id="email" v-model="truckEmail"></b-form-input>
        </b-form-group>
        <b-form-group  horizontal  breakpoint="md"   :label="'Password ' + star " label-for="password" >
          <b-form-input v-if="isNewTruck" type="text" id="password" v-model="truckPassword"></b-form-input>
          <b-input-group v-else>
            <b-form-input type="text" id="password" placeholder="Enter New Password" v-model="newPassword"></b-form-input>
            <b-button :disabled="!newPassword.length" @click="updatePassword" slot="append" variant="warning">
              <i class="fa fa-lock"></i>
              Update
            </b-button>
          </b-input-group>
        </b-form-group>
        <hr class="mt-5 mb-5">
        <b-form-group  horizontal  breakpoint="md"  :label="'Truck Name ' + star " label-for="name" >
          <b-form-input id="name" v-model="truckName"></b-form-input>
        </b-form-group>
        <b-form-group  horizontal  breakpoint="md"  :label="'Description ' + star " label-for="description" >
          <b-form-textarea id="description" v-model="truckDescription" rows="3"></b-form-textarea>
        </b-form-group>

        <b-form-group horizontal  breakpoint="md"  label="Featured Image" >
          <b-form-file v-model="truckImage"  placeholder="Choose a file..."></b-form-file>
        </b-form-group>

        <b-form-group horizontal  breakpoint="md"  :label="'Tax ' + star " label-for="tax">
          <b-form-input id="tax" v-model="truckTax"></b-form-input>
        </b-form-group>
        <hr class="mt-5 mb-5">
        <b-form-group horizontal  breakpoint="md"  label="Category">
          <b-form-checkbox-group stacked id="checkboxes2" name="flavour2" v-model="truckCategories">
            <b-form-checkbox :key="category.id" v-for="category in categories" :value="category.id">{{category.name}}</b-form-checkbox>
          </b-form-checkbox-group> 
        </b-form-group>
        <hr>

      </b-form>

    </b-col>

  </b-row>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'


export default {

  computed: {
    ...mapGetters({isNewTruck: 'trucks/isNew', truck: 'trucks/singleTruck', categories: 'trucks/categories'}),
    truckCategories: {
      get() { return this.$store.state.trucks.singleTruck.categories },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'categories', value}) }
    },
    truckEmail: {
      get() { return this.$store.state.trucks.singleTruck.email },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'email', value}) }
    },
    truckPassword: {
      get() { return this.$store.state.trucks.singleTruck.password },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'password', value}) }
    },
    truckName: {
      get() { return this.$store.state.trucks.singleTruck.name },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'name', value}) }
    },
    truckDescription: {
      get() { return this.$store.state.trucks.singleTruck.description },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'description', value}) }
    },
    truckTax: {
      get() { return this.$store.state.trucks.singleTruck.tax },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'tax', value}) }
    },
    truckImage: {
      get() { return this.$store.state.trucks.truckImage },
      set(value) { return this.$store.commit('trucks/setTruckImage', value) }
    },

  },
  data() {
    return {
      star: '<span class="text-danger">*</span>',
      newPassword: ''
    }
  },
  methods: {

    updatePassword() {
      this.$store.dispatch('trucks/updatePassword', this.newPassword)
    },
  }
}
</script>
