<template>
    <div>
        <q-header elevated class="bg-primary text-white" v-show="authenticated">
            <q-toolbar>
                <q-btn flat @click="changeDrawerState" round dense icon="menu" />
                <q-toolbar-title>{{ title }}</q-toolbar-title>
                <span class="q-mr-xl text-subtitle1">{{ realmTitle }}</span>
                <span v-if="role" class="q-mr-sm">
                    <settings></settings>
                </span>
                <span class="q-mr-md" v-if="currentUser">
                        <q-chip>
                            <q-avatar class="bg-white">
                                <img :src="image(currentUser.picture)" @click="modal" class="pointer" alt="" >
                            </q-avatar>
                              {{ currentUser.username }}
                        </q-chip>
                    </span>
                <q-btn @click.prevent="signOut" outline color="white" label="Odjava" />
            </q-toolbar>
        </q-header>
        <header-dialog :currentUser="currentUser"></header-dialog>
    </div>
</template>

<script>

    import { appName } from 'src/global/variables'
    import {mapGetters, mapActions} from "vuex";
    import Settings from "./Settings";
    import HeaderDialog from "./HeaderDialog";
    import { countriesPath, picturesPath } from 'src/global/variables'

    export default {
        name: "Header",
        created() {
          this.realmInfo()
        },
        data() {
            return {
                title: appName,
                realmTitle: null
            }
        },
        components: {
            HeaderDialog,
            Settings
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/user',
                authenticated: 'auth/authenticated',
                drawer: 'general/getDrawer',
                realmStatus: 'general/getRealm'
            })
        },
        methods: {
            ...mapActions({
               signoutAction: 'auth/logout',
               triggerModal: 'general/modalAction',
               drawerState: 'general/drawerAction'
            }),
            changeDrawerState() {
                this.drawerState(!this.drawer)
            },
            image(img) {
                return picturesPath + img
            },
            modal() {
                this.triggerModal(true)
            },
            role() {
                return this.currentUser.role === 'admin'
            },
            signOut() {
                this.signoutAction()
                    .then(() => {
                        this.$router.push('/login-register')
                    })
            },
            realmInfo() {
              this.realmTitle = this.currentUser.realm === 'all' ? process.env.REALM_ALL : (this.currentUser.realm === 'r1' ? process.env.REALM_1 : process.env.REALM_2)
            }
        }
    }
</script>

<style scoped>

</style>
