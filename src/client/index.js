import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import VueMaterial from "vue-material";

import App from "./App.vue";
import Signup from "./Signup.vue";
import Login from "./Login.vue";
import Settings from "./Settings.vue";

import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default-dark.css";

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueMaterial);

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
    { path: "/signup", component: Signup },
    { path: "/login", component: Login },
    { path: "/settings", component: Settings }
];

const router = new VueRouter({
    routes,
    mode: "history"
});

const VueApp = new Vue({
    store,
    router
}).$mount("#app");