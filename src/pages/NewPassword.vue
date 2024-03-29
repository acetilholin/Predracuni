<template>
  <div>
    <Particles
      id="tsparticles"
      :options="particlesOptions"
    />
    <div class="q-pa-md absolute-center">

      <div class="q-gutter-y-md column" style="width: 400px">
        <span class="text-center text-subtitle1 text-primary text-uppercase">{{ title }}</span>
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="email" label="Email"></q-tab>
            <q-tab name="new-password" label="Novo geslo"></q-tab>
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="email">
              <div class="text-h6">Email za novo geslo</div>
              <q-form
                @submit="sendEmail"
                @reset="clearSendEmail"
                class="q-col-gutter-lg"
              >
                <q-input
                  v-model="email"
                  label="Email"
                  autofocus
                  type="email"
                  :rules="[ val => val && val.length > 0 || `${this.$t('general.enterEmail')}`, isValidEmail]"
                >
                  <template v-slot:prepend>
                    <q-icon name="alternate_email" />
                  </template>
                </q-input>
                <div>
                  <q-btn label="Pošlji" type="submit" color="green"/>
                  <q-btn label="Počisti" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
              </q-form>
              <div class="text-center q-mt-lg">
                <q-btn to="/login-register" icon="login" outline color="primary" label="Prijava" />
              </div>
            </q-tab-panel>

            <q-tab-panel name="new-password">
              <div class="text-h6">Novo geslo</div>
              <q-form
                @submit="newPassword"
                @reset="clearNewPassword"
                class="q-col-gutter-lg"
              >
                <q-input
                  v-model="newPass.email"
                  label="Email"
                  type="email"
                  autofocus
                  :rules="[ val => val && val.length > 0 || `${this.$t('general.enterEmail')}`, isValidEmail]"
                >
                  <template v-slot:prepend>
                    <q-icon name="alternate_email" />
                  </template>
                </q-input>

                <q-input
                  v-model="newPass.token"
                  label="Žeton"
                  type="text"
                  :rules="[
                                 val => val && val.length > 0 || `${this.$t('general.enterToken')}`,
                                 val => val && val.length === 20 || `${this.$t('general.tokenLen20')}` ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="vpn_key"/>
                  </template>
                </q-input>

                <q-input
                  v-model="newPass.password"
                  label="Geslo"
                  :type="isPwd2 ? 'password' : 'text'"
                  :rules="[ val => val && val.length > 5 || `${this.$t('general.min6')}`]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd2 ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd2 = !isPwd2"
                    />
                  </template>
                </q-input>

                <q-input
                  v-model="newPass.password_confirmation"
                  label="Ponovite geslo"
                  type="password"
                  :rules="[
                                    val => val && val.length > 0 || `${this.$t('general.repeatPassword')}`,
                                    val => val === this.newPass.password || `${this.$t('general.passMissmatch')}`]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
                <div>
                  <q-btn label="Spremeni" type="submit" color="green"/>
                  <q-btn label="Počisti" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>

    import {mapActions} from 'vuex'
    import { logRegTitle } from '../global/variables.js'
    import mixin from "src/global/mixin";

    export default {
        name: "NewPassword",
        mixins: [mixin],
        data() {
            return {
                title: logRegTitle,
                email: '',
                newPass: {
                    email: '',
                    token: '',
                    password: '',
                    password_confirmation: ''
                },
                tab: 'email',
                isPwd1: true,
                isPwd2: true,
                particlesOptions: {
                background: {
                  color: {
                    value: '#fff'
                  }
                },
                fpsLimit: 60,
                interactivity: {
                  events: {
                    onClick: {
                      enable: true,
                      mode: 'push'
                    },
                    onHover: {
                      enable: true,
                      mode: 'repulse'
                    },
                    resize: true
                  },
                  modes: {
                    bubble: {
                      distance: 400,
                      duration: 2,
                      opacity: 0.8,
                      size: 40
                    },
                    push: {
                      quantity: 4
                    },
                    repulse: {
                      distance: 50,
                      duration: 0.4
                    }
                  }
                },
                particles: {
                  color: {
                    value: '#090c11'
                  },
                  links: {
                    color: '#050505',
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1
                  },
                  collisions: {
                    enable: true
                  },
                  move: {
                    direction: 'none',
                    enable: true,
                    outMode: 'bounce',
                    random: false,
                    speed: 1,
                    straight: false
                  },
                  number: {
                    density: {
                      enable: true,
                      area: 800
                    },
                    value: 80
                  },
                  opacity: {
                    value: 0.5
                  },
                  shape: {
                    type: 'circle'
                  },
                  size: {

                    value: 1
                  }
                },
                detectRetina: true
              }
            }
        },
        methods: {
            ...mapActions({
               sendResetEmail: 'auth/resetEmail',
               changePassword: 'auth/changePassword'
            }),
            sendEmail() {
                this.sendResetEmail(this.email)
                .then((response) => {
                    this.showNotif(response.success,'positive')
                })
                .catch((e) => {
                    this.showNotif(e,'negative')
                })
            },
            clearSendEmail() {
                this.email = ''
            },
            newPassword() {
                this.changePassword(this.newPass)
                .then((response) => {
                    this.showNotif(response.success,'positive')
                    setTimeout( () => this.$router.push({ path: '/login-register'}), 4000);
                })
                .catch((e) => {
                    this.showNotif(e,'negative')
                })
            },
            clearNewPassword() {
                this.newPass = {}
            }
        }
    }
</script>

<style scoped>
    .text-subtitle1 {
        text-decoration: none;
    }
</style>
