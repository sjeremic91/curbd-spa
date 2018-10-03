<template>
  <div class="bg-secondary login-page">
    <div class="container">
      <b-card class="card-login mx-auto mt-5">
        <div slot="header" class="text-center">
          <img class="logo img-fluid" src="../assets/img/logo-original.png">
        </div>

        <b-form @submit="login">
          <b-alert :show="showError" @dismissed="showError=0" variant="danger">
            <i class="fa fa-exclamation-circle"></i> {{error}} 
          </b-alert>
          <!--b-alert show variant="success">
            <i class="fa fa-check"></i> Login Succeeded. Redirecting...
          </b-alert-->

          <b-form-group id="group-email" label="Email address" :invalid-feedback="errors.first('email')"  label-for="email"  >
            <b-form-input id="email" name="email" v-validate="'required|email'" placeholder="Enter email" :state="getState('email')" v-model="email"></b-form-input>
          </b-form-group>
          <b-form-group id="group-password" label="Password" label-for="password" :invalid-feedback="errors.first('password')">
            <b-form-input id="password" name="password" v-validate="'required'" type="password" placeholder="Password" :state="getState('password')" v-model="password"></b-form-input>
          </b-form-group>

          <b-button type="submit" :disabled="errors.any()" variant="primary" block>Login</b-button>
        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
      email: '',
      password: '',
      showError: 0,
      error: ''
    }
  },
  computed: {

  },
  methods: {
    getState(field) {
      return this.errors.has(field) ? false : null;
    },
    async login(e) {
      e.preventDefault();
      if (await this.$validator.validateAll()) {

        try {
          await this.$store.dispatch('auth/authenticate', {username: this.email, password: this.password});
          if (this.$store.getters['auth/user'].type == 'admin')
            this.$router.push('dashboard/vendors');
          else
            this.$router.push('dashboard/orders');
        } catch (e) {
          console.log(e)
          this.error = e.response.data.message
          this.showError = 4;
          this.password = ''
        }

      }
    }
  }
}
</script>

<style lang="scss">

.login-page {
  background-image: url("../assets/img/newyork-bg-login.jpg");
  background-size: cover;
  background-position: center center;
  overflow: auto;
  height: 100vh;

  .logo {
    height: 50px;
    margin: 0 auto;
  }

}

.card-login {
  max-width: 25rem;
}

.card-register {
  max-width: 40rem;
}

</style>
