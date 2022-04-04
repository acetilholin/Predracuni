<template>
  <div class="q-pa-md">
    <create-sklad class="q-mt-sm q-mb-md"></create-sklad>
    <filter-sklad class="q-mb-sm"></filter-sklad>
    <q-table
      title="Eko sklad"
      :data="skladData"
      :filter="filter"
      :columns="columns"
      row-key="name"
      :pagination.sync="pagination"
    >
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
          <q-td key="customer" :props="props">
           {{ props.row.customer.naziv_partnerja }}
           {{ props.row.customer.telefon }}
          </q-td>
          <q-td key="invoice" :props="props">
            {{ props.row.invoice_id.sifra_predracuna }}
          </q-td>
          <q-td key="item" :props="props">
            {{ props.row.item }}
          </q-td>
          <q-td key="created" :props="props">
            {{ props.row.created | moment('DD-MM-Y') }}
          </q-td>
          <q-td key="work_date" :props="props">
            {{ props.row.work_date | moment('DD-MM-Y') }}
          </q-td>
          <q-td key="edit" :props="props">
            <q-btn-dropdown color="primary" outline icon="settings">
              <q-list>
                <q-item clickable v-close-popup @click="editSklad(props.row.id)">
                  <q-item-section class="text-center">
                    <q-item-label><q-icon name="create" class="pointer text-black action-icon"></q-icon> {{ $t("general.edit") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="confirm(props.row.id, props.row.customer.naziv_partnerja)">
                  <q-item-section class="text-center text-red">
                    <q-item-label><q-icon name="delete_outline" class="pointer action-icon"></q-icon> {{ $t("general.delete") }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <edit-sklad></edit-sklad>
    <skladi-print></skladi-print>
  </div>
</template>

<script>
import CreateSklad from "components/sklad/CreateSklad";
import {mapActions, mapGetters} from "vuex";
import mixin from "src/global/mixin";
import EditSklad from "components/sklad/dialogs/EditSklad";
import {statuses} from "src/global/variables";
import FilterSklad from "components/sklad/FilterSklad";
import SkladiPrint from "components/sklad/dialogs/SkladiPrint";

export default {
  name: "SkladTable",
  mixins: [mixin],
  data() {
    return {
      filter: '',
      pagination: {
        rowsPerPage: 20
      },
      selected: [],
      columns: [
        {
          name: 'index',
          label: '#',
          align: 'center'
        },
        {
          name: 'customer',
          required: true,
          label: 'Stranka',
          align: 'center',
          field: 'customer',
          format: val => `${val}`,
          sortable: true
        },
        {name: 'invoice', align: 'center', label: 'Račun', field: 'invoice'},
        {name: 'item', label: 'Artikel', field: 'item', align: 'center'},
        {name: 'created', label: 'Datum računa', field: 'created', align: 'center', sortable: true},
        {name: 'work_date', label: 'Datum montaže', field: 'work_date', align: 'center', sortable: true},
        {name: 'edit', label: 'Uredi', align: 'center'}
      ]
    }
  },
  components: {SkladiPrint, FilterSklad, EditSklad, CreateSklad},
  created() {
    this.$store.dispatch('sklad/all')
    this.$store.dispatch('customers/all')
  },
  computed: {
    ...mapGetters({
      skladData: 'sklad/getAll'
    })
  },
  filters: {
      status(val) {
      return statuses[val].trans
    }
  },
  methods: {
    ...mapActions({
      remove: 'sklad/remove'
    }),
    tableIndex(row) {
      return this.skladData.indexOf(row) + 1
    },
    confirm(id, partner) {
      this.$q.dialog({
        title: `${this.$t("general.deleteTitle")} ${partner}`,
        message: `<span class='text-red'> ${this.$t("general.deleteMessage")}</span>`,
        html: true,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.remove(id)
          .then((response) => {
            this.showNotif(response, 'positive')
          })
          .catch((e) => {
            this.showNotif(e, 'negative')
          })
      })
    },
    editSklad(id) {
      this.$store.dispatch('general/editSkladModal', true)
      this.$store.dispatch('sklad/show', id)
    }
  }
}
</script>

<style scoped>

</style>
