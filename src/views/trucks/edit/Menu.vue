<template>
  <div v-if="truck">
    <div class="d-flex flex-row-reverse flex-wrap">
      <b-form-group class="clearfix ml-3">
        <b-button class="float-right" @click="showModal" variant="primary"><i class="fa fa-plus"></i> Add Meal</b-button>
      </b-form-group>

      <b-form-group>
        <b-input-group>
          <b-form-input placeholder="New Meal Category" v-model="newCategoryName"></b-form-input>
          <b-btn slot="append" @click="addCategory" variant="info"><i class="fa fa-plus"></i> Add </b-btn>
        </b-input-group>
      </b-form-group>
    </div>
      <app-meal-categories-nav></app-meal-categories-nav>


    <div v-if="selectedCategory !== undefined" >
      <b-row v-if="selectedCategory.meals.length">
        <b-col sm="12" md="6" lg="4" xl="3" class="mb-3" v-for="meal in selectedCategory.meals">
          <app-meal :meal="meal" @show-items="showMealItems(meal)" @update="updateMeal(meal)" @delete="deleteMeal(meal)" :key="meal.id"></app-meal>
        </b-col>
      </b-row>
      <div v-else>
        <h2 class="text-center font-weight-bold mb-5 mt-5 text-muted">No Meals in This Category.</h2>
      </div>
    </div>

    
    <b-modal @hidden="$nextTick(() => $refs.mealForm.clearForm())" ref="mealModal" size="lg" hide-footer title="Meal Details">
      <app-meal-form :data="meal" ref="mealForm" @hide="hideModal()"></app-meal-form>
    </b-modal>
    <b-modal ref="condimentsModal" size="lg" hide-footer title="Meal Condiments">
      <app-meal-condiments ref="condiments" @hide="hideCondimentsModal()"></app-meal-condiments>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import AppMeal from '@/components/Meal'
import AppMealForm from '@/components/MealForm'
import AppMealCondiments from '@/components/MealCondiments'
import AppMealCategoriesNav from '@/components/MealCategoriesNav'


export default {
  components: {AppMeal, AppMealForm, AppMealCondiments, AppMealCategoriesNav},
  data() {
    return {
      newCategoryName: '',
      meal: null,
      loading: false,
      mealImg: null
    }
  },
  computed: {
    ...mapGetters({
      truck: 'trucks/singleTruck', 
      selectedCategory : 'trucks/selectedMealCategory'
    }),
    meals() {
      return this.truck.mealCategories[this.selectedCategoryId].meals
    },
    selectedCategoryId: {
      get() { return this.$store.getters['trucks/selectedMealCategoryId']},
      set(val) { this.$store.commit('trucks/setSelectedMealCategoryId', val)}
    },
  }, 
  methods: {
    async addCategory() {
      await this.$store.dispatch('trucks/addMealCategory', this.newCategoryName);
      await this.$store.dispatch('trucks/fetchSingle', this.truck.id);
      this.newCategoryName = ''
    },
    showModal() {
      this.$nextTick(() => {
        this.$refs.mealModal.show()
      });
    },
    deleteMeal(meal) {
      swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete)
          this.$store.dispatch('trucks/deleteMeal', meal)
      });
    },
    async showMealItems(meal) {
      await this.$store.dispatch('meal/fetchMeal', meal.id)
      this.$nextTick(() => {
        this.$refs.condimentsModal.show()
        this.$refs.condiments.resetAll()
      });
    },
    updateMeal(meal) {
      this.meal = meal
      this.showModal()
    },
    hideModal () {
      this.$refs.mealModal.hide()
      this.meal = null
    },
    hideCondimentsModal () {
      this.$refs.condimentsModal.hide()
    },
  }

}

</script>

<style lang="scss">
@import "../../../assets/scss/_variables.scss";

  h2 {
    i {
      transition: all 0.3s;
    }
  }
  h2.collapsed {
    i {
      transform:rotate(90deg);
    }
  }
</style>
