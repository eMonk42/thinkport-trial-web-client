import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({ paths: ["user", "token"] })],
  state: {
    user: null,
    token: null,
  },
  mutations: {
    SET_USER(state, { user, token }) {
      state.user = user;
      state.token = token;
    },
    CLEAR(state) {
      state.user = null;
      state.token = null;
    },
  },
  actions: {},
  modules: {},
});
