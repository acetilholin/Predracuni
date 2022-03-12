<template>
  <div class="print-skladi">
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
          <div class="text-h6">{{ $t("sklad.printSkladi") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none font-size-body" id="content">
          <div class="container c-mt">
            <div class="row" v-for="cmp in company">
              <div class="column left">
                {{ cmp.naziv | titleLong }}<br>
                {{ cmp.naziv | titleShort }}<br>
                {{ cmp.naslov }}<br>
                {{ cmp.posta }}
              </div>
              <div class="column middle">

                <img :src="image(cmp.logo)" style="height: 95px; width: 170px;" alt="">

              </div>
              <div class="column right text-right">
                {{ cmp.telefon1 }}<br>
                {{ cmp.telefon2 }}<br>
                {{ cmp.email1 }}<br>
                {{ cmp.email2 }}
              </div>
            </div>
            <hr style="background: black">
            <span v-if="skladi.length > 0">
            <div class="text-center">{{ $t("sklad.printSkladiTitle") }} {{ dates.from | moment('DD-MM-Y') }} / {{ dates.to | moment('DD-MM-Y') }}</div>
            <div class="row">
              <div class="column left"></div>
              <div class="column middle"></div>
            </div>
                <table class="table text-center full-width mt-3 mb-5 table-report" style="font-size: 12.5px">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Stranka</th>
                <th scope="col">Račun</th>
                <th scope="col">Artikel</th>
                <th scope="col">Datum računa</th>
                <th scope="col">Datum montaže</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(sklad, index) in skladi">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ sklad.customer.naziv_partnerja }} {{ sklad.customer.telefon }}</td>
                <td>{{ sklad.invoice_id.sifra_predracuna }}</td>
                <td>{{ sklad.item }}</td>
                <td>{{ sklad.created | moment('DD-MM-Y') }}</td>
                <td>{{ sklad.work_date | moment('DD-MM-Y')}}</td>
              </tr>
              </tbody>
            </table>
            </span>
            <span v-else>
              <div class="text-center q-mt-xl">
                {{ $t("sklad.noData") }}
              </div>
            </span>
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
import {mapGetters} from "vuex";
import {picturesPath} from "src/global/variables";

export default {
  name: "SkladiPrint",
  computed: {
    ...mapGetters({
      dialog: 'general/getSkladPrint',
      skladi: 'sklad/getSkladiForPrinting',
      company: 'company/getCompany',
      dates: 'sklad/getPrintDates'
    })
  },
  created() {
    this.$store.dispatch('company/all')
  },
  data() {
    return {
      maximizedToggle: true
    }
  },
  filters: {
    titleShort(val) {
      return val.substring(31,51)
    },
    titleLong(val) {
      return val.substring(0,30)
    }
  },
  methods: {
    closeDialog() {
      this.$store.dispatch('general/printSkladi', false)
    },
    image(img) {
      return picturesPath + img
    },
    print() {
      this.$htmlToPaper('content');
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
.format-text {
  text-align: left;
}
</style>
