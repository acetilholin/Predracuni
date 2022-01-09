<template>
  <div class="edit-sklad-dialog">
    <q-dialog
      v-model="editDialog"
      persistent
      ref="editSklad"
    >
      <q-card style="width: 800px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">{{ $t("sklad.edit") }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            @submit="createEntry"
            class="q-col-gutter-lg"
          >
            <div class="row">
              <q-field label="Stranka" stack-label disable class="col-5 q-ml-xs">
                <template v-slot:control>
                  <div class="self-center full-width no-outline"
                       tabindex="0"
                  >{{ sklad.customer.naziv_partnerja }}
                  </div>
                </template>
              </q-field>

              <q-field label="Št. računa" stack-label disable class="col-4 q-ml-xs">
                <template v-slot:control>
                  <div class="self-center full-width no-outline"
                       tabindex="0"
                  >{{ sklad.invoice.sifra_predracuna + " - " + sklad.invoice.ime_priimek }}
                  </div>
                </template>
              </q-field>
              <q-field label="Datum montaže" stack-label disable class="col-2 q-ml-xs">
                <template v-slot:control>
                  <div class="self-center full-width no-outline"
                       tabindex="0"
                  >{{ sklad.work_date }}
                  </div>
                </template>
              </q-field>

<!--              <q-select
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
                type="text"
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="person"/>
                </template>
              </q-select>

              <q-select
                v-model="sklad.invoice"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                label="Št. predračuna"
                class="col-6 q-ml-xs"
                :options="invoiceOptions"
                @filter="filterInvoice"
                :option-label='(item) => item.sifra_predracuna + " - " + item.ime_priimek'
                option-value="sifra_predracuna"
                type="text"
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="description"/>
                </template>
              </q-select>-->
            </div>
            <div class="row">
              <q-input v-model="sklad.item"
                       label="artikel"
                       class="col-11 q-ml-xs"
              > <template v-slot:prepend>
                <q-icon name="subject" />
              </template>
              </q-input>
            </div>
            <div class="row">
              <q-input
                ref="date"
                v-model="sklad.created"
                label="Ustvarjen"
                class="col-3 q-ml-sm"
                @click="$refs.qDateCreated.show()"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateCreated">
                      <q-date
                        mask="YYYY-MM-DD"
                        v-model="sklad.created"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

            </div>
            <div class="q-mt-md">
              <q-btn label="Spremeni"
                     :loading="submitting"
                     type="submit"
                     color="teal"
              >
                <template v-slot:loading>
                  <q-spinner-tail
                    color="white"
                  />
                </template>
              </q-btn>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="ZAPRI" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import mixin from "src/global/mixin";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "EditSklad",
  mixins: [mixin],
  data() {
    return {
      submitting: false,
      options: '',
      invoiceOptions: '',
    }
  },
  computed: {
    ...mapGetters({
      editDialog: 'general/getSkladModal',
      getSklad: 'sklad/getSklad',
      customers: 'customers/getCustomers',
      invoices: 'invoices/getInvoices'
    }),
    sklad: {
      get: function () {
        return this.getSklad
      },
      set: function (newVal) {
      }
    }
  },
  created() {
    this.invoiceOptions = this.invoices
    this.options = this.customers
  },
  methods: {
    ...mapActions({
      closeEditDialog: 'general/editSkladModal',
      update: 'sklad/update'
    }),
    closeDialog() {
      this.closeEditDialog(false)
    },
    createEntry() {
      this.submitting = true
      this.update(this.sklad)
        .then((response) => {
          this.showNotif(response, 'positive')
          setTimeout(() => {
            this.submitting = false
            this.sklad = {}
          }, 500)
        })
        .catch((e) => {
          this.showNotif(e, 'negative')
          this.submitting = false
        })
    },
    /*filterInvoice(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.invoiceOptions = this.invoices.filter(
          v => v.ime_priimek.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    filterCustomers(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.customers.filter(
          v => v.naziv_partnerja.toLowerCase().indexOf(needle) > -1
        )
      })
    }*/
  }
}
</script>

<style scoped>

</style>
