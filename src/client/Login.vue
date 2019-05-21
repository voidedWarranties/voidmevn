<template>
    <div>
        <md-app>
            <md-app-toolbar class="md-primary">
                <span class="md-title">Login</span>
            </md-app-toolbar>
            <md-app-content>
                <form @submit.prevent="login" v-if="!twofactor">
                    <md-field>
                        <label for="email">Email</label>
                        <md-input type="text" name="email" v-model="email" />
                    </md-field>
                    <md-field>
                        <label for="password">Password</label>
                        <md-input type="password" name="password" v-model="password" />
                    </md-field>
                    <md-button type="submit" class="md-primary">Login</md-button>
                </form>

                <form @submit.prevent="twofactorr" v-if="twofactor">
                    <md-field>
                        <label for="email">Email</label>
                        <md-input type="text" name="email" v-model="email" />
                    </md-field>
                    <md-field>
                        <label for="password">Password</label>
                        <md-input type="password" name="password" v-model="password" />
                    </md-field>
                    <md-field>
                        <label for="code">Code</label>
                        <md-input autofocus type="text" name="code" v-model="code" />
                    </md-field>
                    <md-button type="submit" class="md-primary">Login</md-button>
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
            email: null,
            password: null,
            twofactor: false,
            user: null,
            code: null
        };
    },
    mounted() {
        this.$store.commit("setUser", {
            user: {a: "b", c: "d"}
        });
        axios.get("/api/user").then(response => (this.value = response.data));
    },
    methods: {
        login() {
            axios({
                method: "post",
                url: "/account/login",
                config: { headers: {"Content-Type": "application/X-www-form-urlencoded"} },
                data: `email=${this.email}&password=${this.password}`
            }).then(response => {
                if(response.data.user.twofactor.enabled) {
                    this.user = response.data.user;
                    this.twofactor = true;
                } else {
                    this.$router.push("/");
                }
            });
        },
        twofactorr() {
            const suser = JSON.stringify(this.user);
            axios({
                method: "post",
                url: "/account/twofactor",
                config: { headers: {"Content-Type": "application/X-www-form-urlencoded"} },
                data: `email=${this.email}&password=${this.password}&code=${this.code}`
            }).then(response => {
                if(response.data.success) {
                    this.$router.push("/");
                } else {
                    this.code = null;
                }
            });
        }
    }
};
</script>