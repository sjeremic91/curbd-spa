import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import orders from './modules/orders'
import trucks from './modules/trucks'
import meal from './modules/meal'
import vendors from './modules/vendors'
import tutor from './modules/tutor'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    auth,
    orders,
    trucks,
    meal,
    vendors, 
    tutor
  },
  state: {
    showSidebar: false,
    alertTimer: 0,
    alertMessage: '',
    alertVariant: 'success',
  },
  mutations: {
    toggleSidebar(state) {
      state.showSidebar = !state.showSidebar
    },
    hideSidebar(state) {
      state.showSidebar = false
    },
    showAlert(state, {variant, message}) {
      state.alertMessage = message
      state.alertVariant = variant
      state.alertTimer = 4
    },
  },
  actions: {
    toggleSidebar({commit, dispatch}) {
      commit('toggleSidebar') 
      return new Promise((resolve) => setTimeout(() => {
        dispatch('goToStep', 'sidebar')
        resolve()
      }, 300))
    },
  },
  getters: {
    showSidebar(state) {
      return state.showSidebar
    },
    alertMessage: (state) => state.alertMessage,
    alertVariant: (state) => state.alertVariant,
    alertTimer: (state) => state.alertTimer,
  }
})
