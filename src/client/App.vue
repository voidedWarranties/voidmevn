<template>
    <div>
        <p>Hello World</p>
        {{ value }}
        {{ value2 }}
        <a href="/account/logout">Logout</a>
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