<template>
    <div class="create-customer">
        <div class="text-center">
            <create @triggerModal="modal"></create>
        </div>
        <q-dialog
            v-model="medium"
            persistent
        >
            <q-card style="width: 750px; max-width: 85vw;">
                <q-card-section>
                    <div class="text-h6">{{ $t("customers.create") }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-form
                        @submit="createNew"
                        @reset="onReset"
                        class="q-gutter-md"
                    >
                        <div class="row">
                            <q-input
                                v-model="customer.company"
                                label="Podjetje / ime in priimek"
                                class="col-12"
                                autofocus
                                type="text"
                                :rules="[ val => val && val.length > 0 || `${this.$t('general.enterCustomer')}`]"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="business_center" />
                                </template>
                            </q-input>
                        </div>
                        <div class="row">
                            <q-input
                                v-model="customer.street"
                                label="Kraj/ulica"
                                class="col-6 input-margin"
                                type="text"
                                :rules="[ val => val && val.length > 0 || `${this.$t('general.enterCityStreet')}`]"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="add_location" />
                                </template>
                            </q-input>
                            <q-select
                                v-model="customer.post"
                                use-input
                                hide-selected
                                fill-input
                                input-debounce="0"
                                label="Pošta"
                                class="col-4 input-margin"
                                :options="options"
                                @filter="filterInput"
                                option-label="posta"
                                type="text"
                                :rules="[val => !!val || `${this.$t('general.enterPost')}`]"
                                map-options
                            >
                                <template v-slot:prepend>
                                    <q-icon name="mail_outline" />
                                </template>
                            </q-select>
                        </div>
                        <div class="row">
                            <q-input
                                v-model="customer.email"
                                label="Email"
                                class="col-4 input-margin"
                                type="text"
                                :rules="[isValidEmail]"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="alternate_email" />
                                </template>
                            </q-input>
                            <q-input
                                v-model="customer.telephone"
                                label="Telefon"
                                class="col-3 input-margin"
                                mask="###-###-###"
                                hint="Format: 031-123-456"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="phone" />
                                </template>
                            </q-input>
                            <q-input
                                v-model="customer.id_ddv"
                                label="ID za DDV"
                                class="col-3 input-margin"
                                hint=""
                            >
                                <template v-slot:prepend>
                                    <q-icon name="work" />
                                </template>
                            </q-input>
                        </div>
                        <div class="row">
                            <q-input
                                v-model="customer.sklic"
                                label="Sklic št."
                                class="col-4 input-margin"
                                type="text"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="work" />
                                </template>
                            </q-input>
                            <iframe
                              v-if="linkForIframe"
                              width="400"
                              class="q-ml-lg"
                              height="200"
                              :src="linkForIframe"
                              frameborder="0"
                              style="border:0;"
                              allowfullscreen>
                            </iframe>
                        </div>
                        <div>
                            <q-btn label="Ustvari"
                                   :loading="submitting"
                                   type="submit"
                                   color="green"
                            >
                                <template v-slot:loading>
                                    <q-spinner-tail
                                        color="white"
                                    />
                                </template>
                            </q-btn>
                            <q-btn label="Počisti" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                    </q-form>
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn flat label="ZAPRI" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>

    import {mapGetters, mapActions} from 'vuex'
    import Create from "src/components/App/Create";
    import mixin from "src/global/mixin";
    import { placesAPI } from 'src/global/variables'

    export default {
        name: "CreateCustomer",
        mixins: [mixin],
        data() {
          return {
            submitting: false,
            medium: false,
            api: placesAPI,
            customer: {
              company: '',
              street: '',
              post: null,
              telephone: '',
              email: '',
              sklic: '',
              id_ddv: ''
            },
            options: this.posts,
            loadingState: false,
            suggestions: [],
            query: ''
          }
        },
        components: {
            Create
        },
        computed: {
          ...mapGetters({
              posts: 'post/getPosts'
          }),
          linkForIframe() {
            if (this.customer.street && this.customer.post) {
              let encoded = encodeURI(this.customer.street)
              return `https://www.google.com/maps/embed/v1/place?key=${this.api}&q=${encoded},${this.customer.post.posta}`
            } else {
              return null
            }
          }
        },
        created() {
            this.$store.dispatch('post/all')
        },
        methods: {
            ...mapActions({
               createCustomer: 'customers/create'
            }),
            modal(param) {
                this.medium = param
            },
            filterInput (val, update, abort) {
                update(() => {
                    const needle = val.toLowerCase()
                    this.options = this.posts.filter(
                        v => v.posta.toLowerCase().indexOf(needle) > -1
                    )
                })
            },
            onReset() {
                this.customer = {}
            },
            createNew() {
                this.submitting = true
                this.createCustomer(this.customer)
                    .then((response) => {
                        this.showNotif(response, 'positive')
                          setTimeout(() => {
                              this.submitting = false
                          }, 500)
                    })
                    .catch((e) => {
                        this.showNotif(e, 'negative')
                        this.submitting = false
                    })
            }
        }
    }
</script>

<style scoped>

</style>
