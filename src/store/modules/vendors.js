import axios from 'axios'

export default {
  namespaced: true,
  state: {
    vendors: [],
  },
  mutations: {
    removeVendor: (state, id) => state.vendors = state.vendors.filter((vendor) => vendor.id != id),
    setVendors : (state, vendors) => state.vendors = vendors,
    validateVendor: (state, vendor) => state.vendors.find((item) => item.id == vendor.id).user.verified = true
  },
  actions: {
    async fetchVendors({commit}) {
      const {data} = await axios.get('/api/vendors')
      commit('setVendors', data.data);
    },
    async deleteVendor({commit}, id) {
      commit('removeVendor', id) 
      const {data} = await axios.delete('/api/vendors/'+id)
      swal(data.message)
    },
    async store({commit}, vendor) {
      const {data} = await axios.post('/api/vendors', vendor)
      swal(data.message)
    },
    async update({commit}, vendor) {
      const {data} = await axios.put('/api/vendors/'+vendor.id, vendor)
      swal(data.message)
    },
    async validate({commit}, vendor) {
      const {data} = await axios.post('/api/user/'+vendor.user.id+'/verify')
      commit('validateVendor', vendor)
      swal(data.message)
    }
  },
  getters: {
    getVendor: (state) => (id) => { 
      console.log(state.vendors)
      return state.vendors.find((vendor) => vendor.id == id)
    }
  }
}
