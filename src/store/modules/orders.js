import axios from 'axios'

export default {
  namespaced: true,
  state: {
    orders: []
  },
  mutations: {
    setOrders(state, orders) {
      state.orders = orders;
    },
  },
  actions: {
    async fetchOrders({commit, state, rootGetters, rootState}) {
      console.log(rootGetters['auth/user']);
      const {data} = await axios.get('/api/ordering/vendor/'+rootGetters['auth/user'].id)
      commit('setOrders', data);
    }
  },
  getters: {
    orders : (state) => state.orders
  }
}
