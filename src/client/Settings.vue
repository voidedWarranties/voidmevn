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
                    <md-list-item @click="handleSecurity">
                        <md-icon>vpn_key</md-icon>
                        <span class="md-list-item-text">Security</span>
                    </md-list-item>
                    <md-list-item @click="handleHome">
                        <md-icon>arrow_back</md-icon>
                        <span class="md-list-item-text">Return Home</span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>

            <md-app-content v-if="item == 'Security'">
                <form class="md-layout" @submit.prevent="changePassword">
                    <md-card class="md-layout-item md-size-50 md-small-size-100">
                        <md-card-header>
                            <div class="md-title">Change Password</div>
                        </md-card-header>
                        <md-card-content>
                            <md-field>
                                <label for="current">Current Password</label>
                                <md-input type="password" v-model="current" name="current" />
                            </md-field>
                            <md-field :class="csamePass">
                                <label for="new">New Password</label>
                                <md-input type="password" v-model="neww" name="new" />
                                <span class="md-error">Must not be the same as the old password</span>
                            </md-field>
                            <md-field :class="cmatchingPass">
                                <label for="new-confirm">Confirm Password</label>
                                <md-input type="password" v-model="new_confirm" name="new-confirm" />
                                <span class="md-error">Passwords do not match</span>
                            </md-field>
                        </md-card-content>
                        <md-card-actions>
                            <md-button type="submit" class="md-primary">Change Password</md-button>
                        </md-card-actions>
                    </md-card>
                </form>
            </md-app-content>
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
            item: "Account",
            current: null,
            neww: null,
            new_confirm: null,
        };
    },
    mounted() {
        axios.get("/api/user").then(response => {
            if(response.data == "") return this.$router.push("/login");
            this.$store.commit("setUser", {
                user: response.data
            });
        });
        
        if(this.$store.getters.user == null) {
            this.$router.push("/login");
        }
    },
    methods: {
        handleAccount() {
            this.item = "Account";
        },
        handleSecurity() {
            this.item = "Security";
        },
        handleHome() {
            this.$router.push("/");
        },
        changePassword(event) {
            if(this.current !== this.neww && this.neww === this.new_confirm) {
                axios({
                    method: "post",
                    url: "/account/changepass",
                    config: { headers: {"Content-Type": "application/X-www-form-urlencoded"} },
                    data: `old=${this.current}&new=${this.neww}`
                }).then(response => {
                });
                this.current = null;
                this.neww = null;
                this.new_confirm = null;
            }
        }
    },
    computed: {
        csamePass() {
            if(this.neww) {
                return {
                    "md-invalid": this.current === this.neww
                };
            } else {
                return {};
            }
        },
        cmatchingPass() {
            if(this.new_confirm != null) {
                return {
                    "md-invalid": this.neww !== this.new_confirm
                };
            } else {
                return {};
            }
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