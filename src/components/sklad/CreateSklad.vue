<template>
  <div class="create-sklad">
    <div class="text-center">
      <create @triggerModal="modal"></create>
    </div>
    <q-dialog
      v-model="medium"
      ref="createModal"
    >
      <q-card style="width: 750px; max-width: 85vw;">
        <q-card-section>
          <div class="text-h6">{{ $t("sklad.newEntry") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form
            @submit="createEntry"
            @reset="clearForm"
            class="q-col-gutter-lg"
          >
            <div class="row">
              <q-select
                v-model="sklad.customer"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                label="Stranka"
                class="col-5"
                :options="options"
                @filter="filterCustomers"
                option-label="naziv_partnerja"
                option-value="naziv_partnerja"
                @input="getFinalInvoice(sklad.customer)"
                type="text"
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="person"/>
                </template>
              </q-select>
              <q-field label="Št. računa" stack-label disable class="col-6 q-ml-xs">
                <template v-slot:control>
                  <div class="self-center full-width no-outline"
                       tabindex="0"
                  >{{ sklad.invoice.sifra_predracuna }}
                  </div>
                </template>
              </q-field>
            </div>
            <div class="row">
              <q-input v-model="sklad.item"
                       label="Artikel"
                       class="col-6"
              > <template v-slot:prepend>
                <q-icon name="subject" />
              </template>
              </q-input>

              <q-input
                ref="date"
                v-model="sklad.workDate"
                label="Datum montaže"
                class="col-5 q-ml-sm"
                @click="$refs.qDateWorkDate.show()"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateWorkDate">
                      <q-date
                        mask="YYYY-MM-DD"
                        v-model="sklad.workDate"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="q-mt-md">
              <q-btn label="Shrani"
                     :loading="submitting"
                     type="submit"
                     color="green"
              >
                <template v-slot:loading>
                  <q-spinner-tail
                    color="white"
                  />
                </template>
              </q-btn>
              <q-btn label="Počisti" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Zapri" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import Create from "components/app/Create";
import {mapActions, mapGetters} from "vuex";
import mixin from "src/global/mixin";
import {axiosInstance} from "boot/axios";

export default {
  name: "CreateSklad",
  mixins: [mixin],
  components: {
    Create
  },
  computed: {
    ...mapGetters({
      customers: 'customers/getCustomers',
      invoices: 'final/getAll'
    })
  },
  data() {
    return {
      medium: false,
      options: '',
      invoicesOption: [],
      submitting: false,
      sklad: {
        item: '',
        date: '',
        invoice: {
          sira_predracuna: ''
        },
        customer: null,
        workDate: ''
      }
    }
  },
  created() {
    this.options = this.customers
  },
  methods: {
    ...mapActions({
      addSklad: 'sklad/create'
    }),
    modal(val) {
      this.medium = val
    },
    filterCustomers(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.customers.filter(
          v => v.naziv_partnerja.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    filterInvoices(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.invoicesOption = this.invoicesOption.filter(
          v => v.ime_priimek.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    getFinalInvoice(customer) {
      axiosInstance.get(`finalInvoice/customer/${customer.id}`)
      .then((response) => {
        if (response.data.final.length !== 1) {
          this.showNotif(`Stranka ima št. računov: ${response.data.final.length}`, 'negative')
        }else {
          this.sklad.invoice = response.data.final[0]
        }
      })
    },
    clearForm() {
      this.sklad = {}
    },
    createEntry() {
      this.submitting = true
      this.addSklad(this.sklad)
        .then((response) => {
          this.showNotif(response, 'positive')
          setTimeout(() => {
            this.submitting = false
            this.$refs.createModal.hide()
            this.sklad = {}
          }, 500)
        })
        .catch((e) => {
          this.showNotif(e, 'negative')
          this.submitting = false
        })
    }
  },
  watch: {
    invoicesOption: {
      handler() {
        this.invoicesOption = this.invoices
      }
    }
  }
}
</script>

<style scoped>

</style>
