<template>
    <div class="print-invoice">
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
                    <div class="text-h6">{{ $t("invoices.racun") }} <span class="text-red">{{ invoice.sifra_predracuna }}</span></div>
                </q-card-section>

                <q-card-section class="q-pt-none font-size-body" id="content">
                    <div class="container c-mt">
                        <div class="row" v-for="cmp in company">
                            <div class="column left">
                               <div> {{ cmp.naziv | titleLong }} <span v-if="!workDateRealm()">{{ cmp.naziv | titleShort }}</span></div>
                               <div v-if="workDateRealm()">{{ cmp.naziv | titleShort }}</div>
                                {{ cmp.naslov }}<br>
                                {{ cmp.posta }}
                            </div>
                            <div class="column middle">

                              <img :src="image(cmp.logo)" class="logo-size" alt="">

                            </div>
                            <div class="column right text-right">
                              <div v-if="cmp.telefon1">{{ cmp.telefon1 }}</div>
                              <div v-if="cmp.telefon2">{{ cmp.telefon2 }}</div>
                              <div v-if="cmp.email1">{{ cmp.email1 }}</div>
                              <div v-if="cmp.email2">{{ cmp.email2 }}</div>
                            </div>
                        </div>
                        <hr style="background: black">
                        <div class="row">
                            <div class="column left"></div>
                            <div class="column middle"></div>
                            <div class="column right">
                                <table v-for="cmp in company">
                                  <tr>
                                    <td>
                                      {{ $t("invoices.iban") }}: {{ $t("invoices.swift") }} {{ cmp.banka1 }}
                                      <span v-if="cmp.banka2">&nbsp;&nbsp;/&nbsp;&nbsp;{{ $t("invoices.swift") }} {{ cmp.banka2 }}</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>TRR: {{ cmp.trr1 }}&nbsp;&nbsp;<span v-if="cmp.trr2">/&nbsp;&nbsp;</span> {{ cmp.trr2 }}</td>
                                  </tr>
                                    <tr>
                                        <td>{{ $t("invoices.sklicevanje_stev") }}: 00{{ company.sklic_st !== " " ? company.sklic_st : '' }}-{{ invoice.sifra_predracuna | sifra }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="float-right mt-2">
                            <b>{{ invoice.avans ? $t("invoices.avans").toUpperCase() : $t("invoices.final").toUpperCase() }}: </b>{{ invoice.sifra_predracuna }}<br>
                            {{ placeByRealm() }}, {{ invoice.timestamp | moment('DD-MM-Y') }}<br>
                            <b>{{ $t("invoices.validity") }}:</b> {{ invoice.expiration | moment('DD-MM-Y') }}<br>

                            <span v-if="workDateRealm()">
                                 <b>{{ $t("invoices.work_done") }}:</b> {{ invoice.work_date | moment('DD-MM-Y') }}<br>
                            </span>

                            {{ $t("invoices.id_ddv") }}: <span v-for="cmp in company">{{ cmp.zavezanec_za_ddv }}</span><br>

                            <span v-if="customer.id_ddv">{{ $t("invoices.id_ddv_customer") }}: {{ customer.id_ddv }}<br><br></span>
                        </div>

                        <div class="float-left mt-4 recipient">
                            <b>{{ customer.naziv_partnerja | uppercase }}</b><br>
                            <b>{{ customer.kraj_ulica | uppercase}}</b><br>
                            <b>{{ customer.posta | uppercase}}</b><br>
                        </div>
                        <div class="pb-5" v-if="recipient"></div>
                        <div id="mainContent" style="margin-top: 170px">
                            <div class="float-left mb-1 mt-3">
                                <span v-if="recipient">
                                     <b>{{ $t("invoices.recipient") }}</b>:<br>
                                    {{ recipient.title }}<br>
                                    {{ recipient.street }}<br>
                                    {{ recipient.posta }}<br>
                                </span>
                            </div>
                            <table class="table full-width table-font">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col" class="format-text">{{ $t("invoices.description") }}</th>
                                    <th scope="col" class="format-text" v-if="!invoice.avans">{{ $t("invoices.em") }}</th>
                                    <th scope="col" class="format-text" v-if="!invoice.avans">{{ $t("invoices.qty") }}</th>
                                    <th scope="col" class="format-text">{{ invoice.avans ? $t("invoices.osnova") : $t("invoices.price") }}</th>
                                    <th scope="col" class="format-text" v-if="!invoice.avans">{{ $t("invoices.discount") }}</th>
                                    <th scope="col" class="format-text" v-if="!invoice.avans">{{ $t("invoices.ddv") }}</th>
                                    <th scope="col" class="format-text" v-if="!invoice.avans">{{ $t("invoices.vrednost") }}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item, index) in items">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td><span v-html="item.description"></span></td>
                                    <td v-if="!invoice.avans">{{ item.unit }}</td>
                                    <td v-if="!invoice.avans">{{ item.qty }}</td>
                                    <td>{{ item.item_price | reformat }}</td>
                                    <td v-if="!invoice.avans">{{ item.discount }}</td>
                                    <td v-if="!invoice.avans">{{ vat() | reformatVAT }}</td>
                                    <td v-if="!invoice.avans">{{ item.total_price | reformat }}</td>
                                </tr>
                                </tbody>
                            </table>
                            <hr style="background: black;" class="margin-line">
                            <div class="float-right">
                                {{ $t("invoices.skupaj") }}: {{ subTotal() | reformat | eur }}
                            </div>
                            <br>
                            <div class="float-right">
                                {{ $t("invoices.ddv") }}: {{ invoice.vat | reformatVAT | procent }}   {{ $t("invoices.osnova") }}  {{ subTotal() | reformat }} : &nbsp;&nbsp;&nbsp;&nbsp;
                                <span v-if="invoice.klavzula === '76A'">
                                    {{ $t("invoices.zeroEUR") }}
                                </span>
                                <span v-else>
                                    {{ vatDifference() | reformat | eur }}
                                </span>
                            </div>
                            <br>
                            <br>
                            <div class="float-right">
                                <b>{{ $t("invoices.forPayment") }}</b>:
                                <span v-if="invoice.klavzula === '76A'">
                                {{ subTotal() | reformat }}
                                </span>
                                <span v-else>
                                    {{ invoiceTotal() | reformat | eur }}
                                </span>
                            </div>
                            <br>
                            <br>
                            <div class="float-right" v-if="invoice.avans_after_invoice">
                              <span>
                                {{ $t("invoices.forPaymentAvans") }}
                                <span v-if="invoice.related_to_invoice">{{ invoice.related_to_invoice }}</span>
                                <span v-else>{{ invoice.sifra_predracuna }}</span>
                                {{ $t("invoices.isPaid") }} {{ invoice.avans_sum | reformat | eur }}</span>
                              <br>
                              <span>{{ $t("invoices.leftForPayment") }} {{ (invoice.total - invoice.avans_sum) | reformat | eur }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="container" style="margin-top: 70px; margin-bottom: 5px">
                      <span v-if="invoice.avans_after_invoice">{{ $t("invoices.specAvans") }}:</span>
                      <table class="avans mb-5" v-if="invoice.avans_after_invoice">
                        <tr>
                          <td>{{ $t("invoices.ddv") }}</td>
                          <td>{{ $t("invoices.osnova") }}</td>
                          <td>{{ $t("invoices.znesekDDV") }}</td>
                          <td>{{ $t("invoices.skupaj") }}</td>
                        </tr>
                        <tr>
                          <td>{{ invoice.vat | procent }}</td>
                          <td>{{ avans.osnova | reformat }}</td>
                          <td>{{ avans.znesekDDV | reformat }}</td>
                          <td>{{ avans.skupaj | reformat }}</td>
                        </tr>
                      </table>
                        <p v-if="invoice.remark" class="klavzula-text">
                          <b>{{ $t("invoices.remark") }}</b>: {{ invoice.remark }}
                        </p>
                        <p style="margin-bottom: 3%;" v-if="klavzula" class="klavzula-text" v-html="klavzula.description"></p>
                        <div class="mt-2 mb-5" v-if="invoice.klavzula === '76A'">
                            <table class="clen">
                                <tr>
                                    <td></td>
                                    <td>{{ $t("invoices.osnova").toUpperCase() }}</td>
                                    <td>{{ $t("invoices.ddv") }}</td>
                                </tr>
                                <tr>
                                    <td>{{ $t("invoices.total76A") }}</td>
                                    <td>{{ subTotal() | reformat }}</td>
                                    <td>{{ vatDifference76() | reformat }}</td>
                                </tr>
                            </table>
                        </div>
                      <div class="d-flex flex justify-between justify-content-between" style="margin-top: 2%">
                        <div id="name" style="margin-top: 3%">
                          {{ authorByRealm() }}<br>
                        </div>
                        <div>
                          <img :src="banner" style="height: 95px;  margin-top: 7%" alt="" v-if="bannerVisible()">
                        </div>
                        <div></div>
                      </div>
                    </div>
                </q-card-section>
                <q-page-container>
                    <q-page-sticky position="bottom-right" :offset="[25, 100]">
                        <q-btn fab icon="print" color="green" @click="print"/>
                    </q-page-sticky>
                </q-page-container>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import {author1,author2, picturesPath, place1, place2, banner} from "src/global/variables";
import mixin from "src/global/mixin";

export default {
    name: "PrintFinalInvoice",
    mixins: [mixin],
    data() {
        return {
            maximizedToggle: true,
            output: null,
            author1: author1,
            author2: author2,
            place1: place1,
            place2: place2,
            banner: banner,
            avans: {
              osnova: 0,
              znesekDDV: 0,
              skupaj: 0
            }
        }
    },
    computed: {
        ...mapGetters({
            dialog: 'general/getPrintFinal',
            invoice: 'final/getFinalInvoice',
            company: 'company/getCompany',
            items: 'final/getItems',
            customer: 'final/getCustomer',
            recipient: 'final/getRecipient',
            klavzula: 'final/getKlavzula',
            realm: 'general/getRealm'
        })
    },
    created() {
        this.$store.dispatch('general/settings')
        this.$store.dispatch('company/all')
    },
    filters: {
        reformat(val) {
          if (val && val !== 0) { //!isNaN(val)
            return val.toLocaleString('de-DE', { minimumFractionDigits: 2 })
          } else if (val === 0 ) {
            return 0
          }
        },
        reformatVAT(val) {
          if (!isNaN(val)) {
            return val === 9.5 ? val.toLocaleString('de-DE', { minimumFractionDigits: 1 }) : val
          }
        },
        titleShort(val) {
            return val.substring(31,51)
        },
        titleLong(val) {
            return val.substring(0,30)
        },
        sifra(val) {
            if (val) {
                return val.replace(/\//g, '')
            }
        },
        uppercase(val) {
            if (val) {
                return val.toUpperCase()
            }
        },
        eur(val) {
            return val + ' EUR'
        },
        procent(val) {
            return val + '%'
        }
    },
    methods: {
        ...mapActions({
            closeEditDialog: 'general/printFinalInvoiceDialog',
        }),
        closeDialog() {
            this.closeEditDialog(false)
        },
        print() {
            this.$htmlToPaper('content');
        },
        image(img) {
            return picturesPath + img
        },
        subTotal() {
          let total = 0
          let totalAvans = 0
          this.items.forEach(item => {
            return total += item.total_price
          })
          this.items.forEach(item => {
            return totalAvans += item.item_price
          })

          return this.invoice.avans && this.invoice.klavzula !=='76A' ? totalAvans : total
        },
        invoiceTotal() {
          return this.invoice.avans ?
            this.subTotal() + (this.invoice.vat * 0.01 * this.subTotal()) :
            this.invoice.total
        },
        vatDifference() {
            let total = 0
            let diff = 0
            total = this.subTotal()
            diff = this.invoice.vat * 0.01 * total
            return diff.toFixed(2)
        },
        vatDifference76() {
           let avansVatDiff76 = ((this.invoice.avans_sum) * this.invoice.vat) / (100 + this.invoice.vat)
            return this.invoice.avans ? avansVatDiff76 : this.subTotal() * (0.01 * 22)
        },
        vat() {
            return this.invoice.vat
        },
        invoicePath() {
            return this.$router.currentRoute.fullPath === '/'
        },
        placeByRealm() {
          return this.getRealmValueData() ? place2 : place1
        },
        bannerVisible() {
          return !this.getRealmValueData()
        },
        authorByRealm() {
          return this.getRealmValueData() ? author2 : author1
        },
        workDateRealm() {
          return this.invoice.work_date && !this.getRealmValueData()
        },
        calculateAvans() {
          let res = ((this.invoice.total - this.invoice.avans_sum) * this.invoice.vat) / (100 + this.invoice.vat)
          this.avans.znesekDDV = res
          this.avans.osnova = (this.invoice.total - this.invoice.avans_sum) - res
          this.avans.skupaj = this.invoice.total - this.invoice.avans_sum
        }
    },
  mounted() {
    this.workDateRealm()
  },
  watch: {
   invoice: {
      handler() {
       this.calculateAvans()
      }
    }
  }
}
</script>

<style scoped>
.column {
    float: left;
}
.left {
    width: 45%;
}
.middle {
    width: 20%;
}
.right {
    width: 35%;
}
.text-right {
    text-align: right
}
.c-mt {
    margin-top: 10px
}
.column img {
    vertical-align: middle
}
.margin-line {
    margin-bottom: 2rem;
}
.font-size-body {
    font-size: 19px
}
.table-font {
    font-size: 14px;
}
.klavzula-text {
    font-size: 14px;
}
.recipient {
    font-size: 23px !important;
    margin-left: 3rem;
}
.clen {
    width: 80%;
}
.avans {
  width: 55%;
}
.format-text {
    text-align: left;
}
.logo-size {
  height: 85px;
  width: 165px;
}
</style>
