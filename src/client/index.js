import Vue from "vue";
import Vuex from "vuex";

import App from "./App.vue";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: {}
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload.user;
        }
    },
    getters: {
        user: state => {
            return state.user;
        }
    }
});

new Vue({
    el: "#app",
    render: h => h(App),
    store
});