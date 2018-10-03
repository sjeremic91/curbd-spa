<template>
  <b-container fluid>
    <b-row class="justify-content-center">
      <b-col xl="8">
        <b-card title="Vendor details">
          <b-form @submit.prevent="submit">
            <b-form-group horizontal :invalid-feedback="errors.first('first name')" label="First Name">
              <b-form-input name="first name" :state="getState('first name')" v-validate="'required'" v-model="vendor.first_name" placeholder="First Name"></b-form-input>
            </b-form-group>
            <b-form-group horizontal label="Last Name" :invalid-feedback="errors.first('last name')">
              <b-form-input v-validate="'required'" name="last name" :state="getState('last name')" v-model="vendor.last_name" placeholder="Last Name"></b-form-input>
            </b-form-group>
            <b-form-group horizontal label="Company Name" :invalid-feedback="errors.first('company name')">
              <b-form-input v-validate="'required'" name="company name" :state="getState('company name')" v-model="vendor.company_name" placeholder="Company Name"></b-form-input>
            </b-form-group>
            <b-form-group horizontal label="Status">
              <b-form-checkbox v-model="vendor.status">Is Active</b-form-checkbox>
            </b-form-group>
            <hr>
            <b-form-group horizontal label="Email" :invalid-feedback="errors.first('email')">
              <b-form-input v-model="vendor.email" v-validate="'required|email'" name="email" :state="getState('email')" placeholder="Email"></b-form-input>
            </b-form-group>
            <b-form-group horizontal label="Password" :invalid-feedback="errors.first('password')">
              <b-form-input v-validate="'required'" name="password" v-model="vendor.password" :state="getState('password')" placeholder="Password"></b-form-input>
            </b-form-group>
            <hr>
            <b-form-group horizontal label="Phone">
              <b-form-input v-model="vendor.phone" placeholder="Phone"></b-form-input>
            </b-form-group>
            <b-form-group horizontal label="Street">
              <b-form-input v-model="vendor.address" placeholder="Street"></b-form-input>
            </b-form-group>
            <b-form-group horizontal label="City and Zip">
              <b-form-row>
                <b-col>
                  <b-form-input v-model="vendor.city" placeholder="City"></b-form-input>
                </b-col>
                <b-col>
                  <b-form-input v-model="vendor.zip" placeholder="Zip"></b-form-input>
                </b-col>
              </b-form-row>
            </b-form-group>
            <b-form-group horizontal label="State">
              <b-form-input v-model="vendor.state" placeholder="State"></b-form-input>
            </b-form-group>
            <hr>
            <b-form-group horizontal label="Curbd Fee" :invalid-feedback="errors.first('fee')">
              <b-input-group prepend="$">
                <b-form-input type="number" name="fee" v-validate="'required'" :state="getState('fee')" v-model="vendor.fee" placeholder="Fee"></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group horizontal>
              <b-form-checkbox>Inform and send credentials to Vendor</b-form-checkbox>
            </b-form-group>
            <b-form-group horizontal>
              <b-button class="mr-3" type="submit" :disabled="submitDisabled" variant="success" v-html="successButtonContent">
              </b-button>
              <b-button to="/dashboard/vendors" variant="dark">
                <i class="fa fa-arrow-left"></i>
                Cancel
              </b-button>
            </b-form-group>
          </b-form>
          <b-alert variant="warning" show>
            <h4 class="alert-heading">Vendors Information</h4>
            <p>Prepare some instructions here</p>
            <hr>
            <p>Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>

          </b-alert>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ErrorStateMixin from '@/mixins/ErrorStateMixin'

export default {
  mixins: [ErrorStateMixin],
  data() {
    return {
      vendor: {
        first_name: '',
        last_name: '',
        company_name: '',
        status: false,
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        state: '',
        fee: null
      },
      loading: false
    }
  },
  computed: {
    successButtonContent() {
      let text = this.$route.name == 'vendor-edit' ? 'Update Account' : 'Create Account'
      return this.loading ? '<i class="fa fa-spin fa-cog"></i> Loading...' : '<i class="fa fa-check"></i> '+text
    },
    submitDisabled() {
      return this.loading || this.errors.any()
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      if (vm.$route.name == 'vendor-edit') {
        await vm.$store.dispatch('vendors/fetchVendors')
        vm.vendor = _.clone(vm.$store.getters['vendors/getVendor'](vm.$route.params.id))
        delete vm.vendor.user
      }
    })
  },
  methods: {
    async submit() {
      if (await this.$validator.validate()) {
        this.loading = true
        try {
          if (this.$route.name == 'vendor-edit')
            await this.$store.dispatch('vendors/update', this.vendor)
          else
            await this.$store.dispatch('vendors/store', this.vendor)
          this.$router.push('/dashboard/vendors')
        } catch (e) {

        }
        this.loading = false
      }
    }
  }
}
</script>
