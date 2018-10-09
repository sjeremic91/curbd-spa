<template>
  <b-row  class="justify-content-md-center">
    <b-col lg="8">
      <b-form>
        <b-form-group horizontal :label="'Street '+star">
          <b-form-input placeholder="Street" v-model="truckStreet"></b-form-input>
        </b-form-group>
        <b-form-group horizontal class="mb-0" :label="'City and ZIP '+star">
          <b-form-row>
            <b-col sm="12" md="6">
              <b-form-group>
                <b-form-input placeholder="City" v-model="truckCity"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="12" md="6">
              <b-form-group>
                <b-form-input placeholder="ZIP" v-model="truckZip"></b-form-input>
              </b-form-group>
            </b-col>
          </b-form-row>
        </b-form-group>
        <b-form-group horizontal :label="'State '+star">
          <b-form-input placeholder="State" v-model="truckState"></b-form-input>
        </b-form-group>
        <b-form-group horizontal :label="'Latitude '+star">
          <b-form-input placeholder="Latitude" v-model="truckLatitude"></b-form-input>
        </b-form-group>
        <b-form-group horizontal :label="'Longitude '+star">
          <b-form-input placeholder="Longitude" v-model="truckLongitude"></b-form-input>
        </b-form-group>
      </b-form>
      <b-alert show variant="warning">
        <i class="fa fa-info-circle"></i> Alternatively you can use our map with a draggable pin marker to generate coordinates.
      </b-alert>
      <GmapMap
           :center="position"
           :zoom="7"
           style="height: 300px"
           >
           <GmapMarker
           :position="position"
           :clickable="true"
           :draggable="true"
           @dragend="setPosition($event.latLng)"
           />
      </GmapMap>
    </b-col>

  </b-row>
</template>

<script>
import {mapGetters} from 'vuex'
import {GOOGLE_MAP_KEY} from '@/config/env'
import axios from 'axios'

export default {
  computed: {
    ...mapGetters({truck: 'trucks/singleTruck'}),
    truckStreet: {
      get() { return this.$store.state.trucks.singleTruck.address },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'address', value}) }
    },
    truckCity: {
      get() { return this.$store.state.trucks.singleTruck.city },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'city', value}) }
    },
    truckZip: {
      get() { return this.$store.state.trucks.singleTruck.zip },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'zip', value}) }
    },
    truckState: {
      get() { return this.$store.state.trucks.singleTruck.state },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'state', value}) }
    },
    truckLatitude: {
      get() { return this.$store.state.trucks.singleTruck.latitude },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'latitude', value}) }
    },
    truckLongitude: {
      get() { return this.$store.state.trucks.singleTruck.longitude },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'longitude', value}) }
    },
    truckTimeZone: {
      get() { return this.$store.state.trucks.singleTruck.time_zone },
      set(value) { return this.$store.commit('trucks/setTruckProperty', {field: 'time_zone', value}) }
    },
    
    position() {
      if (this.truck) 
        return {lat: parseFloat(this.truckLatitude), lng: parseFloat(this.truckLongitude)}
      return {lat: 10, lng: 10}
    },
  },
  data() {
    return {
      star: '<span class="text-danger">*</span>',
    }
  },
  methods: {
    async setPosition(p) {
      let timestamp = new Date().getTime()/1000;
      this.truckLatitude = p.lat();
      this.truckLongitude = p.lng();
      //const response = await axios.get( "https://maps.googleapis.com/maps/api/timezone/json?location="+p.lat()+","+p.lng()+"&timestamp="+timestamp+"&key="+GOOGLE_MAP_KEY, {headers: {common: {'Authorization': undefined}}})

      let token = axios.defaults.headers.common['Authorization']
      delete axios.defaults.headers.common['Authorization']
      const {data} = await axios.get( "https://maps.googleapis.com/maps/api/timezone/json?location="+p.lat()+","+p.lng()+"&timestamp="+timestamp+"&key="+GOOGLE_MAP_KEY);
      //const {data} = await axios.get("https://maps.googleapis.com/maps/api/timezone/json?location=38.908133,-77.047119&timestamp=1458000000&key=AIzaSyDU1NtxHyVJ8MStzrKJUs2aAFTUu7491BQ");
      axios.defaults.headers.common['Authorization'] = token;
      this.truckTimeZone = data.timeZoneId
    }
  }
}
</script>
