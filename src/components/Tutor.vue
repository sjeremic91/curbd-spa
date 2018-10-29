<template>
  <div class="tutor-wrapper">
    <transition name="fade" mode="out-in">
    <div v-if="currentStep !== null" id="popper" class="popper">
      <!--div class="popper-header">
        Step <strong>{{stepIndex+1}} / {{steps.length}} </strong>
      </div-->
      <div class="popper-content d-flex flex-column justify-content-center">
        <h3 v-html="currentStep.heading"></h3>
        <p v-html="currentStep.content"></p>
      </div>

      <b-progress height="2px" class="popper-progress rounded-0" :value="stepIndex+1" :max="steps.length"></b-progress>
     <div class="popper-footer d-flex flex-row-reverse justify-content-between">
      <b-link class="align-self-center" href="#" size="sm" variant="danger" @click="$store.commit('tutor/endTutor')">Leave Tour</b-link>
      <b-button v-if="currentStep.hasContinue" @click="nextStep()" :disabled="currentStep.continueDisabled" size="sm" variant="primary">Next Step <i class="fa fa-chevron-right" style="vertical-align:middle"></i></b-button>
     
     </div>
      <!--div class="popper__arrow" x-arrow=""></div-->
    </div>
    </transition>
    <transition name="fade" mode="out-in">
    <div v-if="stepIndex !== null">
      <div :style="overlayLeftStyle" class="tutor-overlay-left"></div>
      <div :style="overlayBottomStyle" class="tutor-overlay-bottom"></div>
      <div :style="overlayRightStyle" class="tutor-overlay-right"></div>
      <div :style="overlayTopStyle" class="tutor-overlay-top"></div>
      <div :style="overlayShadowStyle" class="tutor-overlay-shadow"></div>
    </div>
    <!--div v-else class="tutor-overlay-all"></div-->
    </transition>
  </div>
</template>
<script>
//import steps from '@/TourSteps'
import {mapState, mapGetters} from 'vuex'
//import Popper from 'popper.js'
import {disableScroll, enableScroll} from '@/utils'
import swal from 'sweetalert'

export default {
  computed: {
    ...mapState({
      startTutor: (state) => state.tutor.startTutor, 
      stepIndex: (state) => state.tutor.stepIndex,
      steps: (state) => state.tutor.steps,
    }),
    ...mapGetters({currentStep : 'tutor/currentStep'})
  },
  data() {
    return {
      overlayLeftStyle: {left: 0, top: 0, width: 0, height: 0},
      overlayRightStyle: {left: 0, top: 0, width: 0, height: 0},
      overlayTopStyle: {left: 0, top: 0, width: 0, height: 0},
      overlayBottomStyle: {left: 0, top: 0, width: 0, height: 0},
      overlayShadowStyle: {left: 0, top: 0, width: 0, height: 0, pointerEvents: 'none'},
    }
  },
  watch: {
    stepIndex(val) {
      if (val == 0)
        this.showCurrentStep(false);
      else
        this.showCurrentStep(true);

      if (this.currentStep) {
        this.$nextTick(() => {
          let el = document.querySelector(this.$store.getters['tutor/currentStep'].target)
          console.log('top',el.getBoundingClientRect().top);
          let bodyRect = document.body.getBoundingClientRect()
          window.scrollTo({top: el.getBoundingClientRect().top-bodyRect.top-56-8, behavior: 'smooth'})
          if (this.$store.getters['tutor/currentStep'].scrollDisabled)
            disableScroll();
          else
            enableScroll();
        })
      }
      /*this.$nextTick(() => {
        if (this.currentStep !== null && !this.isMobile()) {
          let target = document.querySelector('.tutor-overlay-shadow');
          new Popper(target, document.getElementById('popper'), {
            placement: 'right',
            preventOverflow: {
              boundariesElement : 'viewport'
            }
          });
        }
      })*/
    }
  },
  mounted() {
    swal({
      title: 'Start tutorial?',
      buttons: true
    }).then((answer) => {
      if (answer) {
        //disableScroll();
        this.$router.push('/dashboard/orders');
        this.$store.commit('tutor/startTutor');
        this.$store.dispatch('goToStep', 'logo');

        //this.showCurrentStep()
        window.addEventListener('scroll', this.showCurrentStep);
      }
    })
  },
  methods: {
    async nextStep() {
      await this.$store.dispatch('nextStep')
      this.$root.$emit('next-step')
      //if (this.isMobile()) {
     // }
    },
    showCurrentStep(maskHeader) {
        let w = document.documentElement.clientWidth;
        let h = document.documentElement.clientHeight;

        let target = null;
        let header = document.getElementById('app-navbar');
        if (this.stepIndex !== null)
          target = document.querySelector(this.currentStep.target);
        if (target) {
          let rect = target.getBoundingClientRect();//offset(target)
          rect = {top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right, width: rect.width, height: rect.height}

          let m = 8;
          rect.left=Math.max(rect.left-m, 0);
          rect.right=Math.min(rect.right+m, w);
          rect.top=Math.max(rect.top-m, maskHeader ? header.clientHeight : 0);
          rect.bottom=Math.min(rect.bottom+m, h);
          rect.width=Math.max(rect.right-rect.left, 0);
          rect.height=Math.max(0, rect.bottom-rect.top);
          //console.log(rect)


          this.overlayLeftStyle.width = rect.left+'px'
          this.overlayLeftStyle.height = rect.bottom+'px'

          this.overlayBottomStyle.top = rect.bottom+'px'
          this.overlayBottomStyle.width = rect.right+'px'
          this.overlayBottomStyle.height = Math.max(h-rect.bottom)+'px'

          this.overlayRightStyle.top = rect.top+'px'
          this.overlayRightStyle.left = rect.right+'px'
          this.overlayRightStyle.width = Math.max(0,w-rect.right)+'px'
          this.overlayRightStyle.height = Math.max(0, h-rect.top)+'px'

          this.overlayTopStyle.left = rect.left+'px'
          this.overlayTopStyle.width = Math.max(w-rect.left)+'px'
          this.overlayTopStyle.height = rect.top+'px'

          this.overlayShadowStyle.left = rect.left+'px'
          this.overlayShadowStyle.top = rect.top+'px'
          this.overlayShadowStyle.width = rect.width+'px'
          this.overlayShadowStyle.height = rect.height+'px'

          this.overlayShadowStyle.pointerEvents = 'none'
          if (this.currentStep.unclickable)
            this.overlayShadowStyle.pointerEvents = 'auto'
        }
    },
  }
}
</script>

