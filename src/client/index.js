import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";

import App from "./App.vue";
import Signup from "./Signup.vue";
import Login from "./Login.vue";

Vue.use(Vuex);
Vue.use(VueRouter);

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

const routes = [
    { path: "/", component: App },
    { path: "/sign-up", component: Signup },
    { path: "/log-in", component: Login }
];

const router = new VueRouter({
    routes,
    mode: "history"
});

const VueApp = new Vue({
    store,
    router
}).$mount("#app");