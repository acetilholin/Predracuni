<template>
  <div class="q-pa-md">
    <create-sklad class="q-mt-sm q-mb-md"></create-sklad>
    <q-table
      title="Eko sklad"
      :data="skladData"
      :columns="columns"
      row-key="name"
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
            {{ props.row.customer.naziv_partnerja }} -
            {{ props.row.customer.telefon }}
          </q-td>
          <q-td key="invoice" :props="props">
            {{ props.row.invoice_id.sifra_predracuna }}
          </q-td>
          <q-td key="item" :props="props">
            {{ props.row.item }}
          </q-td>
          <q-td key="status" :props="props">
            <q-badge :color="statusColor(props.row.status)"
                     class="cursor-pointer"
                     @click="changeStatus(props.row.id, props.row.status)"
            >
              {{ props.row.status | status }}
              <q-tooltip>
                kliknite za spremembo statusa
              </q-tooltip>
            </q-badge>
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
                <q-item clickable v-close-popup @click="confirm(props.row.id)">
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
  </div>
</template>

<script>
import CreateSklad from "components/sklad/CreateSklad";
import {mapActions, mapGetters} from "vuex";
import mixin from "src/global/mixin";
import {i18n} from "boot/i18n";
import EditSklad from "components/sklad/dialogs/EditSklad";
import {statuses} from "src/global/variables";

export default {
  name: "SkladTable",
  mixins: [mixin],
  data() {
    return {
      filter: '',
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
        {name: 'invoice', align: 'center', label: 'Predračun', field: 'invoice'},
        {name: 'item', label: 'Artikel', field: 'item', align: 'center'},
        {name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true},
        {name: 'created', label: 'Datum', field: 'created', align: 'center', sortable: true},
        {name: 'work_date', label: 'Datum montaže', field: 'work_date', align: 'center', sortable: true},
        {name: 'edit', label: 'Uredi', align: 'center'}
      ]
    }
  },
  components: {EditSklad, CreateSklad},
  created() {
    this.$store.dispatch('sklad/all')
    this.$store.dispatch('customers/all')
    this.$store.dispatch('final/all')
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
      remove: 'sklad/remove',
      change: 'sklad/changeStatus'
    }),
    tableIndex(row) {
      return this.skladData.indexOf(row) + 1
    },
    statusColor(num) {
      return statuses[num].color
    },
    confirm(id) {
      this.remove(id)
        .then((response) => {
          this.showNotif(response, 'positive')
        })
        .catch((e) => {
          this.showNotif(e, 'negative')
        })
    },
    changeStatus(id,status) {
      let payload = {'id': id, 'status': status + 1}
      this.change(payload)
        .then((response) => {
          this.showNotif(response, 'positive')
        })
        .catch((e) => {
          this.showNotif(e, 'negative')
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
