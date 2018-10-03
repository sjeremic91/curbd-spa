<template>
  <b-row>
    <b-col md="12" lg="6" v-for="day in days">
      <app-shift class="mb-4" :day="day"></app-shift>
    </b-col>
  </b-row>
</template>

<script>
import AppShift from './Shift'
import {mapGetters, mapMutations} from 'vuex'

export default {
  components: {AppShift},
  computed: {
    ...mapGetters({truck: 'trucks/singleTruck', days: 'trucks/shiftDays'}),
  },
  data() {
    return {
    }
  },
}
</script>
