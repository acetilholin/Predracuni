<template>
    <div>
        <q-btn-dropdown
            class="glossy"
            color="white"
            icon="settings"
            outline
        >
            <div class="row no-wrap q-pa-md">
                <div class="column">
                    <div class="text-h6 q-mb-md">{{ $t("general.settings") }}</div>
                    <q-toggle :value="company" label="Prikaži podatke o podjetju" @input="changeCompany" />
                    <q-toggle :value="klavzule" label="Prikaži klavzule" @input="changeKlavzule"/>
                    <q-toggle
                      v-model="realm"
                      @input="changeRealm"
                      checked-icon="domain"
                      color="red"
                      :label="realmName"
                      unchecked-icon="person"
                    />
                </div>
            </div>
        </q-btn-dropdown>
    </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import mixin from "src/global/mixin";
import {realmData} from "src/global/variables";

export default {
    name: "Settings",
    mixins: [mixin],
    data() {
      return {
        realm:false
      }
    },
    computed: {
        ...mapGetters({
            company: 'general/getCompany',
            klavzule: 'general/getKlavzule'
        }),
      realmName() {
        let realm = JSON.parse(localStorage.getItem('realm'))
      }
    },
  created() {
    if (!localStorage.getItem('realm')) {
      localStorage.setItem('realm', 1)
    }
  },
  methods: {
        ...mapActions({
            changeSetting: 'general/changeSetting'
        }),
        changeCompany() {
            let settings = {
                status: !this.company,
                setting: 'company'
            }
            this.changeSetting(settings)
                .then((response) => {
                    this.showNotif(response, 'positive')
                })
                .catch((e) => {
                    this.showNotif(e, 'negative')
                })
        },
        changeKlavzule() {
            let settings = {
                status: !this.klavzule,
                setting: 'klavzule'
            }
            this.changeSetting(settings)
                .then((response) => {
                    this.showNotif(response, 'positive')
                })
                .catch((e) => {
                    this.showNotif(e, 'negative')
                })
        },
      changeRealm() {
        let realm = JSON.parse(localStorage.getItem('realm'))
        localStorage.setItem('realm', JSON.stringify(realm === 1 ? 2 : 1))
      }
    }
}
</script>

<style scoped>

</style>
