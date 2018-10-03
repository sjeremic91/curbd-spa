export default {
  methods: {
    getState(field) {
      return this.errors.has(field) ? false : null;
    },
  }
}
