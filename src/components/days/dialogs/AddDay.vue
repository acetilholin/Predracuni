<template>
    <div class="add-day">
        <q-dialog
            v-model="medium"
            persistent
        >
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6">{{ $t("general.newInsert") }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-form
                        @submit="onSubmit"
                        @reset="onReset"
                        class="q-gutter-md"
                    >

                        <div class="row">
                            <q-select v-model="dayTypeOption"
                                      :options="types"
                                      bottom-slots
                                      label="Tip dneva"
                                      option-label="label"
                                      option-value="value"
                                      class="col-6 q-ml-sm"
                                      :rules="[val => !!val || `${$t('hours.dayType')}`]"
                            >
                              <template v-slot:hint>
                              </template>
                            </q-select>
                            <q-input
                                ref="date"
                                v-model="day.date"
                                label="Datum"
                                class="col-5 q-ml-sm"
                                @click="$refs.QDay.show()"
                                :rules="[val => !!val || `${$t('hours.chooseDate')}`]"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy ref="QDay">
                                            <q-date
                                                mask="YYYY-MM-DD"
                                                v-model="day.date"
                                                :options="date => checkWeekend(date)"
                                            />
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="row">
                          <q-input
                            bottom-slots
                            v-if="dayTypeOption === 'DD'"
                            v-model="day.day_start"
                            class="col-4 q-ml-sm"
                            label="Začetek dela"
                            mask="##:##"
                            hint="Format: ##:##"
                            :rules="[
                                      val => formatValid(val) || `${this.$t('general.wrongFormat')}`,
                                      val => validateStartTime(val) || `${this.$t('general.timeStartError')}`
                                    ]"
                          >
                            <template v-slot:prepend>
                              <q-icon name="home_repair_service"/>
                            </template>
                          </q-input>
                          <q-input bottom-slots
                                   v-if="dayTypeOption === 'DD'"
                                   v-model="day.break_start"
                                   class="col-4 q-ml-sm"
                                   label="Začetek malice"
                                   mask="##:##"
                                   hint="Format: ##:##"
                                   :rules="[
                                            val => formatValid(val) || `${this.$t('general.wrongFormat')}`,
                                            val => validateBreakStartTime(val) || `${this.$t('general.lunchStartError')}`
                                          ]"
                          >
                            <template v-slot:prepend>
                              <q-icon name="restaurant"/>
                            </template>
                          </q-input>
                        </div>
                        <div class="row">
                          <q-input bottom-slots
                                   v-if="dayTypeOption === 'DD'"
                                   v-model="day.break_end"
                                   class="col-4 q-ml-sm"
                                   label="Konec malice"
                                   mask="##:##"
                                   hint="Format: ##:##"
                                   :rules="[
                                            val => formatValid(val) || `${this.$t('general.wrongFormat')}`,
                                            val => validateBreakEndTime(val) || `${this.$t('general.lunchEndError')}`
                                          ]"
                          >
                            <template v-slot:prepend>
                              <q-icon name="restaurant"/>
                            </template>
                          </q-input>
                          <q-input
                            bottom-slots
                            v-if="dayTypeOption === 'DD'"
                            v-model="day.day_end"
                            class="col-4 q-ml-sm"
                            label="Konec dela"
                            mask="##:##"
                            hint="Format: ##:##"
                            :rules="[
                                      val => formatValid(val) || `${this.$t('general.wrongFormat')}`,
                                      val => validateEndTime(val) || `${this.$t('general.timeEndError')}`
                                    ]"
                          >
                            <template v-slot:prepend>
                              <q-icon name="home_repair_service"/>
                            </template>
                          </q-input>
                        </div>
                        <div>
                            <q-btn label="Dodaj"
                                   type="submit"
                                   color="green"
                            />
                            <q-btn label="Počisti" type="reset" color="primary" flat class="q-ml-sm" />
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

import {mapGetters, mapActions} from 'vuex'
import { Daytypes } from 'src/global/variables'

export default {
    name: "AddDay",
    data() {
        return {
            day: {
                date: null,
                day_type: null,
                day_start: null,
                day_end: null,
                break_start: null,
                break_end: null
            },
            types: Daytypes,
        }
    },
    computed: {
        ...mapGetters({
            medium: 'general/getAddDay'
        }),
        dayTypeOption: {
            get: function () {
                return this.day.day_type
            },
            set: function (newValue) {
                this.day.day_type = newValue.value
            }
        }
    },
    methods: {
        ...mapActions({
           close: 'general/addDayDialog'
        }),
        formatValid(val) {
          const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
          return timeRegex.test(val)
        },
        validateStartTime(val) {
          if (this.day.day_end) {
            return this.compareTimes(val, this.day.day_end)
          }
          return true
        },
        validateEndTime(val) {
          if (this.day.day_start) {
            return this.compareTimes(this.day.day_start, val)
          }
          return true
        },
        validateBreakStartTime(val) {
          if (this.day.break_end) {
            return this.compareTimes(val, this.day.break_end)
          }
          return true
        },
        validateBreakEndTime(val) {
          if (this.day.break_start) {
            return this.compareTimes(this.day.break_start, val)
          }
          return true
        },
        compareTimes(time1, time2) {
          const [hours1, minutes1] = time1.split(':').map(Number)
          const [hours2, minutes2] = time2.split(':').map(Number)

          if (hours1 < hours2) {
            return true
          } else if (hours1 === hours2) {
            return minutes1 < minutes2
          } else {
            return false
          }
        },
        closeDialog() {
            this.close(false)
            this.day.date = ''
        },
        onReset() {
            this.day.day_type = ''
            this.day.date = ''
            this.day.day_start = ''
            this.day.day_end = ''
            this.day.break_start = ''
            this.day.break_end = ''
        },
        onSubmit() {
            let newDay = {
                date: this.day.date,
                day_type: this.day.day_type,
                day_start: this.day.day_start,
                day_end: this.day.day_end,
                break_start: this.day.break_start,
                break_end: this.day.break_end
            }
            this.$emit('newDay', newDay)
        },
        checkWeekend(date) {
            var dt = new Date(date)
            return dt.getDay() !== 0 && dt.getDay() !== 7
        }
    }
}
</script>

<style scoped>

</style>
