<template>
    <div>
        <q-dialog
            v-model="dialog"
            persistent
            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
            <q-card class="bg-white text-black">
                <q-bar>
                    <q-space />
                    <q-btn dense flat icon="close" @click="closeDialog()">
                        <q-tooltip>Zapri</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section>
                    <div class="text-h5">Urejanje predračuna: <span class="text-primary">{{ invoice.ime_priimek }}</span></div>
                    <div class="text-body1">Ustvarjeno dne: <span class="text-grey-8">{{ invoice.timestamp | moment('DD-MM-Y') }}</span></div>
                    <div class="text-body1">Datum zapadlosti: <span :class="$moment(today()).isBefore(invoice.expiration) ? 'text-green' : 'text-red'">{{ invoice.expiration | moment('DD-MM-Y') }}</span></div>
                    <div class="text-body1">Delo opravljeno: <span class="text-grey-8" v-if="invoice.work_date">{{ invoice.work_date | moment('DD-MM-Y') }}</span></div>
                    <div class="text-body1">Klavzula: <span class="text-grey-8">{{ invoice.klavzula }}</span></div>
                    <div class="text-body1" v-if="recipient">Prejemnik: <span class="text-grey-8">{{ recipient.title }}, {{ recipient.street}}, {{ recipient.posta }}</span></div>
                    <div class="prejemnik q-mt-xs">
                        <q-btn-dropdown color="primary" outline label="Prejemnik">
                            <q-list>
                                <q-item clickable v-if="!recipient" v-close-popup @click="addPrejemnik()">
                                    <q-item-section>
                                        <q-item-label>
                                            <q-icon name="add"></q-icon>
                                            Dodaj
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item clickable v-if="recipient" v-close-popup @click="editPrejemnik()">
                                    <q-item-section>
                                        <q-item-label>
                                            <q-icon name="edit"></q-icon>
                                            Uredi
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item clickable v-if="recipient" v-close-popup @click="removePrejemnik()">
                                    <q-item-section>
                                        <q-item-label class="text-red">
                                            <q-icon name="delete_outline"></q-icon>
                                            Izbriši
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-btn-dropdown>
                    </div>
                    <div class="q-mt-sm">
                      <q-btn-dropdown color="teal-6" outline label="Opomba">
                        <q-list>
                          <q-item clickable v-if="!invoice.remark" v-close-popup @click="addRemark">
                            <q-item-section>
                              <q-item-label>
                                <q-icon name="add"></q-icon>
                                Dodaj
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-if="invoice.remark" v-close-popup @click="editRemark">
                            <q-item-section>
                              <q-item-label>
                                <q-icon name="edit"></q-icon>
                                Uredi
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item clickable  v-if="invoice.remark" v-close-popup @click="deleteRemark">
                            <q-item-section>
                              <q-item-label class="text-red">
                                <q-icon name="delete_outline"></q-icon>
                                Izbriši
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                    <div class="q-mt-sm">
                      <div>
                        <q-checkbox v-model="avansOption"
                                    label="Avans"
                                    color="purple"
                                    :disable="!!this.invoice.avans_after_invoice"
                                    @input="avansChecked"
                        />
                      </div>
                      <div>
                        <q-checkbox v-model="avansAfterInvoiceOption"
                                    color="orange"
                                    label="Račun po avansnem plačilu"
                                    :disable="!!this.invoice.avans"
                                    @input="avansAfterChecked"
                        />
                      </div>
                    </div>
                </q-card-section>

                <q-card-section class="q-pt-none">

                    <div class="row q-pa-xs justify-center">

                        <q-select
                            v-model="customer"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="0"
                            label="Stranka"
                            class="col-2 q-ml-sm"
                            :options="options"
                            @filter="filterInput"
                            @input="strankaChanged"
                            option-label="naziv_partnerja"
                            type="text"
                            map-options
                        >
                            <template v-slot:prepend>
                                <q-icon name="person" />
                            </template>
                        </q-select>

                        <q-input
                            ref="date"
                            v-model="timestamp"
                            label="Ustvarjen dne"
                            class="col-2 q-ml-sm"
                            @click="$refs.qDateTimestamp.show()"
                        >
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateTimestamp">
                                        <q-date
                                            mask="YYYY-MM-DD"
                                            v-model="invoice.timestamp"
                                            @input="timestampChanged"
                                        />
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>

                        <q-input
                            ref="date"
                            v-model="expiration"
                            label="Zapade dne"
                            class="col-2 q-ml-sm"
                            @click="$refs.qDateExpiration.show()"
                        >
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateExpiration">
                                        <q-date
                                            mask="YYYY-MM-DD"
                                            v-model="invoice.expiration"
                                            @input="expirationChanged"
                                        />
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>

                        <q-input
                            ref="date"
                            v-model="workDate"
                            label="Opravljeno dne"
                            class="col-2 q-ml-sm"
                            @click="$refs.qDateWorkDate.show()"
                        >
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateWorkDate">
                                        <q-date
                                            mask="YYYY-MM-DD"
                                            v-model="invoice.work_date"
                                            @input="workDateChanged"
                                        />
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>

                        <q-select v-model="klavzula"
                                  :options="klavzule"
                                  label="Klavzula"
                                  @input="kChanged"
                                  option-value="short_name"
                                  option-label="short_name"
                                  class="col-1 q-ml-sm"
                        />
                        <q-select v-model="vat"
                                  :options="vatOptions"
                                  @input="vChanged"
                                  option-value="val"
                                  option-label="desc"
                                  label="DDV"
                                  suffix="%"
                                  class="col-1 q-ml-sm"
                        />
                      <q-input v-model="avans"
                               bottom-slots
                               label="Avans z DDV"
                               class="q-ml-sm col-1"
                               type="number"
                               @blur="avansChanged"
                      />
                    </div>
                </q-card-section>
                <q-card-section>
                    <div class="text-center">
                        <q-btn push
                               color="white"
                               text-color="green"
                               round
                               icon="add"
                               @click="addItem"
                        >
                            <q-tooltip anchor="top middle"
                                       self="bottom middle"
                                       :offset="[10, 10]"
                            >
                                Dodaj artikel
                            </q-tooltip>
                        </q-btn>
                    </div>
                </q-card-section>

                <q-card-section>
                    <div class="text-center">
                        <q-btn color="secondary"
                               outline
                               :disable="disableUpdate"
                               :loading="submitting"
                               icon="autorenew"
                               label="Posodobi"
                               @click="update(invoice.id)"
                        >
                            <template v-slot:loading>
                                <q-spinner-tail
                                    color="secondary"
                                />
                            </template>
                        </q-btn>
                    </div>
                </q-card-section>

                <q-card-section>
                    <add-item @newItem="addNewItem"></add-item>
                </q-card-section>
                <q-card-section class="q-pb-none">
                  <div class="row">
                    <q-input
                      class="col-md-2 q-ml-md"
                      v-model="invoice.sifra_predracuna"
                      label="Šifra predračuna"
                      hint="Format: zap.število/leto"
                      :rules="[ lengthResp, checkFormat]"
                    />
                    <q-input
                      v-if="invoice.avans_after_invoice"
                      class="col-md-2 q-ml-md"
                      v-model="invoice.related_to_invoice"
                      label="Šifra po avansnem računu"
                    />
                  </div>
                  <div class="row q-mt-sm">
                    <div class="q-ml-md" v-if="invoice.remark">
                      <q-icon class="all-pointer-events" size="22px" name="info" color="secondary">
                        <q-tooltip>
                          Opomba
                        </q-tooltip>
                      </q-icon>
                      {{ invoice.remark | longTxt }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <items-table :invoice="invoice" :items="items" @removeItem="removeFromItems"></items-table>
                </q-card-section>
            </q-card>
        </q-dialog>
        <add-recipient :invoice="invoice"></add-recipient>
        <edit-recipient v-if="recipient" :recipient="recipient"></edit-recipient>
        <remark-edit :invoice="invoice" @remark="remarkEdit"></remark-edit>
    </div>
</template>

<script>

    import ItemsTable from "../tables/ItemsTable";
    import AddRecipient from "./AddRecipient";
    import Create from "src/components/App/Create";
    import AddItem from "./AddItem";
    import {mapActions, mapGetters} from 'vuex'
    import EditRecipient from "./EditRecipient";
    import mixin from "src/global/mixin";
    import RemarkEdit from "components/invoices/dialogs/RemarkEdit";

    export default {
        name: "EditDialog",
        mixins: [mixin],
        data() {
            return {
                disableUpdate:false,
                submitting: false,
                options: this.customers,
                maximizedToggle: true,
                customerID: null,
                vatOptions: [
                    {
                        val: 0,
                        desc: '0'
                    },
                    {
                        val: 9.5,
                        desc: '9.5 %'
                    },
                    {
                        val: 22,
                        desc: '22 %'
                    },
                ]
            }
        },
        computed: {
            ...mapGetters({
                dialog: 'general/getEditInvoiceDialog',
                invoice: 'invoices/getInvoice',
                initialValue: 'invoices/getInvoice',
                items: 'invoices/getItems',
                klavzule: 'klavzule/getKlavzule',
                customers: 'customers/getCustomers',
                recipient: 'invoices/getRecipient'
            }),
            timestamp: function () {
                return this.$moment(this.invoice.timestamp).format('DD-MM-Y')
            },
            expiration: function () {
                return this.$moment(this.invoice.expiration).format('DD-MM-Y')
            },
            workDate: {
                get: function () {
                    return this.invoice.work_date !== null ? this.$moment(this.invoice.work_date).format('DD-MM-Y') : null
                },
                set: function (newValue) {
                    return this.$moment(newValue).format('DD-MM-Y')
                }
            },
            klavzula: {
                get: function () {
                    return this.invoice.klavzula
                },
                set: function (newValue) {
                    this.invoice.klavzula = newValue.short_name
                }
            },
            vat: {
                get: function () {
                    return this.invoice.vat
                },
                set: function (newValue) {
                    this.invoice.vat = newValue.val
                }
            },
            customer: {
                get: function () {
                    return this.invoice.ime_priimek
                },
                set: function (newValue) {
                    this.invoice.ime_priimek = newValue.naziv_partnerja
                    this.invoice.customer_id = newValue.id
                }
            },
            avans: {
              get: function () {
                return this.invoice.avans_sum
              },
              set: function (newValue) {
                this.invoice.avans_sum = newValue
              }
            },
            avansOption: {
              get: function () {
                return !!this.invoice.avans
              },
              set: function (newValue) {
                this.invoice.avans = newValue
              }
            },
            avansAfterInvoiceOption: {
              get: function () {
                return !!this.invoice.avans_after_invoice
              },
              set: function (newValue) {
                this.invoice.avans_after_invoice = newValue
              }
            }
        },
        components: {
          RemarkEdit,
            AddItem,
            Create,
            ItemsTable,
            AddRecipient,
            EditRecipient
        },
        created() {
          this.$store.dispatch('klavzule/all')
          this.$store.dispatch('customers/all')
        },
        filters: {
          longTxt(val) {
            return val.length > 100 ? val.substring(0, 100) + " ..." : val
          }
        },
        methods: {
            ...mapActions({
               closeEditDialog: 'general/editInvoiceDialogAction',
               addItemDialog: 'general/addItemDialog',
               updateInvoice: 'invoices/update',
               remove: 'invoices/removeRecipient',
               addInvoiceItem: 'invoices/addItem',
               removeInvoiceItem: 'invoices/removeItemFromInvoice'
            }),
            addNewItem(newItem) {
                newItem.id = null
                newItem.invoice_id = this.invoice.id
                newItem.item_price = this.invoice.avans ? ( this.invoice.avans_sum - ((this.invoice.avans_sum * this.invoice.vat) /( 100 + this.invoice.vat))) : newItem.item_price
                newItem.total_price = this.invoice.avans ? this.invoice.avans_sum : newItem.total_price
                this.addInvoiceItem(newItem)
                this.showNotif(`${this.$t('general.itemAdded')}`, 'positive')
            },
            addPrejemnik() {
                this.$store.dispatch('general/AddRecipientDialog', true)
            },
            editPrejemnik() {
                this.$store.dispatch('general/editRecipientDialog', true)
            },
            removeFromItems(item) {
                this.removeInvoiceItem(item)
            },
            removePrejemnik() {
                this.$q.dialog({
                    title: `${this.$t("general.deleteTitle")}`,
                    message: `<span class='text-red'>${this.$t("general.deleteMessage")}</span>`,
                    html: true,
                    cancel: true,
                    persistent: true
                }).onOk(() => {
                    this.remove(this.recipient.id)
                        .then((response) => {
                            this.showNotif(response, 'warning')
                        })
                        .catch((e) => {
                            this.showNotif(e, 'negative')
                        })
                })
            },
            addItem() {
                this.addItemDialog(true)
            },
            filterInput (val, update, abort) {
                update(() => {
                    const needle = val.toLowerCase()
                    this.options = this.customers.filter(
                        v => v.naziv_partnerja.toLowerCase().indexOf(needle) > -1
                    )
                })
            },
            update(id) {
                if ((!this.invoice.avans && !this.invoice.avans_after_invoice) && this.invoice.avans_sum > 0) {
                  this.showNotif(`${this.$t('general.chooseAvansOrAvansAfter')}`,'warning');
                } else {
                  this.submitting = true
                  let invoiceData = {
                    id: id,
                    invoice: this.invoice,
                    items: this.items
                  }

                  this.updateInvoice(invoiceData)
                    .then((response) => {
                      this.showNotif(response, 'positive')
                      setTimeout(() => {
                        this.submitting = false
                      }, 500)
                    })
                    .catch((e) => {
                      this.showNotif(e, 'negative')
                      this.submitting = false
                    })
                }
            },
            closeDialog() {
                this.closeEditDialog(false)
            },
            today() {
                return this.$moment().format('Y-MM-DD')
            },
            kChanged() {
                this.showNotif(`${this.$t('general.klavzulaChanged')}`, 'positive')
            },
            vChanged() {
                this.showNotif(`${this.$t('general.VATChanged')}`, 'positive')
            },
            avansChanged() {
              if (this.invoice.avans_sum > 0) {
                if (!this.invoice.avans && !this.invoice.avans_after_invoice) {
                  this.showNotif(`${this.$t('general.chooseAvansOrAvansAfter')}`, 'warning')
                } else {
                  this.showNotif(`${this.$t('general.avansChanged')}`, 'positive')
                }
              } else {
                this.invoice.avans = 0
                this.invoice.avans_after_invoice = 0
                this.showNotif(`${this.$t('general.avansRemoved')}`, 'positive')
              }
            },
            timestampChanged() {
                this.$refs.qDateTimestamp.hide()
                this.showNotif(`${this.$t('general.createdChanged')}`, 'positive')
            },
            expirationChanged() {
                this.$refs.qDateExpiration.hide()
                this.showNotif(`${this.$t('general.expirationChanged')}`, 'positive')
            },
            workDateChanged() {
                this.$refs.qDateWorkDate.hide()
                this.showNotif(`${this.$t('general.workDateChanged')}`, 'positive')
            },
            strankaChanged() {
                this.showNotif(`${this.$t('general.customerChanged')}`, 'positive')
            },
          lengthResp(val) {
              if (val.length > 8) {
                this.disableUpdate = true
                return this.$t('general.wrongFormatSifraPredracuna')
              }
            this.disableUpdate = false
          },
          checkFormat(val) {
            const regex = /\d{1,3}\/\d{4}/
            if (!regex.test(val) || !val.includes('/')){
              this.disableUpdate = true
              return this.$t('general.wrongFormatSifraPredracuna')
            }
            this.disableUpdate = false
          },
          validateSifraRacuna() {
               let sifraInitial = localStorage.getItem('sifra')
               const regex = /\d{1,3}\/\d{4}/
               if (regex.test(this.invoice.sifra_predracuna) && this.invoice.sifra_predracuna.length <= 8 && this.invoice.sifra_predracuna.includes('/')) {

                 if (sifraInitial !== this.invoice.sifra_predracuna) {
                   this.$store.dispatch('invoices/checkExisting', {
                     sifra: this.invoice.sifra_predracuna
                   })
                     .then(response => {
                       if (response) {
                         this.showNotif(`${this.$t('general.sifraExists')}`, 'negative')
                         this.disableUpdate = true
                       } else {
                         this.disableUpdate = false
                         this.showNotif(`${this.$t('general.sifraUpdated')}`, 'positive')
                       }
                     })
                 }
               }
          },
          remarkEdit(val) {
            this.invoice.remark = val
          },
          addRemark() {
            this.$store.dispatch('general/addRemarkEditDialog', true)
          },
          editRemark() {
            this.$store.dispatch('general/addRemarkEditDialog', true)
          },
          deleteRemark() {
            this.invoice.remark = null
            this.showNotif(`${this.$t('general.remarkRemoved')}`, 'negative')
          },
          remarkChanged() {
            this.showNotif(`${this.$t('general.remarkEdited')}`, 'positive')
          },
          avansAfterChecked() {
            if (this.invoice.avans_after_invoice) {
              this.showNotif(`${this.$t('general.afterInvoiceMarked')}`, 'positive')
            } else {
              this.showNotif(`${this.$t('general.afterInvoiceRemoved')}`, 'warning')
            }
          },
          avansChecked() {
            if (this.invoice.avans) {
              this.showNotif(`${this.$t('general.avansOptionMarked')}`, 'positive')
            } else {
              this.showNotif(`${this.$t('general.avansOptionRemoved')}`, 'warning')
            }
          }
        }
    }
</script>

<style scoped>

</style>
