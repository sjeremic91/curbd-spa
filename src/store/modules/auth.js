import axios from 'axios'

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || '',
    user: {
      id: null,
      name : '',
    },
  },
  mutations: {
    setToken(state, value) {
      localStorage.setItem('token', value);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + value
      state.token = value;
    },
    setUser(state, user) {
      state.user = user
      console.log(user);
    },
    logout(state){
      state.token = ''
      localStorage.removeItem('token')
      state.user = {
        id: null,
        name: ''
      }
    },
  },
  actions: {
    async fetchUser({commit, state}) {

       const {data} = await axios.get('/api/user')
      commit('setUser', data);
    },
    async authenticate({commit, state, dispatch}, payload) {

        const {data} = await axios.post('oauth/token', {
          client_id: 2,
          client_secret: "4hzHNhKSUhJjt5sFT8EWtQpquu27Sq2Ksu5PagNM",
          username: payload.username,
          password: payload.password,
          grant_type: "password"
        });
        commit('setToken', data.access_token);
        
        await dispatch('fetchUser');

    },
    logout({commit}) {
      return new Promise((resolve, reject) => {
        commit('logout')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn(state) {
      return !!state.user.id;
    },
    hasType: (state) => (type) => {
      return state.user.type == type;
    },
    user(state) {
      return state.user
    },
    tutorialCheckpoint(state) {
      return state.user.tutorial_checkpoint
    }
  }
}
