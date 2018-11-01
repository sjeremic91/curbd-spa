<template>
  <b-row  class="justify-content-md-center">
    <b-col lg="8">
      <b-form @keyup="validateForm" id="general-form">
        <b-form-group  horizontal  breakpoint="md"  :label="'Email ' + star " label-for="email" :invalid-feedback="errors.first('email')">
          <b-form-input :disabled="!isNewTruck" id="email" name="email" v-validate="'required|email'" :state="getState('email')" v-model="truckEmail"></b-form-input>
        </b-form-group>
        <b-form-group  v-if="isNewTruck" horizontal  breakpoint="md"   :label="'Password ' + star " label-for="password" :invalid-feedback="errors.first('password')">
          <b-form-input type="text" id="password" name="password" v-validate="'required'" :state="getState('password')" key="truck-pass" v-model="truckPassword"></b-form-input>
        </b-form-group>
        <b-form-group  v-else horizontal  breakpoint="md"   :label="'Password ' + star " label-for="new-password" >
          <b-input-group >
            <b-form-input type="text" name="new-password" key="truck-update-password" placeholder="Enter New Password" v-model="newPassword"></b-form-input>
            <b-button :disabled="!newPassword.length" @click="updatePassword" slot="append" variant="warning">
              <i class="fa fa-lock"></i>
              Update
            </b-button>
          </b-input-group>
        </b-form-group>
        <hr class="mt-5 mb-5">
        <b-form-group  horizontal  breakpoint="md"  :label="'Truck Name ' + star " label-for="name" :invalid-feedback="errors.first('name')" >
          <b-form-input id="name"  name="name" :state="getState('name')" v-validate="'required'" v-model="truckName"></b-form-input>
        </b-form-group>
        <b-form-group  horizontal  breakpoint="md"  :label="'Description ' + star " label-for="description" :invalid-feedback="errors.first('description')" >
          <b-form-textarea id="description" v-validate="'required'" v-model="truckDescription" name="description" :state="getState('description')" rows="3"></b-form-textarea>
        </b-form-group>

        <b-form-group horizontal  breakpoint="md"  label="Featured Image" >
          <b-form-file v-model="truckImage"  placeholder="Choose a file..."></b-form-file>
        </b-form-group>

        <b-form-group horizontal  breakpoint="md"  :label="'Tax ' + star " label-for="tax" :invalid-feedback="errors.first('tax')">
          <b-form-input id="tax" name="tax" v-validate="'required|decimal'" :state="getState('tax')" v-model="truckTax"></b-form-input>
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
import ErrorStateMixin from '@/mixins/ErrorStateMixin'
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  mixins: [ErrorStateMixin],
  created() {
      /*if (this.currentStep.name == 'add-truck')
        this.goToStep('general-form');
      else
        this.goToStep('step-menu');*/
    this.nextStep();
    console.log('categories', this.categories)
    this.$root.$emit('show-tutor-overlay')
    console.log('categories', this.categories)
  },
  computed: {
    ...mapGetters({currentStep: 'tutor/currentStep', isNewTruck: 'trucks/isNew', truck: 'trucks/singleTruck', categories: 'trucks/categories'}),
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
    ...mapActions(['goToStep', 'nextStep']),
    updatePassword() {
      this.$store.dispatch('trucks/updatePassword', this.newPassword)
    },
    validateForm(val) {
      let res = this.truckEmail.length && this.truckPassword.length && this.truckName.length && this.truckDescription.length && this.truckTax.length && !this.errors.any()
        if (res)
          this.$store.commit('tutor/enableContinue')
        else
          this.$store.commit('tutor/disableContinue')
    }
  }
}
</script>
