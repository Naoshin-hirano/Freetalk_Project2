export default {
  state: {
    error: null,
    loading: false
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    clearError({commit}){
      commit("clearError")
    }
  },
  getters: {
    error(state){
      return state.error
    },
    loading(state){
      return state.loading
    }
  }
}
