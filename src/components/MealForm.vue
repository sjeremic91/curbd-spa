<template>
  <b-form>
    <b-form-group horizontal label="Name" :invalid-feedback="errors.first('name')" label-for="meal-name">
      <b-input id="meal-name" name="name" v-validate="'required'" :state="getState('name')" v-model="meal.title"></b-input>
    </b-form-group>
    <b-form-group horizontal label="Meal Category" :invalid-feedback="errors.first('category')" label-for="meal-cat">
      <b-form-select name="category" v-validate="'required'" :state="getState('category')" v-model="meal.meal_cat_id" :options="mealCatOptions">
        <template slot="first">
          <option :value="null" disabled>Please select a category</option>
        </template>
      </b-form-select>
    </b-form-group>
    <b-form-group horizontal label="Meal Image" label-for="meal-image">
      <b-form-file id="meal-image" accept="image/*" v-model="mealImg" placeholder="Choose a file..."></b-form-file>
    </b-form-group>
    <b-form-group horizontal label="Description" :invalid-feedback="errors.first('description')" laber-for="meal-description">
      <b-textarea id="meal-description" name="description" v-validate="'required'" :state="getState('description')"  v-model="meal.description" rows="4"></b-textarea>
    </b-form-group>
    <b-form-group horizontal label="Price" :invalid-feedback="errors.first('price')" label-for="meal-price">
      <b-input-group prepend="$">
        <b-input id="meal-price" name="price" v-validate="'required|decimal:2'" v-model="meal.price" :state="getState('price')"></b-input>
      </b-input-group>
    </b-form-group>
    <b-form-group horizontal>
      <b-form-checkbox class="d-block" v-model="meal.gluten_free">Gluten Free</b-form-checkbox>
      <b-form-checkbox class="d-block" v-model="meal.extra_hot">Extra Hot</b-form-checkbox>
      <b-form-checkbox class="d-block" v-model="meal.dairy_free">Dairy Free</b-form-checkbox>
      <b-form-checkbox class="d-block" v-model="meal.vegeterian">Vegeterian</b-form-checkbox>
    </b-form-group>
    <b-btn class="float-right" variant="default" @click="clearForm();$emit('hide')">Close</b-btn>
    <b-btn class="float-right mr-2" :disabled="saveDisabled" variant="primary" @click="saveMeal">Save</b-btn>

  </b-form>
</template>

<script>
import ErrorStateMixin from '@/mixins/ErrorStateMixin'
import {mapGetters} from 'vuex'

function initMeal(truck_id) {
  return {
    title: '',
    description: '',
    price: null,
    image_path: null,
    meal_cat_id: null,
    description: '',
    gluten_free: false,
    extra_hot: false,
    dairy_free: false,
    vegeterian: false,
    truck_id: truck_id
  }
}

export default {
  mixins: [ErrorStateMixin],
  props: {
    data: {
      type: Object,
    }
  },
  data() {
    return {
      loading: false,
      meal: this.data ? _.clone(this.data) : initMeal(),
      mealImg : null
    }
  },
  computed: {
    ...mapGetters({truck: 'trucks/singleTruck'}),
    saveDisabled() {
      return this.errors.any() || this.loading
    },
    mealCatOptions() {
      return this.truck.mealCategories.map(item => {return { text: item.name, value: item.id}})
    },
    selectedCategoryId: {
      get() { return this.$store.state.trucks.selectedMealCategoryId},
      set(val) { this.$store.commit('trucks/setSelectedMealCategoryId', val)}
    },
  },
  watch: {
    data(data) {
      this.meal = data ? _.clone(data) : initMeal(this.truck.id)
    }
  },
  methods: {
    clearForm() {
      this.mealImg = null;
      this.meal = initMeal(this.truck.id)
      this.$validator.reset()
    },
    async saveMeal() {
      if (await this.$validator.validateAll()) {

        this.loading = true;
        try {
          let res;
          if (this.meal.id)
            await this.$store.dispatch('trucks/updateMeal', {meal: this.meal, file: this.mealImg});
          else
            await this.$store.dispatch('trucks/storeMeal', {meal: this.meal, file: this.mealImg});
          this.clearForm()
          this.$emit('hide')
        } catch (e) {
          console.log(e)
        }
        this.loading = false;
      }

    }
  }
}
</script>
