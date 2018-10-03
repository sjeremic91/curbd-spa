<template>
  <div class="meal-cat-wrapper">
    <div class="meal-cat-content mb-3">
      <b-nav pills class="flex-nowrap" v-if="truck.mealCategories.length">
        <b-nav-item @click="selectedCategoryId=category.id" :active="selectedCategoryId==category.id"  v-for="category in truck.mealCategories" :key="category.id">{{category.name}}</b-nav-item>
      </b-nav>
    </div>
    <div class="d-sm-none meal-cat-shadow-left">
      <i class="text-primary fa fa-chevron-left"></i>
    </div>
    <div class="d-sm-none meal-cat-shadow-right">
      <i class="text-primary fa fa-chevron-right"></i>
    </div>

  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({user: (state) => state.auth.user, truck: (state) => state.trucks.singleTruck}),
    selectedCategoryId: {
      get() { return this.$store.state.trucks.selectedMealCategoryId},
      set(val) { this.$store.commit('trucks/setSelectedMealCategoryId', val)}
    },
  }
}

</script>

<style lang="scss">

.meal-cat-wrapper {
  position:relative;
}

.meal-cat-content {
  overflow: auto;
  padding: 8px;
  position:relative;
}

.meal-cat-shadow-left {
  position: absolute;
  background: linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
  pointer-events: none;
  width: 50px;
  height: 100%;
  top: 0;
  left: 0;
  i {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}

.meal-cat-shadow-right {
  position:absolute;
  background: linear-gradient(to left, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
  pointer-events: none;
  width: 50px;
  height: 100%;
  top: 0;
  right: 0;
  i {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
  }
}
</style>
