import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import orders from './modules/orders'
import trucks from './modules/trucks'
import meal from './modules/meal'
import vendors from './modules/vendors'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    auth,
    orders,
    trucks,
    meal,
    vendors
  },
  state: {
    showSidebar: false,
    alertTimer: 0,
    alertMessage: '',
    alertVariant: 'success',
    startTutor: false,
    stepIndex: null
  },
  mutations: {
    toggleSidebar(state) {
      state.showSidebar = !state.showSidebar
      state.stepIndex = 1
    },
    hideSidebar(state) {
      state.showSidebar = false
    },
    showAlert(state, {variant, message}) {
      state.alertMessage = message
      state.alertVariant = variant
      state.alertTimer = 4
    },
    startTutor(state) {
      state.startTutor = true
    },
    setStepIndex(state, index) {
      state.stepIndex = index
    }
  },
  actions: {

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
