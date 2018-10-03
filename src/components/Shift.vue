<template>
  <b-card header-bg-variant="dark" header-text-variant="white">
    <div slot="header">
      <b-form-checkbox  @change="toggleDay($event)" v-model="checked">
        {{day.name}}
      </b-form-checkbox>
    </div>
    <b-form-group label="Shift 1"  horizontal>
      <b-form-row>
        <b-col>
          <b-form-group>
            <b-input-group prepend="F" size="sm">
              <b-form-input type="time" @change="changeValue('shift1_from', $event)" :value="day.shift1_from"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group>
            <b-input-group prepend="T" size="sm">
              <b-form-input type="time" @change="changeValue('shift1_to', $event)" :value="shift1_to"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-form-row>
    </b-form-group>
    <b-form-group label="Shift 2"  horizontal>
      <b-form-row>
        <b-col>
          <b-form-group>
            <b-input-group prepend="F" size="sm">
              <b-form-input type="time" @change="changeValue('shift2_from', $event)" :value="shift2_from"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group>
            <b-input-group prepend="T" size="sm">
              <b-form-input type="time" @change="changeValue('shift2_to', $event)" :value="shift2_to"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-form-row>
    </b-form-group>
  </b-card>
</template>

<script>
export default {
  props: {
    day: {
      type: Object
    }
  },
  watch: {
    day(val) {
      this.checked = val.checked
      this.shift1_from = val.shift1_from
      this.shift1_to =  val.shift1_to
      this.shift2_from =  val.shift2_from
      this.shift2_to = val.shift2_to
    }
  },
  data() {
    return {
      checked: this.day.checked,
      shift1_from: this.day.shift1_from,
      shift1_to: this.day.shift1_to,
      shift2_from: this.day.shift2_from,
      shift2_to: this.day.shift2_to,
    }
  },
  methods: {
    toggleDay(val) {
      if (!val) {
        this.shift1_from = null;
        this.shift1_to = null;
        this.shift2_from = null;
        this.shift2_to = null;
      }
      this.$store.commit('trucks/toggleShift', {
        name: this.day.name,
        checked: val,
        shift1_from: this.shift1_from,
        shift1_to: this.shift1_to,
        shift2_from: this.shift2_from,
        shift2_to: this.shift2_to
      })

    },
    changeValue(field, val) {
      this.$store.commit('trucks/setShift', {
        field: field,
        value: val,
        name: this.day.name
      })
    }
  }

}
</script>

