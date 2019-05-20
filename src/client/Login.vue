<template>
    <div>
        <form @submit.prevent="login" v-if="!twofactor">
            <div class="form-group">
                <label>Email</label>
                <input type="text" name="email" v-model="email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" v-model="password">
            </div>
            <button type="submit">Login</button>
        </form>

        <form action="/account/twofactor" method="post" v-if="twofactor">
            <div class="form-group">
                <label>Email</label>
                <input type="text" name="email" v-model="email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" v-model="password">
            </div>
            <div class="form-group">
                <label>Code</label>
                <input type="text" name="code">
            </div>
            <button type="submit">Login</button>
        </form>
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
                if(response.data.twofactor) {
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
                data: `user=${suser}&code=${this.code}`
            }).then(response => {
                if(response.data.success) {
                    this.$router.push("/");
                }
            });
        }
    }
};
</script>