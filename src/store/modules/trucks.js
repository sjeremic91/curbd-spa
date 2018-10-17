import axios from 'axios'
import moment from 'moment'

function initTruck() {
  return {
    email: '',
    name: '',
    description: '',
    failed_order_message: 'Sorry we are not able to take your order at this moment. Hope to see you tommorow',
    tax: '',
    address: '',
    city: '',
    min_delivery_time: 30,
    vendor_id : null,
    zip: '',
    max_items_per_order: 5,
    state: '',
    latitude: 40.7128,
    longitude: -74.0060,
    time_zone: 'America/New_York',
    categories: [],
    mealCategories: [],
    shifts: [],
  }
}

export default {
  namespaced: true,
  state: {
    trucks: [],
    singleTruck: initTruck(), 
    truckImage: null,
    selectedMealCategoryId: null,
    categories: []
  },
  mutations: {
    setTrucks(state, trucks) {
      state.trucks = trucks.map( (truck) => {
        let minutes = truck.min_delivery_time
        truck.min_delivery_time = moment.duration(minutes).asMinutes() 
        return truck;
      });
    },
    setTruckProperty(state, payload) {
      state.singleTruck[payload.field] = payload.value
    },
    setTruckImage(state, value) {
      state.truckImage = value
    },
    removeMeal(state, mealId) {
      state.singleTruck.mealCategories.forEach((category) => {
        category.meals = category.meals.filter((meal) => meal.id !== mealId)
      })
    },
    removeTruck(state, truckId) {
      state.trucks = state.trucks.filter((truck) => truck.id !== truckId)
    },
    setTruckVendorId(state, id) {
      state.singleTruck.vendor_id = id;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    toggleShift(state, data) {
      let day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      let day_in_week = day_names.indexOf(data.name)+1;
      let day = {...data, day_in_week} 
      if (data.checked) {
        state.singleTruck.shifts.push(day);
      } else {
        state.singleTruck.shifts = state.singleTruck.shifts.filter((shift) => shift.day_in_week != day_in_week);
      }
    },
    setShift(state, data) {
      let day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      let day_in_week = day_names.indexOf(data.name)+1;
      let shift = state.singleTruck.shifts.find((item) => item.day_in_week == day_in_week);

      if (shift !== undefined) {
        shift[data.field] = data.value
      } else {
        shift = {day_in_week, checked: true, shift1_from: null, shift1_to: null, shift2_from: null, shift2_to: null}
        shift[data.field] = data.value
        state.singleTruck.shifts.push(shift);
      }
    },
    setSingleTruck(state, truck) {
      state.singleTruck = _.clone(truck)
      state.singleTruck.categories = state.singleTruck.categories.map((item) => item.id)
    },
    togglePublish(state, truck) {
      truck.published = !truck.published
    },
    verifyUser(state, truck) {
      truck.user.verified = true
    },
    addCategory(state, name) {
      state.singleTruck.mealCategories.push({
      })
    },
    setSingleTruckCategories(state, categories) {
      //state.singleTruck.categories = categories.map((id) => state.categories.find((item) => item.id == id))
      //console.log(categories)
      //state.singleTruck.categories = state.categories.filter((category) => !!categories.find( (id) => id == category.id))
    },
    updateMealCategoryName(state, {name, id}) {
      state.singleTruck.mealCategories.find((cat) => cat.id == id).name = name
    },
    removeMealCategory(state, id) {
      state.singleTruck.mealCategories = state.singleTruck.mealCategories.filter((category) => category.id !== id)
    },
    setSelectedMealCategoryId: (state, val) => state.selectedMealCategoryId = val,
  },
  actions: {
    async fetch({commit, rootGetters}) {
      const {data} = await axios.get('/api/vendor/'+rootGetters['auth/user'].id+'/trucks')
      commit('setTrucks', data.data);
    },
    initSingle({commit}) {
      commit('setSingleTruck', initTruck())
    },
    async saveTruck({state, commit, rootState}) {
      let response = null;
      commit('setTruckVendorId', rootState.auth.user.id)
      state.singleTruck.min_delivery_time = Math.floor(state.singleTruck.min_delivery_time/60)+":"+state.singleTruck.min_delivery_time%60+':00';
      if (state.singleTruck.id) {
        response = (await axios.put('/api/trucks/'+state.singleTruck.id, state.singleTruck)).data
      } else {
        response = (await axios.post('/api/trucks', state.singleTruck)).data
      }
      if (state.truckImage) {
        let formData = new FormData();
        formData.append('image', state.truckImage);
        await axios.post('/api/trucks/'+response.data.id+'/upload', formData)
      }
      swal(response.message)
    },
    async fetchSingle({state, commit, dispatch}, id) {
      /*let truck = state.trucks.find((truck) => truck.id == id);
      if (truck === undefined) {
        await dispatch('fetch');
      }
      truck = state.trucks.find((truck) => truck.id == id);
      if (truck === undefined) 
        truck = null;*/
      const {data} = await axios.get('/api/trucks/'+id)
        let minutes = data.data.min_delivery_time
      //console.log(minutes)
        data.data.min_delivery_time = moment.duration(minutes).asMinutes() 
      commit('setSingleTruck', data.data);
      //commit('setSelectedMealCategory', data.data.mealCategories.length ? data.data.mealCategories[0] : null)
    },
    async publish({commit, rootGetters}, truck) {
      commit('togglePublish', truck);
      const {data} = await axios.get('/api/trucks/publish/'+truck.id)
    },
    async deleteTruck({commit, state}, truck) {
      commit('removeTruck', truck.id)
      const {data} = await axios.delete('/api/trucks/'+truck.id);
      swal(data.message)
    },
    async verify({commit, rootGetters}, truck) {
      commit('verifyUser', truck)
      const {data} = await axios.post('/api/user/'+truck.user_id+'/verify')
      swal(data.message)
    },
    async fetchCategories({commit}) {
      const {data} = await axios.get('/api/categories')
      commit('setCategories', data.data)
    },
    async addMealCategory({commit, state}, name) {
      const {data} = await axios.post('/api/mealCats', {
        truck_id: state.singleTruck.id,
        name: name
      })
      swal(data.message)
    },
    async updateMealCategory({commit, state}, {id, name}) {
      try {
      const {data} = await axios.put('/api/mealCats/'+id, {
        truck_id: state.singleTruck.id,
        name: name
      })
      commit('updateMealCategoryName', {id, name});
      swal(data.message)
      } catch (e) {

        console.error(e)
      }
    },
    async deleteMealCategory({commit, state}, id) {
      try {
      const {data} = await axios.delete('/api/mealCats/'+id)
      commit('removeMealCategory', id);
      swal(data.message)
      } catch (e) {
        console.error(e)
      }
    },
    async deleteMeal({commit, state}, meal) {
      commit('removeMeal', meal.id)
      await axios.delete('/api/meals/'+meal.id);
    },
    async storeMeal({state, commit, dispatch}, payload) {
      let meal = payload.meal
      let file = payload.file
      let data = (await axios.post('/api/meals', meal)).data;
      if (file) {
        let formData = new FormData();
        formData.append('image', file)
        await axios.post('/api/meals/'+data.data.id+'/upload', formData);
      }
      await dispatch('fetchSingle', state.singleTruck.id);
      //commit('showAlert', {variant : 'success', message: data.message}, {root: true});
      commit('setSelectedMealCategoryId', data.data.meal_cat_id)
      swal({text: data.message, buttons: false, timer: 3000})
    },
    async updateMeal({state, commit, dispatch}, payload) {
      let meal = payload.meal
      let file = payload.file
      let data = (await axios.put('/api/meals/'+meal.id, meal)).data;
      if (file) {
        let formData = new FormData();
        formData.append('image', file)
        await axios.post('/api/meals/'+data.data.id+'/upload', formData);
      }
      await dispatch('fetchSingle', state.singleTruck.id);
      commit('setSelectedMealCategoryId', data.data.meal_cat_id)
      //commit('showAlert', {variant : 'success', message: data.message}, {root: true});
      swal({text: data.message, buttons: false, timer: 3000})
    },
    async updatePassword({state, commit}, password) {
      const {data} = await axios.post('/api/user/'+state.singleTruck.user_id+'/password', {
        password: password,
        password_confirmation: password
      })
      swal(data.message)
    }

  },
  getters: {
    trucks: (state) => state.trucks,
    singleTruck: (state) => state.singleTruck,
    isNew: (state) => state.singleTruck ? !!!state.singleTruck.id : true,
    categories: (state) => state.categories,
    selectedMealCategoryId: (state) => state.selectedMealCategoryId,
    shiftDays: (state) => {
      if (!state.singleTruck)
        return [];
      let day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      let days = [];
      for (let i = 0; i < 7; i++) {
        let day_data = state.singleTruck.shifts.find((day) => day.day_in_week == i+1)
        days.push({
          name: day_names[i],
          shift1_from: day_data !== undefined ? day_data.shift1_from : null,
          shift1_to: day_data !== undefined ? day_data.shift1_to : null,
          shift2_from: day_data !== undefined ? day_data.shift2_from : null,
          shift2_to: day_data !== undefined ? day_data.shift2_to : null,
          checked: day_data !== undefined ? true : false
        });
      }
      return days;

    },
    selectedMealCategory: (state) => { 
      if (state.singleTruck)
        return state.singleTruck.mealCategories.find((item) => item.id == state.selectedMealCategoryId) 
      return undefined
    },

    //singleTruckCategories: (state) => state.singleTruck.categories.map((category) => category.id)
  }
}
