<template>
    <div class="q-pa-md">
        <CreateInvoice class="q-mt-sm q-mb-md"></CreateInvoice>
        <filter-dates @interval="filterDataByInterval" @year="filterByYear"></filter-dates>
        <q-table
            title="Predračuni"
            :data="invoices"
            :columns="columns"
            row-key="index"
            :filter="filter"
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
                                <q-item clickable v-close-popup @click="editInvoice(props.row)">
                                    <q-item-section class="text-center">
                                        <q-item-label><q-icon name="create" class="pointer text-black action-icon"></q-icon> {{ $t("general.edit") }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="copyInvoice(props.row.id)">
                                    <q-item-section class="text-center">
                                        <q-item-label><q-icon name="content_copy" class="pointer text-black action-icon"></q-icon> {{ $t("general.copy") }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="viewInvoice(props.row.id)" :disable="!!props.row.avans || !!props.row.avans_after_invoice">
                                    <q-item-section class="text-center">
                                        <q-item-label><q-icon name="pageview" target="_blank" class="pointer text-black action-icon"></q-icon> {{ $t("general.view") }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="exportInvoice(props.row.id)">
                                    <q-item-section class="text-center">
                                        <q-item-label><q-icon name="input" class="pointer text-black action-icon"></q-icon> {{ $t("general.export") }}</q-item-label>
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
        <edit-dialog></edit-dialog>
        <print-invoice></print-invoice>
    </div>
</template>

<script>

    import EditDialog from "./dialogs/EditDialog";
    import CreateInvoice from "./dialogs/CreateInvoice";
    import FilterDates from "./filter/FilterDates";
    import PrintInvoice from "./dialogs/PrintInvoice";
    import {mapGetters, mapActions} from 'vuex'
    import mixin from "src/global/mixin";

    export default {
      name: "InvoicesList",
      mixins: [mixin],
      data() {
        return {
          loading: true,
          id: null,
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
              format: val => `${val}`,
              sortable: true
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
            {name: 'total', label: 'Znesek', field: 'total', sortable: true, align: 'center'},
            {name: 'expiration', label: 'Zapadlost', field: 'expiration', sortable: true, align: 'center'},
            {name: 'edit', label: 'Uredi', align: 'center'}
          ]
        }
      },
      components: {
        EditDialog,
        CreateInvoice,
        FilterDates,
        PrintInvoice
      },
      filters: {
        decimals(value) {
          return Math.round(value * 100) / 100 + ' €'
        }
      },
      methods: {
        ...mapActions({
          filterData: 'invoices/filterByInterval',
          removeInvoice: 'invoices/remove',
          copy: 'invoices/copy',
          export: 'invoices/export'
        }),
        tableIndex(row) {
          return this.invoices.indexOf(row) + 1
        },
        today() {
          return this.$moment().format('Y-MM-DD')
        },
        editInvoice(row) {
          this.$store.dispatch('general/editInvoiceDialogAction', true)
          this.$store.dispatch('invoices/currentInvoiceAction', row.id)
          localStorage.setItem('sifra', row.sifra_predracuna)
        },
        confirm(id, sifra) {
          this.$q.dialog({
            title: `${this.$t("general.deleteTitle")} ${sifra}`,
            message: `<span class='text-red'> ${this.$t("general.deleteMessage")}</span>`,
            html: true,
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.removeInvoice(id)
              .then((response) => {
                this.showNotif(response, 'warning')
              })
              .catch((e) => {
                this.showNotif(e, 'negative')
              })
          })
        },
        viewInvoice(id) {
          this.$store.dispatch('general/printInvoiceDialog', true)
          this.$store.dispatch('invoices/viewInvoice', id)
        },
        copyInvoice(id) {
          this.copy(id)
            .then((response) => {
              this.showNotif(response, 'positive')
            })
            .catch((e) => {
              this.showNotif(e, 'negative')
            })
        },
        filterDataByInterval(interval) {
          this.filterData(interval)
        },
        exportInvoice(id) {
          this.export(id)
            .then((response) => {
              this.showNotif(response, 'positive')
            })
            .catch((e) => {
              this.showNotif(e, 'negative')
            })
        },
        filterByYear(year) {
          this.$store.dispatch('invoices/invoicesYear', {
            year
          })
        }
      },
      mounted() {
        let year = this.$moment().year()
        localStorage.setItem('year', JSON.stringify(year));
        this.$store.dispatch('invoices/invoicesYear', {
          year
        })
      },
      computed: {
        ...mapGetters({
          invoices: 'invoices/getInvoices'
        })
      },
      watch: {
        invoices: {
          handler() {
            this.loading = false
          }
        }
      }
    }
</script>

<style scoped>
    .q-badge {
        padding: .3rem
    }
</style>
