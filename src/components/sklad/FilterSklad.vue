<template>
  <div class="row q-mb-lg justify-center">
    <q-input
        ref="date"
        v-model="fromDate"
        label="Od"
        bottom-slots
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
      <template v-slot:hint>
        Izberite datum računa
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
     <div class="q-pt-md">
       <q-btn color="primary" outline label="Reset" @click="getAll" class="q-ml-xs q-mr-xs">
         <q-tooltip>
           Ponastavi filter za izpis vseh
         </q-tooltip>
       </q-btn>
       <q-btn outline color="green" @click="filterSklads" :disable="checkDates()" icon="list">
         <q-tooltip>Prikaži in natisni seznam upravičencev</q-tooltip>
       </q-btn>
     </div>
  </div>
</template>

<script>

import mixin from "src/global/mixin";

export default {
  name: "FilterSklad",
  mixins: [mixin],
  data() {
      return {
        fromDate: '',
        toDate: '',
        canPrint: false
      }
  },
  methods: {
    filterSklads() {
     if (this.canPrint) {
       this.$store.dispatch('general/printSkladi', true)
     }
    },
    getAll() {
      this.$store.dispatch('sklad/all')
      this.fromDate = ''
      this.toDate = ''
    },
    dateChanged() {
      if (this.fromDate && this.toDate) {
        if (this.fromDate > this.toDate) {
          this.showNotif(`${this.$t('general.dateFromTo')}`,'warning');
        } else {
          this.$store.dispatch('sklad/filter', {
            from: this.fromDate,
            to: this.toDate
          })
          this.canPrint = true
        }
      }
    },
    checkDates() {
      return this.fromDate === '' || this.toDate === ''
    }
  }
}
</script>

<style scoped>

</style>
