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
              <q-tab name="login" label="Prijava"></q-tab>
              <q-tab name="register" label="Registracija"></q-tab>
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="login">
                <div class="text-h6">Prijava</div>
                <q-form
                  @submit="loginUser"
                  @reset="clearLogin"
                  class="q-col-gutter-lg"
                >
                  <q-input
                    v-model="loginForm.email"
                    label="Email"
                    autofocus
                    type="text"
                    :rules="[ val => val && val.length > 0 || `${this.$t('general.enterEmail')}`, isValidEmail]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="alternate_email" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="loginForm.password"
                    :type="isPwd1 ? 'password' : 'text'"
                    label="Geslo"
                    :rules="[ val => val && val.length > 0 || `${this.$t('general.enterPassword')}`]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd1 ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd1 = !isPwd1"
                      />
                    </template>
                  </q-input>
                  <div>
                    <q-btn label="Prijava" type="submit" :disable="notHttps" color="green"/>
                    <q-btn label="Počisti" type="reset" color="primary" flat class="q-ml-sm" />
                  </div>
                </q-form>
                <div class="text-center q-mt-lg">
                  <q-btn to="/new-password" outline icon="mail" color="primary" label="Novo geslo" />
                </div>
              </q-tab-panel>

              <q-tab-panel name="register">
                <div class="text-h6">Registracija</div>
                <q-form
                  @submit="registerUser"
                  @reset="clearRegister"
                  class="q-col-gutter-lg"
                >
                  <q-input
                    v-model="registerForm.email"
                    label="Email"
                    autofocus
                    type="email"
                    :rules="[ val => val && val.length > 0 || `${this.$t('general.enterEmail')}`, isValidEmail]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="alternate_email" />
                    </template>
                  </q-input>

                  <q-input
                    v-model="registerForm.username"
                    label="Uporabniško ime"
                    type="text"
                    :rules="[ val => val && val.length > 3  || `${this.$t('general.enterUsername')}`]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>

                  <q-input
                    v-model="registerForm.password"
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
                    v-model="registerForm.password_confirmation"
                    label="Ponovite geslo"
                    type="password"
                    :rules="[
                                    val => val && val.length > 0 || `${this.$t('general.repeatPassword')}`,
                                    val => val === this.registerForm.password || `${this.$t('general.passMissmatch')}`]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                  <div>
                    <q-btn label="Registracija" type="submit" :disable="notHttps" color="green"/>
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

import {mapActions, mapGetters} from 'vuex'
import { logRegTitle } from 'src/global/variables.js'
import mixin from "src/global/mixin";
import {axiosInstance} from "boot/axios";

    export default {
        name: "LoginRegister",
        mixins: [mixin],
        data() {
            return {
                title: logRegTitle,
                loginForm: {
                    email: '',
                    password: ''
                },
                registerForm: {
                    email: '',
                    username: '',
                    password: '',
                    password_confirmation: ''
                },
                tab: 'login',
                isPwd1: true,
                isPwd2: true,
                notHttps: false,
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
        computed: {
          ...mapGetters({
            user: 'auth/user'
          })
        },
        created() {
          var currentUrl = window.location.href
          if (!currentUrl.includes('https') && !process.env.DEV) {
            this.notHttps = true
            this.showPermNotif(`${this.$t('general.https')}`, 'warning')
          }
        },
      methods: {
          ...mapActions({
            loginAction: 'auth/login',
            registerAction: 'auth/register'
          }),
            clearLogin() {
                this.loginForm = {}
            },
            clearRegister() {
                this.registerForm = {}
            },
            loginUser() {
                this.loginAction(this.loginForm)
                .then((response) => {
                    this.showNotif(`${this.$t('general.helloMessage')}` + ' ' + this.user.username + '!', 'positive')
                    this.$router.push('/')
                })
                .catch((e) => {
                     this.showNotif(e,'negative')
                })
            },
            registerUser() {
                this.registerAction(this.registerForm)
                .then((response) => {
                    this.showNotif(response.success,'positive')
                })
                .catch((e) => {
                    this.showNotif(e,'negative')
                })
            }
        }
    }
</script>

<style scoped>
</style>
