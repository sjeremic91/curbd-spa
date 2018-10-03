import axios from 'axios'

export default {
  namespaced: true,
  state: {
    meal: null,
  },
  mutations: {
    setMeal : (state, meal) => state.meal = meal,
  },
  actions: {
    async fetchMeal({commit, state, rootGetters, rootState}, id) {
      const {data} = await axios.get('/api/meal_condiments/'+id)
      commit('setMeal', data.data);
    }
  },
  getters: {
    meal : (state) => state.meal
  }
}
