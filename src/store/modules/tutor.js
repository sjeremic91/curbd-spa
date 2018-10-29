import steps from '@/TourSteps'

export default {
  namespaced: true,
  state: {
    startTutor: false,
    stepIndex: null,
    steps: steps.map((step) => {
      let continueDisabled = step.continueDisabled === undefined ? true : step.continueDisabled
      return {...step, continueDisabled}
    })
  },
  mutations: {
    startTutor(state) {
      state.startTutor = true
    },
    endTutor(state) {
      state.startTutor = false
      state.stepIndex = null
    },
    setCurrentStep(state, name) {
      let index = state.steps.findIndex((step) => step.name == name)
      state.stepIndex = index !== -1 ? index : null
      if (!state.startTutor)
        state.stepIndex = null
    },
    enableContinue(state) {
      if (state.startTutor && state.stepIndex)
        state.steps[state.stepIndex].continueDisabled = false
    },
    disableContinue(state) {
      if (state.startTutor && state.stepIndex)
        state.steps[state.stepIndex].continueDisabled = true
    },
  },
  actions: {
    goToStep: {
      root: true,

      handler({commit}, name) {
        commit('setCurrentStep', null); 
        if (name)
          return new Promise(resolve => setTimeout(() => {
            commit('setCurrentStep', name)
            resolve()
          }, 500))
      }
    },
    nextStep: {
      root: true,

      handler({commit, state}) {
        let nextIndex = state.stepIndex+1
        if (nextIndex >= state.steps.length) {
          commit('endTutor')
          return
        }
        commit('setCurrentStep', null); 
        return new Promise(resolve => setTimeout(() => {
          console.log('nextStep: ', state.steps[nextIndex].name)
          commit('setCurrentStep', state.steps[nextIndex].name)
          resolve()
        }, 500))
      }
    }
  },
  getters: {
    currentStep : (state) => {return state.stepIndex === null ? null : state.steps[state.stepIndex] }
  }
}
