<template>
    <div class="q-pa-md" v-if="invoiceItems">
        <q-table
            :data="invoiceItems"
            :columns="columns"
            row-key="index"
            binary-state-sort
            no-data-label="Na predračunu ni artiklov"
            :filter="filter"
            :pagination.sync="pagination"
        >
             <template v-slot:top-left>
               <span class="q-ml-xl text-subtitle1">
                   Vseh artiklov: <q-badge color="blue-7">{{ itemsNum() | zero }}</q-badge>
               </span>
               <span class="q-ml-md text-subtitle1">
                   Skupna cena:
                 <q-badge color="blue-14">{{ totalPrice()  | price }} </q-badge>
               </span>
                 <span class="q-ml-md text-subtitle1">
                   DDV: <q-badge color="blue-10">{{ invoice.vat | discount }} </q-badge>
               </span>
           </template>
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
                    <q-td key="description" :props="props" style="cursor: pointer">
                        <span v-html="props.row.description"/>
                        <q-popup-edit v-model="props.row.description"
                                      title="Spremeni opis"
                                      buttons
                                      label-set="Spremeni"
                                      label-cancel="Prekliči"
                                      @hide="descriptionIsInserted"
                                      v-slot="scope"
                        >
                            <q-input type="textarea"
                                     v-model="props.row.description"
                                     dense
                                     autofocus
                                     :rules="[ val => val && val.length > 0  || `${$t('general.enterDescription')}`]"
                            />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="qty" :props="props" style="cursor: pointer">
                      <span v-if="props.row.unit !== 'avans'">{{ props.row.qty }}</span>
                        <q-popup-edit v-model="props.row.qty"
                                      title="Spremeni količino"
                                      v-if="props.row.unit !== 'avans'"
                                      buttons
                                      label-set="Spremeni"
                                      @save="changeItemData(`${$t('general.QTYChanged')}`,props.row)"

                        >
                            <q-input type="number"
                                     v-model="props.row.qty"
                                     dense
                                     autofocus
                                     :rules="[ val => val && val > 0  || `${$t('general.biggerThan0')}`]"
                            />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="unit" :props="props" style="cursor: pointer">
                      <span v-if="props.row.unit !== 'avans'">{{ props.row.unit }}</span>
                        <q-popup-edit v-model="props.row.unit"
                                      title="Spremeni EM"
                                      v-if="props.row.unit !== 'avans'"
                                      buttons
                                      label-set="Spremeni"
                                      @save="changeItemData(`${$t('general.EMChanged')}`,props.row)"
                        >
                        <q-select v-model="props.row.unit"
                                  :options="units"
                                  label="Enota mere"
                                  dense
                                  autofocus
                        />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="item_price" :props="props" style="cursor: pointer">
                      <span>{{ props.row.item_price | price }}</span>
                        <q-popup-edit v-model="props.row.item_price"
                                      title="Spremeni ceno/kos"
                                      v-if="props.row.unit !== 'avans'"
                                      buttons
                                      label-set="Spremeni"
                                      @save="changeItemData(`${$t('general.pricePerItemChanged')}`,props.row)"
                        >
                            <q-input type="number"
                                     v-model="props.row.item_price"
                                     dense
                                     autofocus
                                     :rules="[ val => val && val >= 0  || `${$t('general.biggerThan0')}`]"
                            />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="total_price" :props="props">
                      <span>{{ props.row.total_price | price }}</span>
                    </q-td>
                    <q-td key="discount" :props="props" style="cursor: pointer">
                      <span v-if="props.row.unit !== 'avans'">{{ props.row.discount | discount }}</span>
                        <q-popup-edit v-model="props.row.discount"
                                      title="Spremeni popust"
                                      v-if="props.row.unit !== 'avans'"
                                      buttons
                                      label-set="Spremeni"
                                      @save="changeItemData(`${$t('general.discountChanged')}`,props.row)"
                        >
                            <q-input type="number"
                                     v-model="props.row.discount"
                                     dense
                                     autofocus
                                     :rules="[ val => val && val >= 0 && val < 100  || `${$t('general.lessThan100prc')}`]"
                            />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="vat" :props="props">
                      <span>{{ invoice.vat | discount }}</span>
                    </q-td>
                    <q-td key="edit" :props="props">
                        <q-icon name="delete_outline" @click="confirm(props.row)" class="pointer text-red action-icon"></q-icon>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </div>
