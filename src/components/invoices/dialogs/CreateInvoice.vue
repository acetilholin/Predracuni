<template>
    <div class="create-invoice">
        <div class="text-center">
            <create @triggerModal="modal"></create>
        </div>
        <q-dialog
            v-model="dialog"
            persistent
            ref="createInvoice"
            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
            <q-card class="bg-white text-black">
                <q-bar>
                    <q-space />
                    <q-btn dense flat icon="close" @click="closeDialog" v-close-popup>
                        <q-tooltip>Zapri</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section>
                    <div class="text-h5">Stranka: <span class="text-primary">{{ invoice.ime_priimek }}</span></div>
                    <div class="text-body1">Datum zapadlosti: <span v-if="invoice.expiration" :class="$moment(today()).isBefore(invoice.expiration) ? 'text-green' : 'text-red'">{{ invoice.expiration | moment('DD-MM-Y') }}</span></div>
                    <div class="text-body1">Delo opravljeno: <span class="text-grey-8" v-if="invoice.work_date">{{ invoice.work_date | moment('DD-MM-Y') }}</span></div>
                    <div class="text-body1">Klavzula: <span class="text-grey-8">{{ invoice.klavzula }}</span></div>
                    <div class="text-body1" v-if="!recipientMenu">Prejemnik: <span class="text-grey-8">{{ recipient.title }}, {{ recipient.street}}, {{ recipient.posta }}</span></div>
                    <div class="prejemnik q-mt-xs">
                        <q-btn-dropdown color="primary" outline label="Prejemnik">
                            <q-list>
                                <q-item clickable v-if="recipientMenu" v-close-popup @click="addPrejemnik()">
                                    <q-item-section>
                                        <q-item-label>
                                            <q-icon name="add"></q-icon>
                                            Dodaj
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item clickable v-if="!recipientMenu" v-close-popup @click="editPrejemnik()">
                                    <q-item-section>
                                        <q-item-label>
                                            <q-icon name="edit"></q-icon>
                                            Uredi
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item clickable v-if="!recipientMenu" v-close-popup @click="removePrejemnik()">
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
                          <q-item clickable v-if="!invoice.remark" v-close-popup @click="openRemarkDialog">
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
                        <q-checkbox v-model="invoice.avans"
                                    label="Avans"
                                    color="purple"
                                    :disable="invoice.avans_after_invoice"
                                    @input="avansChecked"
                        />
                      </div>
                      <div>
                        <q-checkbox v-model="invoice.avans_after_invoice"
                                    color="orange"
                                    label="Račun po avansnem plačilu"
                                    :disable="invoice.avans"
                                    @input="avansAfterChecked"
                        />
                      </div>
                    </div>
                    <q-btn color="red" class="q-mt-lg" icon="delete" @click="deleteAll()" label="Izbriši">
                        <q-tooltip>
                            Izbriši celoten predračun
                        </q-tooltip>
                    </q-btn>
                </q-card-section>

                <q-card-section class="q-pt-none">

                    <div class="row q-pa-sm justify-center">

                        <q-select
                            v-model="customer"
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="0"
                            label="Stranka"
                            class="col-3 q-ml-sm"
                            :options="options"
                            @filter="filterInput"
                            @input="fieldChanged($t('general.customerAdded'))"
                            option-label="naziv_partnerja"
                            option-value="naziv_partnerja"
                            type="text"
                            map-options
                        >
                            <template v-slot:prepend>
                                <q-icon name="person" />
                            </template>
                        </q-select>

                        <q-input
                            ref="date"
                            v-model="invoice.expiration"
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
                                            @input="expirationWorkDateChanged('expiration',$t('general.expirationDateAdded'))"
                                        />
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>

                        <q-input
                            ref="date"
                            v-model="invoice.work_date"
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
                                            @input="expirationWorkDateChanged('workDate',$t('general.workDateAdded'))"
                                        />
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>

                        <q-select v-model="klavzula"
                                  :options="klavzule"
                                  label="Klavzula"
                                  @input="fieldChanged($t('general.klavzulaAdded'))"
                                  option-value="short_name"
                                  option-label="short_name"
                                  class="col-1 q-ml-sm"
                        />
                        <q-select v-model="vat"
                                  :options="vatOptions"
                                  @input="fieldChanged($t('general.VATadded'))"
                                  option-value="val"
                                  option-label="desc"
                                  label="DDV"
                                  suffix="%"
                                  class="col-1 q-ml-sm"
                        />
                        <q-input v-model="avans"
                                 bottom-slots
                                 label="Avans z DDV"
                                 class="q-px-md col-1"
                                 @blur="avansChanged"
                        />
                        <q-input v-model="invoice.final_discount"
                                 bottom-slots
                                 label="Komercialni popust"
                                 suffix="€"
                                 class="q-px-md col-1"
                                 @blur="fieldChanged($t('general.finalDiscount'))"
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
                                {{ $t("invoices.addItem") }}
                            </q-tooltip>
                        </q-btn>
                    </div>
                </q-card-section>
                <q-card-section class="q-pb-none">
                    <div class="text-center">
                        <q-btn color="secondary"
                               outline
                               :loading="submitting"
                               icon="save"
                               label="Shrani"
                               @click="save"
                        >
                            <template v-slot:loading>
                                <q-spinner-tail
                                    color="secondary"
                                />
                            </template>
                        </q-btn>
                    </div>
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
                        :rules="[ lengthResp, checkFormat]"
                      />
                    </div>
                    <div class="q-ml-md" v-if="invoice.remark">
                      <q-icon class="all-pointer-events" size="22px" name="info" color="secondary">
                        <q-tooltip>
                          Opomba
                        </q-tooltip>
                      </q-icon>
                      {{ invoice.remark | longTxt }}
                    </div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <items-table :invoice="invoice" :items="items" @removeItem="removeFromItems"></items-table>
                </q-card-section>
            </q-card>
        </q-dialog>
        <add-new-recipient @addRecipient="addNewRecipient"></add-new-recipient>
        <add-item @newItem="addNewItem"></add-item>
        <add-remark @remark="addRemark" :invoice="invoice"></add-remark>
    </div>
