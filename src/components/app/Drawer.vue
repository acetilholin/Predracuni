<template>
    <q-drawer
        v-model="drawer"
        show-if-above
        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        mini-to-overlay
        v-show="authenticated"
        :width="200"
        :breakpoint="500"
        bordered
        content-class="bg-grey-3"
    >
        <q-scroll-area class="fit">
            <q-list padding>
                <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon :class="{'icon-active' : currentPage === '/'}" name="article" />
                    </q-item-section>
                    <q-item-section>
                        <router-link to="/" class="text-subtitle1">{{ $t("drawer.invoices") }}</router-link>
                    </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon :class="{'icon-active' : currentPage === '/customers'}" name="business_center" />
                    </q-item-section>
                    <q-item-section>
                        <router-link to="/customers" class="text-subtitle1">{{ $t("drawer.customers") }}</router-link>
                    </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon :class="{'icon-active' : currentPage === '/final-invoices'}" name="description" />
                    </q-item-section>
                    <q-item-section>
                        <router-link to="/final-invoices" class="text-subtitle1">{{ $t("drawer.finalInvoices") }}</router-link>
                    </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon :class="{'icon-active' : currentPage === '/statistics'}" name="euro" />
                    </q-item-section>
                    <q-item-section>
                        <router-link to="/statistics" class="text-subtitle1">{{ $t("drawer.total") }}</router-link>
                    </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon :class="{'icon-active' : currentPage === '/website'}" name="public" />
                    </q-item-section>
                    <q-item-section>
                        <router-link to="/website" class="text-subtitle1">{{ $t("drawer.website") }}</router-link>
                    </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon :class="{'icon-active' : currentPage === '/users'}" name="people_outline" />
                    </q-item-section>
                    <q-item-section>
                        <router-link to="/users" class="text-subtitle1">{{ $t("drawer.users") }}</router-link>
                    </q-item-section>
                </q-item>
                <q-item clickable v-ripple v-if="permissions()">
                    <q-item-section avatar>
                        <q-icon :class="{'icon-active' : currentPage === '/months'}" name="query_builder" />
                    </q-item-section>
                    <q-item-section>
                        <router-link to="/months" class="text-subtitle1">{{ $t("drawer.hours") }}</router-link>
                    </q-item-section>
                </q-item>
                <q-item clickable v-ripple v-if="company">
                    <q-item-section avatar>
                        <q-icon :class="{'icon-active' : currentPage === '/company'}" name="corporate_fare" />
                    </q-item-section>
                    <q-item-section>
                        <router-link to="/company" class="text-subtitle1">{{ $t("drawer.company") }}</router-link>
                    </q-item-section>
                </q-item>
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon :class="{'icon-active' : currentPage === '/sklad'}" name="compost" />
                </q-item-section>
                <q-item-section>
                  <router-link to="/sklad" class="text-subtitle1">{{ $t("drawer.sklad") }}</router-link>
                </q-item-section>
              </q-item>
                <q-item clickable v-ripple v-if="klavzule">
                    <q-item-section avatar>
                        <q-icon :class="{'icon-active' : currentPage === '/klavzule'}" name="list" />
                    </q-item-section>
                    <q-item-section>
                        <router-link to="/klavzule" class="text-subtitle1">{{ $t("drawer.klavzule") }}</router-link>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-scroll-area>
    </q-drawer>
</template>

<script>

    import {mapGetters} from 'vuex'

    export default {
        name: "Drawer",
        data() {
            return {
                miniState: true
            }
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/user',
                authenticated: 'auth/authenticated',
                drawer: 'general/getDrawer',
                company: 'general/getCompany',
                klavzule: 'general/getKlavzule'
            }),
            currentPage() {
                return this.$route.path
            }
        },
        methods: {
          permissions() {
              let user = this.$store.getters["auth/user"]
              return user ? user.role === 'admin' : null
          }
        }
    }
</script>

<style scoped>

    a {
        text-decoration: none;
        color: black;
    }
    .router-link-exact-active {
        color: #1976d2;
        font-weight: 500;
    }
    .icon-active {
        color: #1976d2;
    }
</style>
