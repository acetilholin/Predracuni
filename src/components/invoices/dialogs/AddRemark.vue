<template>
  <div>
    <q-dialog
      persistent
      v-model="dialog"
      ref="addRemarkModal"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">{{ $t("general.remark") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input v-model="invoice.remark"
                     autogrow
                     label="Opomba"
                     :rules="[ val => val && val.length > 0  || `${$t('general.enterRemark')}`]"
            />
            <div>
              <q-btn label="Shrani"
                     type="submit"
                     :loading="submitting"
                     color="green"
              >
                <template v-slot:loading>
                  <q-spinner-tail
                    color="white"
                  />
                </template>
              </q-btn>
              <q-btn label="Počisti"
                     type="reset"
                     color="primary"
                     flat
                     class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="ZAPRI" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import mixin from "src/global/mixin";

export default {
  name: "AddRemark",
  mixins: [mixin],
  props: ['invoice'],
  data() {
    return {
      remark: '',
      submitting: false
    }
  },
  computed: {
    ...mapGetters({
      dialog: 'general/getRemarkDialog'
    })
  },
  methods: {
    ...mapActions({
      close: 'general/addRemarkDialog'
    }),
    closeDialog() {
      this.close(false)
    },
    onSubmit() {
      this.submitting = true
      this.$emit('remark', this.remark);
      setTimeout(() => {
        this.submitting = false
      }, 500)
      this.showNotif(`${this.$t('general.remarkEdited')}`, 'positive')
    },
    onReset() {
      this.invoice.remark = ''
    }
  }
}
</script>

<style scoped>

</style>
