<template>
  <div>
    <div v-if="stepIndex !== null" id="popper" class="popper">
      {{steps[stepIndex].content}}
    </div>
    <div v-if="stepIndex !== null" :style="{width:overlayLeftWidth, height: overlayLeftHeight}" class="tutor-overlay-left"></div>
    <div v-if="stepIndex !== null" :style="{width:overlayBottomWidth, height: overlayBottomHeight}" class="tutor-overlay-bottom"></div>
    <div v-if="stepIndex !== null" :style="{width:overlayRightWidth, height: overlayRightHeight}" class="tutor-overlay-right"></div>
    <div v-if="stepIndex !== null" :style="{width:overlayTopWidth, height: overlayTopHeight}" class="tutor-overlay-top"></div>
  </div>
</template>
<script>
import steps from '@/TourSteps'
import {mapState} from 'vuex'
import Popper from 'popper.js'

function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top , left: rect.left  , width: rect.width, height: rect.height}
}

export default {
  computed: {
    ...mapState(['startTutor', 'stepIndex']),
  },
  data() {
    return {
      steps: steps,
      overlayLeftWidth: 0,
      overlayLeftHeight: 0,
      overlayBottomWidth: 0,
      overlayBottomHeight: 0,
      overlayRightWidth: 0,
      overlayRightHeight: 0,
      overlayTopWidth: 0,
      overlayTopHeight: 0,
    }
  },
  watch: {
    stepIndex(val) {
      setTimeout(() => {
      this.showCurrentStep();
      }, 300);
    }
  },
  mounted() {
    swal({
      title: 'Start tutorial?',
      buttons: true
    }).then((answer) => {
      if (answer) {
        this.$store.commit('setStepIndex', 0);
        
        this.showCurrentStep()
      }
    })
  },
  methods: {
    showCurrentStep() {
      this.$nextTick(() => {
        let viewportwidth = window.innerWidth
        let viewportheight = window.innerHeight

        let target = document.getElementById(this.steps[this.stepIndex].target);
        let pos = offset(target)
        this.overlayLeftWidth = pos.left+'px';
        this.overlayLeftHeight = pos.top+pos.height +'px';

        this.overlayBottomWidth = pos.left+pos.width+'px';
        this.overlayBottomHeight = (viewportheight - (pos.top+pos.height)) +'px';

        this.overlayRightWidth = viewportwidth - (pos.left+pos.width)+'px';
        this.overlayRightHeight = (viewportheight -pos.top) +'px';

        this.overlayTopWidth = viewportwidth - pos.left+'px';
        this.overlayTopHeight = pos.top+'px';
        //console.log(target.offsetTop, target.offsetLeft, target.clientHeight, target.clientWidth);
        new Popper(target, document.getElementById('popper'));
      })
    },
  }
}
</script>

<style>

.tutor-overlay-left {
  position: fixed;
  top: 0;
  left: 0;
  background: black;
  z-index:1041;
  opacity: 0.3;
}

.tutor-overlay-bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  background: black;
  z-index:1041;
  opacity: 0.3;
}

.tutor-overlay-right {
  position: fixed;
  right: 0;
  bottom: 0;
  background: black;
  z-index:1041;
  opacity: 0.3;
}

.tutor-overlay-top {
  position: fixed;
  right: 0;
  top: 0;
  background: black;
  z-index:1041;
  opacity: 0.3;
}
.popper {
  width: auto;
  background-color: #fafafa;
  color: #212121;
  text-align: center;
  padding: 2px;
  display: inline-block;
  border-radius: 3px;
  position: absolute;
  font-size: 14px;
  font-weight: normal;
  border: 1px #ebebeb solid;
  z-index: 200000;
  -moz-box-shadow: rgb(58, 58, 58) 0 0 6px 0;
  -webkit-box-shadow: rgb(58, 58, 58) 0 0 6px 0;
  box-shadow: rgb(58, 58, 58) 0 0 6px 0;
}

.popper .popper__arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
}

.popper[x-placement^="top"] {
  margin-bottom: 5px;
}

.popper[x-placement^="top"] .popper__arrow {
  border-width: 5px 5px 0 5px;
  border-color: #fafafa transparent transparent transparent;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.popper[x-placement^="bottom"] {
  margin-top: 5px;
}

.popper[x-placement^="bottom"] .popper__arrow {
  border-width: 0 5px 5px 5px;
  border-color: transparent transparent #fafafa transparent;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.popper[x-placement^="right"] {
  margin-left: 5px;
}

.popper[x-placement^="right"] .popper__arrow {
  border-width: 5px 5px 5px 0;
  border-color: transparent #fafafa transparent transparent;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.popper[x-placement^="left"] {
  margin-right: 5px;
}

.popper[x-placement^="left"] .popper__arrow {
  border-width: 5px 0 5px 5px;
  border-color: transparent transparent transparent #fafafa;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
</style>
