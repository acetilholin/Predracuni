<template>
    <div class="statistics">
        <div class="text-center q-mt-xl text-subtitle1" v-if="totalInfo">
          <div class="row">
            <q-select class="col-2 q-ml-sm"
                      v-model="year"
                      :options="options"
                      label="Leto"
                      @input="selectYear"
            />
          </div>
            {{ $t("statistics.totalEarnings") }}: <span class="text-primary">{{ total.interval }}</span>
            <br>
            <div>&Sigma;: <span class="text-green-10">{{ total.grandTotal | decimals | euro }}</span></div>
        </div>
        <div class="small q-mt-lg">
            <total :total="total"></total>
        </div>
    </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import Total from "../components/statistics/charts/Total";
import {Years} from "src/global/variables";

export default {
    name: "Statistics",
    data() {
      return {
        totalInfo: false,
        year: this.$moment().year(),
        options: Years
      }
    },
    computed: {
        ...mapGetters({
            total: 'statistics/getTotal'
        }),
    },
    components: {
        Total
    },
    filters: {
        decimals(val) {
            return val.toLocaleString('de-DE', { minimumFractionDigits: 2 });
        },
        euro(val) {
            return val + ' €'
        }
    },
    mounted() {
        this.$q.loading.show({
            spinnerSize: 40
        })
        this.$store.dispatch('statistics/total', {
          year: this.$moment().year()
        })
    },
    methods: {
      selectYear() {
          this.$store.dispatch('statistics/total', {
            year: this.year.value
          })
        }
    },
    watch: {
        total: {
            handler() {
                this.$q.loading.hide()
                this.totalInfo = true
            }
        }
    }
}
</script>

<style scoped>
.small {
    max-height: 250px;
    max-width: 95%;
}
</style>
