<template>
  <div class="sklad">
    <sklad-table></sklad-table>
  </div>
</template>

<script>

import SkladTable from "components/sklad/SkladTable";

export default {
  name: "Sklad",
  components: {
    SkladTable
  },
  mounted() {
    this.$store.dispatch('customers/all')
    this.$store.dispatch('final/all')
  }
}
</script>

<style scoped>

</style>
