<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
      <strong>Setting Password</strong>
      <template v-slot:action>
        <span>{{waktu}}</span>
      </template>
    </q-banner>
    <br />
    <div>
      <div class="row q-col-gutter-sm">

        <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
          <q-card flat bordered class="card-bg text-black">
            <q-card-section class="text-h6 q-pa-sm">
              <div class="text-h6">Ubah Password</div>
            </q-card-section>
            <q-card-section class="q-pa-sm row">
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  Password Baru
                </q-item-section>
              </q-item>
              <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input type="password"  dense outlined color="black" round v-model="formPassword.pass"
                           label="Password Baru"/>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  Konfirmasi Password Baru
                </q-item-section>
              </q-item>
              <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input type="password"  dense outlined round color="black" v-model="formPassword.password"
                           label="Konfirmasi Password Baru"/>
                </q-item-section>
              </q-item>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn @click="changePassword()"  class="text-capitalize bg-info text-white">Simpan Password</q-btn>
            </q-card-actions>

          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
  import {QSpinnerPie} from "quasar";

  export default {
    name: "Profile",
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          document.title = to.meta.title || 'Setting - Absen Apps';
        }
      },
    },
    data() {
      return {
        user_details: {},
        password_dict: {},

        formPassword: {
          pass: null,
          password: null
        }
      }
    },
    methods: {

      changePassword () {

        var pass1 = this.formPassword.pass
        var pass2 = this.formPassword.password

        if (pass1 === null || pass2 === null){
          this.$q.notify({
            color: 'warning',
            icon: 'ion-alert',
            message: 'Mohon Isi Form Password!!'
          })
        } else if (pass1 != pass2){
          this.$q.notify({
            color: 'warning',
            icon: 'ion-alert',
            message: 'Password Tidak Sama!!'
          })
        }else {
          const id = btoa( this.$q.localStorage.getItem('dataUser').id)
          this.$axios.put(`updatepassword/${id}`, this.formPassword)
            .then(res => {
              if (res.data.msg.status === true) {
                this.formPassword.pass = null
                this.formPassword.password = null
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })
              }else{
                this.$q.notify({
                  color: 'negative',
                  message: res.data.msg.msg,
                  icon: 'ion-close'
                })
              }

            }).catch(() => {
            this.$q.notify({
              color: 'negative',
              message: 'Gagal Terhubung',
              icon: 'ion-close'
            })
          })
        }
      },

    }
  }
</script>

<style scoped>

  .card-bg {
    background-color: white;
  }
</style>
