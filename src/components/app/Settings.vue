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
                </div>
            </div>
        </q-btn-dropdown>
    </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import mixin from "src/global/mixin";
import {axiosInstance} from "boot/axios";
import {localhost, production, realm1URL, realm2URL} from "src/global/variables";

export default {
  name: "Settings",
  mixins: [mixin],
  data() {
    return {
      realm : null,
      realmLabel: ''
    }
  },
  computed: {
    ...mapGetters({
      company: 'general/getCompany',
      klavzule: 'general/getKlavzule'
    }),
  },
  created: function () {
    let realmValue = JSON.parse(localStorage.getItem('modus-realm'))
    this.realm = Boolean(realmValue)
    this.realmLabel = realmValue === 1 ? 'D.O.O' : 'S.P.'
    if (localStorage.getItem('modus')) {
      localStorage.removeItem("modus");
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
      let preset
      let settings = {
        status: !this.realm,
        setting: 'realm'
      }

      let newRealm = JSON.parse(localStorage.getItem('modus-realm')) ? 0 : 1
      localStorage.setItem('modus-realm', JSON.stringify(newRealm))
      this.$store.dispatch('general/realmStatus', newRealm)
      this.realmLabel = newRealm === 1 ? 'D.O.O' : 'S.P.'
      this.realm = Boolean(newRealm)

      if (process.env.DEV) {
        preset = newRealm === 0 ? localhost + realm1URL : localhost + realm2URL
      } else {
        preset = newRealm === 0 ? production + realm1URL : production + realm2URL
      }

      axiosInstance.defaults.baseURL = preset

      this.loadNewRealm()
      this.showLoading()
    },
    loadNewRealm() {
      let year = !localStorage.getItem('year') ?
        this.$moment().year() : JSON.parse(localStorage.getItem('year'))

      this.$store.dispatch('customers/all')
      this.$store.dispatch('invoices/invoicesYear', {year})
      this.$store.dispatch('final/finalYear', {year})
      this.$store.dispatch('statistics/total', {years: [this.$moment().year()]})
      this.$store.dispatch('months/all')
      this.$store.dispatch('sklad/all')
      this.$store.dispatch('company/all')
      return true
    }
  }
}
</script>

<style scoped>

</style>