</template>

<script>

import mixin from "src/global/mixin";

 export default {
        name: "ItemsTable",
        mixins: [mixin],
        props: ['invoice', 'items'],
        data() {
            return {
                invoiceItems: null,
                totalItems: 0,
                filter: '',
                pagination: {
                    rowsPerPage: 20
                },
                units: ['kos','m','ura','kg','m2'],
                columns: [
                    {
                        name: 'index',
                        label: '#',
                        align: 'center',
                        sortable: true
                    },
                    {
                        name: 'description',
                        required: true,
                        label: 'Opis',
                        align: 'center',
                        field: row => row.description,
                    },
                    {
                        name: 'qty',
                        required: true,
                        label: 'Količina',
                        align: 'center',
                        field: row => row.qty,
                    },
                    {
                        name: 'unit',
                        required: true,
                        label: 'EM',
                        align: 'center',
                        field: row => row.unit,
                    },
                    {
                        name: 'item_price',
                        required: true,
                        label: 'Cena/kos',
                        align: 'center',
                        sortable: true,
                        field: row => row.item_price,
                    },
                    {
                        name: 'total_price',
                        required: true,
                        label: 'Cena',
                        align: 'center',
                        sortable: true,
                        field: row => row.total_price,
                    },
                    {
                        name: 'discount',
                        required: true,
                        label: 'Popust',
                        align: 'center',
                        sortable: true,
                        field: row => row.discount,
                    },
                    {
                        name: 'vat',
                        required: true,
                        label: 'DDV',
                        align: 'center'
                    },
                    {name: 'edit', label: 'Uredi', align: 'center'}
                ]
            }
        },
        filters: {
            price(val) {
                return Math.round(val * 100) / 100 + ' €'
            },
            discount(val) {
                return val + ' %'
            },
            zero(val) {
                return +val
            }
        },
        methods: {
            tableIndex(row) {
                return this.invoiceItems.indexOf(row) + 1
            },
            changeItemData(message, row) {
                let discount = parseInt(row.discount)
                let price = parseFloat(row.item_price)
                let quantity = parseFloat(row.qty)

                row.total_price = discount > 0 ? price * quantity - (price * quantity * discount / 100) : price * quantity
                this.showNotif(message, 'positive')
            },
            changeDesc(message) {
                this.showNotif(message, 'positive')
            },
            descriptionIsInserted(val) {
              this.changeDesc(` ${this.$t("general.descriptionChanged")}`)
            },
            itemsNum() {
                let total = 0
                this.invoiceItems.forEach( function(item) {
                    total += parseFloat(item.qty);
                });

                this.invoice.quantity = total
                return total
            },
            totalPrice() {
                let total = 0
                this.invoiceItems.forEach(function(item) {
                    total += parseFloat(item.total_price)
                })

              this.invoice.total = total > 0 ? this.invoice.avans ? 0 : ((total * this.invoice.vat / 100) + total) - this.invoice.final_discount : 0

               return this.invoice.total
            },
          confirm(row) {
            this.$q.dialog({
                title: `${this.$t("general.deleteTitle")}`,
                message: `<span class='text-red'> ${this.$t("general.deleteMessage")}</span>`,
                html: true,
                cancel: true,
                persistent: true
            }).onOk(() => {
                let id = row.id
                this.$emit('removeItem', row)

                if (id !== null) {
                    this.$store.dispatch('invoices/removeItem', id)
                }

                this.showNotif(`${this.$t('general.itemRemoved')}`, 'warning')
            })
          }
        },
        mounted() {
            this.invoiceItems = this.items
        },
        watch: {
            items: {
                handler() {
                    this.invoiceItems = this.items
                }
            },
          'invoice.vat': {
            handler() {
              this.invoiceItems.forEach((item) => {
                if (item.unit === 'avans') {
                  item.item_price = (this.invoice.avans_sum - ((this.invoice.avans_sum * this.invoice.vat) / (100 + this.invoice.vat)))
                }
              })
            }
          }
        }
    }
</script>

<style scoped>

</style>
