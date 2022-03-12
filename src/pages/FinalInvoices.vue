<template>
  <div class="final-invoices">
    <final-list></final-list>
  </div>
</template>

<script>

import FinalList from "../components/finalInvoices/tables/FinalList";

export default {
  name: "FinalInvoices",
  components: {
    FinalList
  },
  created() {
    if (!localStorage.getItem('year-final')) {
      localStorage.setItem('year-final', JSON.stringify(this.$moment().format('Y')));
    }
  }
}
</script>

<style scoped>

</style>
