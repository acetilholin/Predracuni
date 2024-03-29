<template>
    <div class="q-pa-md">
        <filter-dates @interval="filterDataByInterval" @year="filterByYear"></filter-dates>
        <q-table
            title="Računi"
            :data="final"
            :columns="columns"
            :filter="filter"
            row-key="index"
            :loading="loading"
            :pagination.sync="pagination"
        >
            <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Išči">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td>
                        {{ tableIndex(props.row) }}
                    </q-td>
                    <q-td key="sifra_predracuna" :props="props">
                       <span class="text-bold text-purple-7 pointer" v-show="props.row.avans">
                        {{ $t("invoices.a") }}
                      <q-tooltip>
                          {{ $t("invoices.avans_table") }}: {{ props.row.avans_sum}} €
                        </q-tooltip>
                      </span>
                      <span class="text-bold text-orange-7 pointer" v-show="props.row.avans_after_invoice">
                         {{ $t("invoices.r") }}
                      <q-tooltip>
                           {{ $t("invoices.avans_after_table") }}: {{ props.row.total | decimals }}  &#x2192; {{ props.row.avans_sum}} €<br>
                        <span v-if="props.row.related_to_invoice">{{ $t("invoices.invoice") }}: {{ props.row.related_to_invoice }}</span>
                        </q-tooltip>
                      </span>
                        {{ props.row.sifra_predracuna }}
                    </q-td>
                    <q-td key="ime_priimek" :props="props">
                        {{ props.row.ime_priimek }}
                    </q-td>
                    <q-td key="timestamp" :props="props">
                        {{ props.row.timestamp | moment('DD-MM-Y') }}
                    </q-td>
                    <q-td key="total" :props="props">
                      <span v-if="!props.row.avans_after_invoice && !props.row.avans">{{ props.row.total | decimals }}</span>
                      <span v-else>{{ props.row.avans_sum | decimals }}</span>
                    </q-td>
                    <q-td key="expiration" :props="props">
                        <q-badge :color="$moment(today()).isBefore(props.row.expiration) ? 'green' : 'red'">
                            {{ props.row.expiration | moment('DD-MM-Y') }}
                        </q-badge>
                    </q-td>
                    <q-td key="edit" :props="props">
                        <q-btn-dropdown color="primary" outline icon="settings">
                            <q-list>
                                <q-item clickable v-close-popup @click="viewInvoice(props.row.id)">
                                    <q-item-section class="text-center">
                                        <q-item-label><q-icon name="pageview" target="_blank" class="pointer text-black action-icon"></q-icon> {{ $t("general.view") }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="confirm(props.row.id, props.row.sifra_predracuna)">
                                    <q-item-section class="text-center text-red">
                                        <q-item-label><q-icon name="delete_outline" class="pointer action-icon"></q-icon> {{ $t("general.delete") }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-btn-dropdown>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
        <report></report>
        <print-final-invoice></print-final-invoice>
    </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import FilterDates from "../../invoices/filter/FilterDates";
import PrintFinalInvoice from "../dialogs/PrintFinalInvoice";
import Report from "../dialogs/Report";
import mixin from "src/global/mixin";

export default {
    name: "FinalList",
    mixins: [mixin],
    data() {
        return {
            loading: true,
            pagination: {
                rowsPerPage: 50
            },
            filter: '',
            columns: [
                {
                    name: 'index',
                    label: '#',
                    align: 'center'
                },
                {
                    name: 'sifra_predracuna',
                    required: true,
                    label: 'Šifra',
                    align: 'center',
                    field: 'sifra_predracuna',
                    format: val => `${val}`
                },
                {name: 'ime_priimek', align: 'center', label: 'Ime in priimek / naziv', field: 'ime_priimek'},
                {
                    name: 'timestamp',
                    align: 'center',
                    label: 'Ustvarjen',
                    field: 'timestamp',
                    sortable: true,
                    format: val => `${val}`
                },
                {name: 'total', label: 'Znesek', field: 'total', sortable: true,  align: 'center'},
                {name: 'expiration', label: 'Zapadlost', field: 'expiration', sortable: true,  align: 'center'},
                {name: 'edit', label: 'Uredi', align: 'center'}
            ]
        }
    },
    mounted() {
      let year = this.$moment().year()
      this.$store.dispatch('final/finalYear', {
        year
      })
    },
    components: {
        Report,
        FilterDates,
        PrintFinalInvoice
    },
    computed: {
        ...mapGetters({
            final: 'final/getAll'
        })
    },
    filters: {
        decimals(value) {
            return Math.round(value * 100) / 100 + ' €'
        }
    },
    methods: {
        ...mapActions({
            removeFinal: 'final/remove',
            updateFinal: 'final/update',
            filterData: 'final/filterByInterval'
        }),
        filterDataByInterval(interval) {
            this.filterData(interval)
        },
        tableIndex(row) {
            return this.final.indexOf(row) + 1
        },
        today() {
            return this.$moment().format('Y-MM-DD')
        },
        viewInvoice(id) {
            this.$store.dispatch('general/printFinalInvoiceDialog', true)
            this.$store.dispatch('final/view', id)
        },
        confirm(id, sifra) {
            this.$q.dialog({
                title: `${this.$t("general.deleteTitle")} ${sifra}`,
                message: `<span class='text-red'> ${this.$t("general.deleteMessage")}</span>`,
                html: true,
                cancel: true,
                persistent: true
            }).onOk(() => {
                this.removeFinal(id)
                    .then((response) => {
                        this.showNotif(response, 'warning')
                    })
                    .catch((e) => {
                        this.showNotif(e, 'negative')
                    })
            })
        },
      filterByYear(year) {
        this.$store.dispatch('final/finalYear', {
          year
        })
      }
    },
    watch: {
        final: {
            handler() {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>

</style>
