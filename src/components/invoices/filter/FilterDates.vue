<template>
    <div class="row q-mt-sm q-mb-sm justify-center">
        <q-input
            ref="date"
            v-model="fromDate"
            label="Od"
            class="col-2 q-ml-sm"
            @click="$refs.fromDate.show()"
        >
            <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="fromDate">
                        <q-date
                            mask="YYYY-MM-DD"
                            v-model="fromDate"
                            @input="dateChanged"
                        />
                    </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>
        <q-input
            ref="date"
            v-model="toDate"
            label="Do"
            class="col-2 q-ml-sm q-pl-sm"
            @click="$refs.toDate.show()"
        >
            <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="toDate">
                        <q-date
                            mask="YYYY-MM-DD"
                            v-model="toDate"
                            @input="dateChanged"
                        />
                    </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>

      <q-select class="col-2 q-ml-sm"
                v-model="year"
                :options="years"
                label="Leto"
                @input="selectYear"
                v-if="allInvoicesRoute()"
      />

        <q-select v-model="employee"
                  v-if="monthRoute()"
                  :options="employees"
                  label="Zaposleni"
                  class="col-2 q-ml-sm"
                  option-label="person"
                  option-value="person"
                  @input="employeeSelected"
        />

        <div class="q-pa-md q-gutter-sm">
            <q-btn color="primary" outline label="Reset" @click="getAll">
                <q-tooltip>
                    Ponastavi filter za izpis vseh
                </q-tooltip>
            </q-btn>
        </div>
        <div class="q-pb-md q-pt-md q-gutter-sm" v-if="finalRoute()">
            <q-btn color="secondary" outline icon="assessment" @click="report">
                <q-tooltip>
                    Knjiga izdanih računov
                </q-tooltip>
            </q-btn>
        </div>
        <div class="q-pb-md q-pt-md q-gutter-sm" v-if="customersRoute()">
            <q-btn color="secondary"
                   outline
                   @click="customerReport"
            >
                <q-icon name="analytics"/>
                <q-tooltip>
                    {{ $t("customers.report.iznosi") }}
                </q-tooltip>
            </q-btn>
        </div>
    </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {Years} from "src/global/variables";
import mixin from "src/global/mixin";

export default {
    name: "FilterDates",
    mixins: [mixin],
    data() {
        return {
            fromDate: null,
            toDate: null,
            employee: null,
            year: null,
            years: Years
        }
    },
    created() {
      this.$store.dispatch('employees/all')
    },
    computed: {
        ...mapGetters({
            employees: 'employees/getEmployees',
            customer_id: 'customers/getCustomerID'
        })
    },
    methods: {
        employeeSelected() {
            let interval = {
                from: this.fromDate,
                to: this.toDate,
                employee_id: this.employee.id
            }
            this.$emit('interval', interval)
        },
        dateChanged() {
            if (this.fromDate && this.toDate) {
                if (this.fromDate > this.toDate) {
                    this.showNotif(`${this.$t('general.dateFromTo')}`,'warning');
                } else {
                    this.filterDataByDates()
                }
            }
        },
        getAll() {
            this.fromDate = null
            this.toDate = null
            this.employee = null
            this.year = null

          switch (true) {
            case this.$router.currentRoute.fullPath === '/':
              this.$store.dispatch('invoices/allInvoices')
              break
            case this.$router.currentRoute.fullPath === '/final-invoices':
              this.$store.dispatch('final/all')
              break
            case this.$router.currentRoute.fullPath === '/website':
              this.$store.dispatch('statistics/visits')
              break
            case this.$router.currentRoute.fullPath === '/customers':
              this.$store.dispatch('customers/total', this.customer_id)
              break
            default:
              this.$store.dispatch('months/all')
          }
        },
        finalRoute() {
            return this.$router.currentRoute.fullPath === '/final-invoices'
        },
        monthRoute() {
            return this.$router.currentRoute.fullPath === '/months'
        },
        report() {
            if (this.fromDate && this.toDate) {
                if (this.fromDate > this.toDate) {
                    this.showNotif(`${this.$t('general.dateFromTo')}`,'warning');
                } else {
                    let interval = {
                        from: this.fromDate,
                        to: this.toDate
                    }
                    this.$store.dispatch('final/report', interval)
                    this.$store.dispatch('general/reportDialog', true)
                }
            }
        },
        customersRoute() {
            return this.$router.currentRoute.fullPath === '/customers'
        },
        customerReport() {
            this.$store.dispatch('general/customerReportDialog', true)
        },
        allInvoicesRoute() {
          return this.$router.currentRoute.fullPath === '/' || this.$router.currentRoute.fullPath === '/final-invoices'
        },
        filterDataByDates() {
           let interval = {
               from: this.fromDate,
               to: this.toDate,
               employee_id: 0
           }
           this.$emit('interval', interval)
        },
        selectYear() {
          if (this.$router.currentRoute.fullPath === '/') {
            localStorage.setItem('year', JSON.stringify(this.year.value));
          } else {
            localStorage.setItem('year-final', JSON.stringify(this.year.value));
          }

          this.$emit('year', this.year.value)
        }
    }
}
</script>

<style scoped>

</style>
