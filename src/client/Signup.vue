<template>
    <div>
        <md-app>
            <md-app-toolbar class="md-primary">
                <span class="md-title">Signup</span>
            </md-app-toolbar>
            <md-app-content>
                <form action="/account/signup" method="post">
                    <md-field>
                        <label for="email">Email</label>
                        <md-input type="text" name="email" v-model="email" />
                    </md-field>
                    <md-field>
                        <label for="password">Password</label>
                        <md-input type="password" name="password" v-model="password" />
                    </md-field>
                    <md-button type="submit" class="md-primary">Signup</md-button>
                </form>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "voidmevn",
    data() {
        return {
            value: null,
            value2: null
        };
    },
    mounted() {
        this.$store.commit("setUser", {
            user: {a: "b", c: "d"}
        });
        axios.get("/api/user").then(response => (this.value = response.data));
        this.value2 = this.$store.getters.user;
    }
};
</script>