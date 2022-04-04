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
  name: "RemarkEdit",
  props: ['invoice'],
  mixins: [mixin],
  computed: {
    ...mapGetters({
      dialog: 'general/getRemarkEditDialog'
    })
  },
  data() {
    return {
      submitting: false
    }
  },
  methods: {
    ...mapActions({
      close: 'general/addRemarkEditDialog'
    }),
    closeDialog() {
      this.close(false)
    },
    onSubmit() {
      this.submitting = true
      this.$emit('remark', this.invoice.remark);
      setTimeout(() => {
        this.submitting = false
      }, 500)
      if (this.invoice.remark.length > 0) {
        this.showNotif(`${this.$t('general.remarkEdited')}`, 'positive')
      }
    },
    onReset() {
      this.invoice.remark = ''
    }
  }
}
</script>

<style scoped>

</style>
