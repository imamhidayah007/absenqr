<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Setting Jam Absen</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-tabs
          v-model="jamabsen"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="settingjam" label="Setting Jam Absen" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="jamabsen" animated>
          <q-tab-panel name="settingjam">
            <!--              <div class="text-h6">Mails</div>-->
            <q-form @submit="onSubmit">

              <div class="row">
                <div class="col-12">
                  <q-item>
                    <q-input readonly outlined class="full-width" v-model="aktor" label="Pengguna/ Aktor" model-value="Guru/ Staff"  required/>
                  </q-item>

                </div>
                <div class="col-5">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_hadir_g1" mask="time" :rules="['jam_hadir_g1']" label="Jam Hadir (Mulai)">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_hadir_g1">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>
                <div class="col-2">

                    <div style="text-align: center; padding-top: 25px">
                      <span><b>Sampai Dengan</b></span>
                    </div>

                </div>
                <div class="col-5">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_hadir_g2" mask="time" :rules="['jam_hadir_g2']" label="Jam Hadir (Berakhir)">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_hadir_g2">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>


                <div class="col-5">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_pulang_g1" mask="time" :rules="['jam_pulang_g1']" label="Jam Pulang (Mulai)">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_pulang_g1">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>
                <div class="col-2">

                  <div style="text-align: center; padding-top: 25px">
                    <span><b>Sampai Dengan</b></span>
                  </div>

                </div>
                <div class="col-5">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_pulang_g2" mask="time" :rules="['jam_pulang_g2']" label="Jam Pulang (Berakhir)">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_pulang_g2">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>

              </div>

              <div class="row">
                <div class="col-md-12">
                  <q-item>
                    <hr />
                  </q-item>

                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <q-item>
                    <q-input readonly outlined class="full-width" v-model="aktor" label="Pengguna/ Aktor" model-value="Siswa"  required/>
                  </q-item>

                </div>
                <div class="col-5">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_hadir_s1" mask="time" :rules="['jam_hadir_s1']" label="Jam Hadir (Mulai)">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_hadir_s1">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>
                <div class="col-2">

                  <div style="text-align: center; padding-top: 25px">
                    <span><b>Sampai Dengan</b></span>
                  </div>

                </div>
                <div class="col-5">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_hadir_s2" mask="time" :rules="['jam_hadir_s2']" label="Jam Hadir (Berakhir)">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_hadir_s2">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>


                <div class="col-5">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_pulang_s1" mask="time" :rules="['jam_pulang_s1']" label="Jam Pulang (Mulai)">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_pulang_s1">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>
                <div class="col-2">

                  <div style="text-align: center; padding-top: 25px">
                    <span><b>Sampai Dengan</b></span>
                  </div>

                </div>
                <div class="col-5">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_pulang_s2" mask="time" :rules="['jam_pulang_s2']" label="Jam Pulang (Berakhir)">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_pulang_s2">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>

                <div class="col-12">

                  <q-card-actions style="padding-top: 25px; padding-right: 18px" align="center" class="text-teal">
                    <q-btn style="width: 100%"
                           label="Simpan"
                           type="submit"
                           color="primary"
                    />
                  </q-card-actions>
                </div>

              </div>

            </q-form>


          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </div>
  </q-page>


</template>

<script>
  import { ref } from 'vue'

  export default {
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Setting Jam Absen - Absen QR';
        }
      },
    },
    data() {

      return {
        modalTA: ref(false),
        waktu: null,
        dataSekolah: [],
        loading: false,
        jamabsen: ref('settingjam'),
        aktor: null,
        idj: null,
        form: {
          id: null,
          id_sekolah: this.$q.localStorage.getItem('dataUser').id_sekolah,
          jam_hadir_g1: ref('00:00'),
          jam_hadir_g2: ref('00:00'),
          jam_pulang_g1: ref('00:01'),
          jam_pulang_g2: ref('00:01'),

          jam_hadir_s1: ref('00:00'),
          jam_hadir_s2: ref('00:00'),
          jam_pulang_s1: ref('00:01'),
          jam_pulang_s2: ref('00:01'),

        },
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "tahun_ajaran",
            align: "left",
            label: "Tahun Ajaran",
            field: "tahun_ajaran",
            sortable: true
          },
          { name: "semester", required: true, label: "semester", align: "left", field: "semester", sortable: true },
          { name: "status", required: true, label: "Status Aktif", align: "left", field: "status", sortable: true },
          { name: "action", required: true, label: "Action", align: "left", field: "action", sortable: true },
        ],
        data : []
      }
    },
    methods: {

      tanggal (){
        var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth();
        var thisDay = date.getDay(),
          thisDay = myDays[thisDay];
        var yy = date.getYear();
        var year = (yy < 1000) ? yy + 1900 : yy;
        this.waktu = thisDay + ', ' + day + ' ' + months[month] + ' ' + year
      },
      getJam(){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)


        this.$axios.get(`getjamabsen/${id}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false

            if (response.data.msg.status === true) {
             // this.data = response.data.data
              if (response.data.data != null){
                this.form = response.data.data
                this.idj = 1
              }
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
            message: 'Gagal Terhubung',
            icon: 'ion-close'
          })
        })

      },
      onSubmit () {
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        if (this.idj === 1){
          const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)
          this.$axios.put(`updatejamabsen/${id}`, this.form)
            .finally(() => this.$q.loading.hide())
            .then(res => {
              this.loading = false
              if (res.data.msg.status == true) {
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })

                this.getJam()
              } else {
                this.$q.notify({
                  color: 'negative',
                  message: res.data.msg.msg,
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

        }else {

          this.$axios.post('inputjamabsen/', this.form)
            .finally(() => this.$q.loading.hide())
            .then(res => {
              this.loading = false
              if (res.data.msg.status == true) {
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })

                this.getJam()
              } else {
                this.$q.notify({
                  color: 'negative',
                  message: res.data.msg.msg,
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

      },

    },
    created() {
      this.getJam()
      this.tanggal()
    }
  }
</script>

<style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #F5F3F3;
  }
</style>
