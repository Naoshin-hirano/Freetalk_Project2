import Vue from "vue"
import Vuex from "vuex"

import freetalk from "./freetalk"
import user from "./user"
import shared from "./shared"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    freetalk: freetalk,
    user: user,
    shared: shared
  }
})