</template>

<script>

import Create from "src/components/App/Create";
import {mapActions, mapGetters} from "vuex";
import AddItem from "./AddItem";
import ItemsTable from "../tables/ItemsTable";
import AddNewRecipient from "./AddNewRecipient";
import mixin from "src/global/mixin";
import AddRemark from "components/invoices/dialogs/AddRemark";

export default {
    name: "CreateInvoice",
    mixins: [mixin],
    data() {
        return {
            saved: false,
            submitting: false,
            maximizedToggle: true,
            dialog: false,
            options: this.customers,
            invoice: {
                ime_priimek: '',
                expiration: '',
                work_date: '',
                klavzula: '',
                vat: 0.0,
                customer_id: '',
                remark: '',
                avans_sum: 0,
                avans: false,
                avans_after_invoice: false,
                sifra_predracuna: '',
                related_to_invoice: '',
                final_discount: 0
            },
            recipient: {
                title: '',
                street: '',
                posta: ''
            },
            items: [],
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
    components: {
        AddRemark,
        Create,
        AddItem,
        ItemsTable,
        AddNewRecipient
    },
    computed: {
        ...mapGetters({
            customers: 'customers/getCustomers',
            klavzule: 'klavzule/getKlavzule',
            currentUser: 'auth/user',
        }),
        recipientMenu: function () {
            return Object.entries(this.recipient.title).length === 0 &&
                Object.entries(this.recipient.street).length === 0 &&
                Object.entries(this.recipient.posta).length === 0
        },
        klavzula: {
            get: function () {
                return this.invoice.klavzula
            },
            set: function (newValue) {
                this.invoice.klavzula = newValue.short_name
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
        vat: {
            get: function () {
                return this.invoice.vat
            },
            set: function (newValue) {
                this.invoice.vat = newValue.val
            }
        },
        avans: {
          get: function () {
            return this.invoice.avans_sum
          },
          set: function (newValue) {
            this.invoice.avans_sum = newValue
          }
        }
    },
    created() {
        this.$store.dispatch('klavzule/all')
        this.$store.dispatch('customers/all')
    },
    mounted() {
        if (localStorage.getItem('items')) {
            this.items = JSON.parse(localStorage.getItem('items'))
        }
    },
    filters: {
      longTxt(val) {
        return val.length > 100 ? val.substring(0, 100) + " ..." : val
      }
    },
    methods: {
        ...mapActions({
            addItemDialog: 'general/addItemDialog',
            remove: 'invoices/removeRecipient',
            createInvoice: 'invoices/create'
        }),
        modal(state) {
            this.dialog = state
        },
        removeFromItems(val) {
            this.items = this.items.filter(item => {
                return item !== val
            })
            localStorage.setItem('items', JSON.stringify(this.items));
        },
        addNewRecipient(val) {
          this.recipient.title = val.title
          this.recipient.street = val.street
          this.recipient.posta = val.posta.posta
        },
        today() {
            return this.$moment().format('Y-MM-DD')
        },
        addNewItem(newItem) {
            newItem.id = null
            newItem.item_price = this.invoice.avans ? ( this.invoice.avans_sum - ((this.invoice.avans_sum * this.invoice.vat) /( 100 + this.invoice.vat))) : newItem.item_price
            newItem.total_price = this.invoice.avans ? this.invoice.avans_sum : newItem.total_price
            this.items.push(newItem)
            localStorage.setItem('items', JSON.stringify(this.items));
            this.showNotif(`${this.$t('general.itemAdded')}`, 'positive')
        },
        filterInput(val, update, abort) {
            update(() => {
                const needle = val.toLowerCase()
                this.options = this.customers.filter(
                    v => v.naziv_partnerja.toLowerCase().indexOf(needle) > -1
                )
            })
        },
        mandatoryFields() {
            switch(true) {
                case !this.invoice.ime_priimek:
                    this.showNotif(`${this.$t('general.enterCustomerInvoice')}`,'warning');
                    return true
                case !this.invoice.expiration:
                    this.showNotif(`${this.$t('general.chooseExpDate')}`,'warning');
                    return true
                case !this.invoice.work_date:
                    this.showNotif(`${this.$t('general.chooseWorkDate')}`, 'warning');
                    return true
                case !this.invoice.klavzula:
                    this.showNotif(`${this.$t('general.chooseKlavzula')}`,'warning');
                    return true
                case (!this.invoice.avans && !this.invoice.avans_after_invoice) && this.invoice.avans_sum > 0:
                  this.showNotif(`${this.$t('general.chooseAvansOrAvansAfter')}`,'warning');
                  return true
                default:
                    return false
            }
        },
        save() {
            if (!this.mandatoryFields()) {
                let newInvoice = {
                    invoice: this.invoice,
                    items: this.items,
                    recipient: this.recipient
                }

                this.submitting = true
                localStorage.removeItem('items')
                this.createInvoice(newInvoice)
                    .then((response) => {
                        this.showNotif(response, 'positive')
                        this.saved = true
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
        deleteAll() {
            this.$q.dialog({
                title: `${this.$t("general.deleteTitle")}`,
                message: `<span class='text-red'> ${this.$t("general.deleteALL")}</span>`,
                html: true,
                cancel: true,
                persistent: true
            }).onOk(() => {
                localStorage.removeItem('items')
                this.invoice.ime_priimek = ''
                this.invoice.expiration = ''
                this.invoice.work_date = ''
                this.invoice.klavzula = ''
                this.invoice.vat = 0.0
                this.customer_id = ''
                this.items.length = 0
                this.invoice.remark = ''
                this.invoice.avans_sum = 0
                this.invoice.avans = false
                this.invoice.avans_after_invoice = false
                this.invoice.sifra_predracuna = ''
                this.$refs.createInvoice.hide()
            })
        },
        closeDialog() {
            if (this.saved) {
                this.invoice.ime_priimek = ''
                this.invoice.expiration = ''
                this.invoice.work_date = ''
                this.invoice.klavzula = ''
                this.invoice.vat = 0.0
                this.customer_id = ''
                this.invoice.remark = ''
                this.items.length = 0
                this.invoice.avans_sum = 0
                this.invoice.avans = false
                this.invoice.avans_after_invoice = false
            }
          this.invoice.sifra_predracuna = ''
        },
        addItem() {
            this.addItemDialog(true)
        },
        addPrejemnik() {
            this.$store.dispatch('general/AddNewRecipientDialog', true)
        },
        editPrejemnik() {
            this.$store.dispatch('general/AddNewRecipientDialog', true)
        },
        removePrejemnik() {
            this.$q.dialog({
                title: `${this.$t("general.deleteTitle")}`,
                message: `<span class='text-red'> ${this.$t("general.deleteMessage")}</span>`,
                html: true,
                cancel: true,
                persistent: true
            }).onOk(() => {
                this.recipient = {
                    posta: '',
                    street: '',
                    title: ''
                }
                this.showNotif(`${this.$t('general.recipientRemoved')}`, 'warning')
            })
        },
        avansChanged() {
          if (this.invoice.avans_sum > 0) {
            if (!this.invoice.avans && !this.invoice.avans_after_invoice) {
              this.showNotif(`${this.$t('general.chooseAvansOrAvansAfter')}`, 'warning')
            } else {
              this.showNotif(`${this.$t('general.avansChanged')}`, 'positive')
            }
          }
        },
        expirationWorkDateChanged(type, translation) {
          if (type === 'expiration') {
            this.$refs.qDateExpiration.hide()
          } else {
            this.$refs.qDateWorkDate.hide()
          }
          this.showNotif(translation, 'positive')
        },
        fieldChanged(translation) {
          this.showNotif(translation, 'positive')
        },
        openRemarkDialog() {
          this.$store.dispatch('general/addRemarkDialog', true)
        },
        addRemark(val) {
          this.invoice.remark = val
        },
        editRemark() {
          this.$store.dispatch('general/addRemarkDialog', true)
        },
        deleteRemark() {
          this.invoice.remark = null
          this.showNotif(`${this.$t('general.remarkRemoved')}`, 'negative')
        },
        avansAfterChecked() {
          this.showNotif(this.invoice.avans_after_invoice ? `${this.$t('general.afterInvoiceMarked')}` : `${this.$t('general.afterInvoiceRemoved')}`, this.invoice.avans_after_invoice ? 'positive' : 'warning')

        },
        avansChecked() {
          this.showNotif(this.invoice.avans ? `${this.$t('general.avansOptionMarked')}` : `${this.$t('general.avansOptionRemoved')}`, this.invoice.avans ? 'positive' : 'warning')
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
        }
    },
    watch: {
        recipientMenu: {
            handler() {
                return Object.entries(this.recipient.title).length === 0 &&
                    Object.entries(this.recipient.street).length === 0 &&
                    Object.entries(this.recipient.posta).length === 0
            }
        }
    }
}
</script>

<style scoped>

</style>