<style lang="scss">

@import "../assets/scss/_variables.scss";

.tutor-wrapper {
  top: 0;
  left: 0;
}

.tutor-overlay-all {
  position: fixed;
  background: black;
  z-index:1051;
  opacity: 0.3;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.tutor-overlay-left {
  position: fixed;
  background: black;
  z-index:1051;
  opacity: 0.3;
}

.tutor-overlay-bottom {
  position: fixed;
  background: black;
  z-index:1051;
  opacity: 0.3;
}

.tutor-overlay-right {
  position: fixed;
  background: black;
  z-index:1051;
  opacity: 0.3;
}

.tutor-overlay-top {
  position: fixed;
  background: black;
  z-index:1051;
  opacity: 0.3;
}

.tutor-overlay-shadow {
  position: fixed;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.3);
  z-index:1051;
  transition: opacity 0.3s;
}

.popper {
  width: 100%;
  position:fixed;
  bottom: 0;
  left: 0;
  background-color: #fafafa;
  color: #212121;
  text-align: center;
  display: inline-block;
  border-radius: 3px;
  font-size: 14px;
  font-weight: normal;
  border: 1px #ebebeb solid;
  z-index: 200000;
  box-shadow: rgb(58, 58, 58) 0 0 6px 0;

  .popper__arrow {
    display: none;
  }

  .popper-progress {
    background-color: lighten($primary, 20%);
  }

  .popper-content {
    min-height: 120px;
    padding: 16px;
  }

  .popper-header {
    background: $gray-700;
    color: white;
    margin-bottom: 4px;
    padding: 6px;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
  }

  .popper-footer {
    background: $gray-200;
    padding: 6px;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }
}
@media only screen and (min-width: 768px) {
  .popper {
    max-width: 300px;
    bottom: 20px;
    top: auto;
    left:auto;
    right: 20px;

    .popper__arrow {
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
      position: absolute;
      margin: 8px;
    }

  }

  .popper[x-placement^="top"] {
    margin-bottom: 8px;
  }

  .popper[x-placement^="top"] .popper__arrow {
    border-width: 8px 8px 0 8px;
    border-color: #fafafa transparent transparent transparent;
    bottom: -8px;
    left: calc(50% - 8px);
    margin-top: 0;
    margin-bottom: 0;
  }

  .popper[x-placement^="bottom"] {
    margin-top: 8px;
  }

  .popper[x-placement^="bottom"] .popper__arrow {
    border-width: 0 8px 8px 8px;
    border-color: transparent transparent #fafafa transparent;
    top: -8px;
    left: calc(50% - 8px);
    margin-top: 0;
    margin-bottom: 0;
  }

  .popper[x-placement^="right"] {
    margin-left: 8px;
  }

  .popper[x-placement^="right"] .popper__arrow {
    border-width: 8px 8px 8px 0;
    border-color: transparent #fafafa transparent transparent;
    left: -8px;
    top: calc(50% - 8px);
    margin-left: 0;
    margin-right: 0;
  }

  .popper[x-placement^="left"] {
    margin-right: 8px;
  }

  .popper[x-placement^="left"] .popper__arrow {
    border-width: 8px 0 8px 8px;
    border-color: transparent transparent transparent #fafafa;
    right: -8px;
    top: calc(50% - 8px);
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
