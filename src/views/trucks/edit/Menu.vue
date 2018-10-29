<template>
  <div v-if="truck">
    <div class="d-flex flex-row-reverse flex-wrap">
      <b-form-group class="clearfix ml-3">
        <b-button class="float-right" id="btn-add-meal" @click="updateMeal(initMeal())" variant="primary"><i class="fa fa-plus"></i> Add Meal</b-button>
      </b-form-group>

      <b-form-group>
        <b-button class="float-right" id="btn-categories" @click="showCategories" variant="secondary"><i class="fa fa-list"></i> Categories</b-button>
      </b-form-group>
    </div>
      <app-meal-categories-nav></app-meal-categories-nav>


    <div v-if="selectedCategory !== undefined" >
      <b-row v-if="selectedCategory.meals.length">
        <b-col sm="12" md="6" lg="4" xl="3" class="mb-3 meal-card" v-for="meal in selectedCategory.meals">
          <app-meal :meal="meal" @show-items="showMealItems(meal)" @update="updateMeal(meal)" @delete="deleteMeal(meal)" :key="meal.id"></app-meal>
        </b-col>
      </b-row>
      <div v-else>
        <h2 class="text-center font-weight-bold mb-5 mt-5 text-muted">No Meals in This Category.</h2>
      </div>
    </div>

    
    <b-modal  ref="mealModal" size="lg" hide-footer title="Meal Details">
      <app-meal-form v-if="meal" :data="meal" ref="mealForm" @hide="hideModal()"></app-meal-form>
    </b-modal>
    <b-modal ref="condimentsModal" @shown="$store.dispatch('nextStep')" size="lg" hide-footer title="Meal Condiments">
      <app-meal-condiments ref="condiments" @hide="hideCondimentsModal()"></app-meal-condiments>
    </b-modal>
    <b-modal ref="categoriesModal" size="lg" id="modal-categories" @shown="$store.dispatch('nextStep')" @hidden="newCategoryName='';editCategory=null;$store.dispatch('nextStep')" hide-footer title="Categories">
      <b-form-group>
        <b-input-group>
          <b-form-input placeholder="New Meal Category" id="input-category" v-model="newCategoryName"></b-form-input>
          <b-btn v-if="editCategory == null" id="btn-add-category" slot="append" @click="addCategory" variant="info"><i class="fa fa-plus"></i> </b-btn>
          <b-input-group-append v-else>
          <b-btn @click="updateCategory" variant="info"><i class="fa fa-save"></i> </b-btn>
          <b-btn @click="deleteCategory" variant="danger"><i class="fa fa-trash"></i> </b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-list-group>
        <b-list-group-item :active="editCategory == category" @click="setEditCategory(category)" class="d-flex justify-content-between p-1" v-for="category in truck.mealCategories" :key="category.id">
          {{category.name}}
        </b-list-group-item>
      </b-list-group>
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
      editCategory: null,
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
  watch: {
    newCategoryName(val) {
      if (val.length)
        this.$store.commit('tutor/enableContinue')
      else
        this.$store.commit('tutor/disableContinue')
    }
  },
  created() {
    this.$store.dispatch('nextStep')
  },
  methods: {
    async addCategory() {
      await this.$store.dispatch('trucks/addMealCategory', this.newCategoryName);
      await this.$store.dispatch('trucks/fetchSingle', this.truck.id);
      /*if (!this.selectedCategoryId)
        this.selectedCategoryId = */
      this.$store.dispatch('nextStep')
      this.newCategoryName = ''
    },
    async updateCategory() {
      await this.$store.dispatch('trucks/updateMealCategory', {id: this.editCategory.id, name: this.newCategoryName});
      //await this.$store.dispatch('trucks/fetchSingle', this.truck.id);
      this.newCategoryName = ''
      this.editCategory = null
    },
    deleteCategory() {
      swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$store.dispatch('trucks/deleteMealCategory', this.editCategory.id);
          //await this.$store.dispatch('trucks/fetchSingle', this.truck.id);
          this.newCategoryName = ''
          this.editCategory = null
        }
      });
    },
    initMeal() {
      return {
        title: '',
        description: '',
        price: null,
        image_path: null,
        meal_cat_id: this.selectedCategoryId,
        description: '',
        gluten_free: false,
        extra_hot: false,
        dairy_free: false,
        vegeterian: false,
        truck_id: this.truck.id
      }
    },
    showModal() {
      this.$nextTick(() => {
        this.$refs.mealModal.show()
        this.$store.dispatch('nextStep')
      });
    },
    showCategories() {
      this.$nextTick(() => {
        this.$refs.categoriesModal.show()
      });
    },
    setEditCategory(category) {
      if (this.editCategory == category) {
        this.newCategoryName = ''
        this.editCategory = null
        return;
      } 
      this.newCategoryName = category.name;
      this.editCategory = category
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
