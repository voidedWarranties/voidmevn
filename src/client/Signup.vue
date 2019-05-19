<template>
    <div>
        <form action="/account/signup" method="post">
            <div class="form-group">
                <label>Email</label>
                <input type="text" name="email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password">
            </div>
            <button type="submit">Signup</button>
        </form>
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