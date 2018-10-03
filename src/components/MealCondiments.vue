<template>
  <div v-if="meal" class="p-1" style="overflow:hidden">
    <transition name="slide-fade" mode="out-in">
    <b-form key="form" v-if="createNew">
      <b-link @click="createNew=false">Back</b-link>
      <b-form-group horizontal label="Name" :invalid-feedback="errors.first('name')">
        <b-form-input v-validate="'required'" name="name" :state="getState('name')" v-model="condiment.title"></b-form-input>
      </b-form-group>
      <b-form-group horizontal label="Category" :state="getState('category')" :invalid-feedback="errors.first('category')">
        <transition name="fade" mode="out-in">
        <b-input-group key="select" v-if="!addCategory">
          <b-form-select v-validate="'required'" name="category" :state="getState('category')" v-model="condiment.condiment_cat_id" :options="formatedCategories"></b-form-select>
          <b-button slot="append" variant="warning" @click="addCategory=true" >
            <i class="fa fa-plus"></i>
          </b-button>
        </b-input-group>
        <b-input-group key="category" v-else>
          <b-form-input v-model="categoryName"></b-form-input>
          <b-input-group-append>
            <b-button variant="success" @click="storeCategory" v-if="addCategory">
              <i class="fa fa-check"></i>
            </b-button>
            <b-button variant="danger" @click="clearCategory" v-if="addCategory">
              <i class="fa fa-times"></i>
            </b-button>
          </b-input-group-append>
        </b-input-group>
        </transition>
      </b-form-group>
      <b-form-group v-if="addCategory" horizontal>
        <b-form-checkbox v-model="categoryRequired">Required</b-form-checkbox>
      </b-form-group>
      <b-form-group horizontal label="Price" :invalid-feedback="errors.first('price')">
        <b-form-input v-validate="'required|decimal:2'" name="price" :state="getState('price')" v-model="condiment.price"></b-form-input>
      </b-form-group>
      <b-form-group horiontal>
        <b-button variant="primary" :disabled="isDisabled" @click="storeCondiment">
          <i v-if="loading" class="fa fa-cog fa-spin"></i>
          Create
        </b-button>
      </b-form-group>
    </b-form>

    <div key="list" v-else>
      <b-form-group  class="text-right">
        <b-button variant="primary" @click="createNew=true">Add New</b-button>
      </b-form-group>
    
      <b-list-group>
        <b-list-group-item :key="condiment.id" v-for="condiment in meal.condiment">
          <div class="clearfix">
            <small v-if="condiment.condiment_cat.required" class="text-danger">Required</small>
            <b-button-close @click="deleteCondiment(condiment)"></b-button-close>
          </div>
          <div class="d-flex justify-content-between">
            <div>
              <span class="d-block">{{condiment.title}}</span>
              <b-badge variant="info mr-1">{{condiment.condiment_cat.name}}</b-badge>
            </div>
            <strong class="align-self-center">${{condiment.price}}</strong>
          </div>
        </b-list-group-item>
      </b-list-group>

    </div>
    </transition>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import axios from 'axios'
import ErrorStateMixin from '@/mixins/ErrorStateMixin'

export default {
  mixins: [ErrorStateMixin],
  computed: {
    ...mapGetters({meal: 'meal/meal', truck: 'trucks/singleTruck'}),
    isDisabled() {
      return this.loading || this.errors.any()
    },
    formatedCategories() {
      return [{value: null, disabled: true, text: 'Please Select'}].concat(this.categories.map((item) => { return {text: item.name, value: item.id}}))
    }
  },
  data() {
    return {
      loading: false,
      createNew: false,
      addCategory: false,
      categoryRequired: false,
      categoryName: '',
      categories: [],
      condiment: {
        title: '',
        price: null,
        condiment_cat_id: null
      }
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    clearCategory() {
      this.categoryName = ''
      this.addCategory = false
      this.categoryRequired = false
    },
    resetAll() {
      this.clearCategory()
      this.condiment = {title: '', price: null, condiment_cat_id: null}
      this.createNew = false
      this.$validator.reset()
    },
    async fetchCategories() {
      const {data} = await axios.get('/api/truck/'+this.truck.id+'/condimentCats')
      this.categories = data.data;
    },
    async storeCategory() {
      const {data} = await axios.post('/api/condimentCats', {
        name: this.categoryName,
        required: this.categoryRequired,
        truck_id: this.truck.id
      });
      this.clearCategory()
      this.fetchCategories()
      swal(data.message);
    },
    async storeCondiment() {
      if (await this.$validator.validate()) {
        this.loading = true
        const {data} = await axios.post('/api/condiments', this.condiment)
        await axios.post('/api/meal_condiments', {
          condiment_cat_id: this.condiment.condiment_cat_id,
          meal_id: this.meal.id,
          condiment_id: data.data.id
        })
        this.condiment = {title: '', price: null, condiment_cat_id: null}
        this.createNew = false
        this.loading = false
        swal(data.message);
        await this.$store.dispatch('meal/fetchMeal', this.meal.id)
        await this.$store.dispatch('trucks/fetchSingle', this.truck.id)
      }
    },
    async deleteCondiment(condiment) {
      const {data} = await axios.delete('/api/condiments/'+ condiment.id)
      await this.$store.dispatch('meal/fetchMeal', this.meal.id)
      await this.$store.dispatch('trucks/fetchSingle', this.truck.id)
      swal(data.message);
    }
  }
}
</script>
