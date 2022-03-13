<template>
  <q-page class="flex flex-center">
    <div  :class="$q.screen.lt.md ? 'mobile' : 'my-card'">
      <q-card :flat="$q.screen.lt.md" :bordered="$q.screen.gt.xs">
        <q-item>
          <q-list class="row" >
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section avatar style="padding-top: 8px;">
                <q-img  :style="$q.screen.lt.md ? 'width: 300%' : 'width: 400%'"
                       src="~assets/logosun.png"
                />
              </q-item-section>
              <q-item-section  :style="$q.screen.lt.md ? 'padding-left: 85px' : 'padding-left: 115px'">
                <div class="text-h6 q-mt-sm q-mb-xs">Masuk - Absen QR</div>
                <q-item-label style="color: grey">Silahkan isi form dengan benar</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-item>
        <!--              <q-separator />-->
        <q-card-section horizontal >
          <q-card-section :class="$q.screen.lt.md ? 'col-12' : 'col-7'">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding-top: 30px">
                <q-item-section>
                  <q-input outlined v-model="form.user" type="text"  :dense="dense" label="Username" />
                </q-item-section>
              </q-item>

              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input outlined  :type="isPwd ? 'text' : 'password'"   v-on:keyup.enter="onSubmit()"  v-model="form.password" :dense="dense" label="Kata Sandi" />
                </q-item-section>
              </q-item>

              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding-top: 0cm">

                <q-item-section>
                  <q-toggle
                    v-model="isPwd"
                    checked-icon="check"
                    color="green"
                    unchecked-icon="clear"
                    label="Tampilkan Kata Sandi"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <p style="padding-left: 20px;"> <router-link  style="color: grey;text-decoration: none;"  :to="{name: 'help'}"><b>Lupa Kata Sandi ?</b></router-link></p>
                  <p v-if="$q.screen.lt.md" style="padding-left: 20px;">Selalu Jaga Kerahasian Akun Anda</p>

                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <div class="row justify-end">
                    <q-btn style="width: 150px;"  class="active" :loading="loading"  @click="onSubmit()" label="Masuk" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <!--                <q-separator vertical />-->
          <q-card-section class="col-5" v-if="$q.screen.gt.xs">
            <div class="text-center">
              <q-img style="width: 65%"
                     src="https://cdn-icons-png.flaticon.com/512/3039/3039372.png"
              />

              <q-item-label style="text-align: center;padding-top: 15px; font-size: 16px; color: grey">Selalu Jaga Kerahasian Akun Anda</q-item-label>
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>

      <q-bar style="padding-top: 20px" dense class=" bg-white text-grey-8">
        <!--          <div>mobi-net</div>-->
        <q-space />
        <div style="padding-right: 10px">Bantuan</div>
        <div style="padding-right: 10px">Privasi</div>
        <div style="padding-right: 10px">Persyaratan</div>

      </q-bar>
    </div>


  </q-page>

</template>

<script>

  import {LocalStorage} from "quasar";
  import { useQuasar, QSpinnerPie} from 'quasar'
  import { onBeforeUnmount } from 'vue'

  export default {
    name: 'Login',
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Masuk - Absen QR';
        }
      },
    },
    data () {
      return {
        dataSekolah: [],
        //  isPswd: true,
        loading: false,
        visible: false,
        form: {
          user: '',
          password: ''
        },
        isPwd: false,
        dense: true,

      }
    },
    methods: {
      // getSekolah () {
      //
      //   this.$axios.get(`getSekolah`)
      //     .then(response => {
      //       //  console.log(response)
      //       if (response.data.msg.status === true) {
      //         this.dataSekolah = response.data.data
      //
      //         //console.log(this.dataSekolah.nama_sekolah)
      //       } else {
      //         this.dataSekolah = []
      //         this.$q.notify({
      //           color: 'negative',
      //           message: response.data.msg.msg,
      //           icon: 'ion-close'
      //         })
      //       }
      //     }).catch(() => {
      //     this.$q.notify({
      //       color: 'negative',
      //       message: 'Gagal Terhubung',
      //       icon: 'ion-close'
      //     })
      //   })
      // },
      onSubmit () {
        const user = this.form.user
        const pw = this.form.password

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        if (user === '' || pw === ''){
          this.$q.loading.hide()
          this.loading = false
          // this.$showNotif('sip','danger', this.$vs.notification)
          this.$q.notify({
            color: 'warning',
            position: "center",
            icon: 'ion-alert',
            message: 'Username dan Password Harap Diisi!!'
          })
        }else {

          // this.$router.push({ name: 'dashboard' })
          this.$axios.post('/login', {
            username: user,
            password: pw
          })
            .finally(() => this.$q.loading.hide())
            .then((response) => {
              // console.log(response)
              this.loading = false
              if (response.data.msg.status === true) {
                this.$q.notify({
                  color: 'positive',
                  message: response.data.msg.msg,
                  icon: 'ion-checkmark'
                })

                this.$q.localStorage.set('dataUser', response.data.data)

                // if (response.data.data.level === 'Admin' && response.data.data.status_aktif === 'Aktif' ) {
                  this.$router.push({name: 'dashboard'})
                // }else{
                //   console.log('Tidak ada AKSES')
                // }

              } else {
                this.$q.notify({
                  color: 'negative',
                  message: response.data.msg.msg,
                  icon: 'ion-close'
                })
              }
            }).catch(() => {
            this.$q.notify({
              color: 'negative',
              message: 'Gagal terhubung',
              icon: 'ion-close'
            })
          })

        }

      }

    },
    created() {
     // this.getSekolah()
    }
  }
</script>
<style>
  .active {
    color: #ffffff;
    background: linear-gradient(to right,#1976D2, #99c9ff);
  }
</style>
<style lang="sass" scoped>
  .my-card
    width: 60%

    .mobile
      width: 99%
</style>
