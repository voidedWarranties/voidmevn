<template>
    <div class="page-container md-layout-row">
        <md-app>
            <md-app-toolbar class="md-primary">
                <span class="md-title">{{ item }}</span>
            </md-app-toolbar>

            <md-app-drawer md-permanent="full">
                <md-toolbar class="md-transparent" md-elevation="0">
                    Settings
                </md-toolbar>

                <md-list>
                    <md-list-item @click="handleAccount">
                        <md-icon>person</md-icon>
                        <span class="md-list-item-text">Account</span>
                    </md-list-item>
                    <md-list-item @click="handleHome">
                        <md-icon>arrow_back</md-icon>
                        <span class="md-list-item-text">Return Home</span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>
        </md-app>
    </div>
</template>

<script>
import axios from "axios";

document.title = "Settings";

export default {
    name: "voidmevn",
    data() {
        return {
            item: "Choose an option..."
        };
    },
    mounted() {
        axios.get("/api").then(response => {
            if(response.data == "") return this.$router.push("/log-in");
            this.$store.commit("setUser", {
                user: response.data
            });
        });
        
        if(this.$store.getters.user == null) {
            this.$router.push("/log-in");
        }
    },
    methods: {
        handleAccount() {
            this.item = "Account";
        },
        handleHome() {
            this.$router.push("/");
        }
    }
};
</script>

<style lang="scss" scoped>
  .md-app {
    min-height: 100vh;
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    width: 325px;
    max-width: calc(100vw - 125px);
  }
</style>