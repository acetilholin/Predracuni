<template>
    <div class="statistics">
        <div class="text-center q-mt-xl text-subtitle1" v-if="totalInfo">
          <div class="row">
            <div style="min-width: 250px; max-width: 300px">
              <q-select
                v-model="yearMultiple"
                multiple
                :options="options"
                use-chips
                stack-label
                label="Leto"
                @input="selectYear"
              />
            </div>
          </div>
          <div class="text-center" v-for="tot in total" v-if="yearMultiple.length > 0">
             {{ $t("statistics.year") }}: {{ tot.year }}, &Sigma;: <span class="text-green-10">{{ tot.grandTotal | decimals | euro }}</span>
          </div>
        </div>
        <div class="small q-mt-lg" v-if="yearMultiple.length > 0">
            <total :total="total"></total>
        </div>
        <div v-else class="absolute-center">
          {{ $t("statistics.chooseYear") }}
        </div>
    </div>
</template>

<script>

import {mapGetters} from 'vuex'
import Total from "../components/statistics/charts/Total";
import {Years} from "src/global/variables";

export default {
    name: "Statistics",
    data() {
      return {
        totalInfo: true,
        yearMultiple: [
          {
            label: this.$moment().year().toString(),
            value: this.$moment().year()
          }
        ],
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
          years: [this.$moment().year()]
        })
    },
    methods: {
      selectYear() {
        let years = []

        for (let value of Object.values(this.yearMultiple)) {
          years.push(value.value)
        }
        years.sort((a, b) => a - b)
        this.$store.dispatch('statistics/total', {
          years: years
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
