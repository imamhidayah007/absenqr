<template>
    <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
      <div class="q-pa-md q-gutter-sm">
        <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
          <strong>Master Data Sekolah</strong>
          <template v-slot:action>
            <span>{{waktu}}</span>
          </template>
        </q-banner>
        <br />

        <q-card flat bordered>
          <q-tabs
            v-model="sekolah"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="sekolah" label="Master Sekolah" />
            <q-tab name="setting" label="Setting Master Sekolah" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="sekolah" animated>
            <q-tab-panel name="sekolah">
<!--              <div class="text-h6">Mails</div>-->
              <table>
                <tbody>
                <tr>
                  <td width="20%"><b>NPSN</b></td>
                  <td>{{dataSekolah.npsn}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Nama Sekolah</b></td>
                  <td>{{dataSekolah.nama_sekolah}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Web Sekolah</b></td>
                  <td><a :href="dataSekolah.web_sekolah" target="_blank">{{dataSekolah.web_sekolah}}</a></td>
                </tr>
                <tr>
                  <td width="20%"><b>No. Telepon</b></td>
                  <td>{{dataSekolah.telepon}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Email</b></td>
                  <td>{{dataSekolah.email_sekolah}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Alamat Sekolah</b></td>
                  <td>{{dataSekolah.alamat_sekolah}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Kecamatan / Kab/Kota / Provinsi</b></td>
                  <td>Kecamatan {{dataSekolah.kecamatan +' Kab/Kota '+ dataSekolah.kab_kota +' Provinsi '+ dataSekolah.provinsi}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Kode Pos</b></td>
                  <td>{{dataSekolah.kode_pos}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Luas Tanah</b></td>
                  <td>{{dataSekolah.luas_tanah}} M<sup>2</sup></td>
                </tr>
                <tr>
                  <td width="20%"><b>Ruang Kelas</b></td>
                  <td>{{dataSekolah.ruang_kelas}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Laboratorium</b></td>
                  <td>{{dataSekolah.lab}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Perpustakaan</b></td>
                  <td>{{dataSekolah.perpus}}</td>
                </tr>
                <tr>
                  <td width="20%"><b>Logo</b></td>
                  <td>
                    <img style="width: 20%;" :src="`${$baseAlbumSekolah}${dataSekolah.logo}`">
                  </td>
                </tr>
                </tbody>
              </table>
            </q-tab-panel>

            <q-tab-panel name="setting">
              <q-form @submit="onSubmit">
              <div class="row">
                <div class="col-6">
                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.npsn" label="NPSN"/>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.web_sekolah" label="Web Sekolah"/>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.telepon" label="Nomor Telepon"/>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.provinsi" label="Provinsi"/>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.kecamatan" label="Kecamatan"/>
                  </q-item>


                </div>

                <div class="col-6">
                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.nama_sekolah" label="Nama Sekolah"/>
                  </q-item>
                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.email_sekolah" label="Email Sekolah"/>
                  </q-item>

                  <q-item>
                    <q-file class="full-width" accept=".jpg, image/*" color="grey-3" outlined label-color="orange" v-model="form.logo" label="Logo">
                      <template v-slot:append>
                        <q-icon name="attachment" color="blue" />
                      </template>
                    </q-file>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.kab_kota" label="Kabupaten / Kota"/>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.kode_pos" label="Kode Pos"/>
                  </q-item>

                </div>

                <div class="col-12">
                  <q-item>
                    <q-input
                      class="full-width"
                      v-model="form.alamat_sekolah"
                      outlined
                      type="textarea"
                      label="Alamat"
                    />
                  </q-item>
                </div>

                <div class="col-6">
                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.luas_tanah" label="Luas Tanah (M2)"/>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.lab" label="Jumlah Laboratorium"/>
                  </q-item>

                </div>

                <div class="col-6">
                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.ruang_kelas" label="Jumlah Ruang Kelas"/>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.perpus" label="Jumlah Perpustakaan"/>
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
            document.title = to.meta.title || 'Master Sekolah - Absen QR';
          }
        },
      },
      data() {
        return {
          waktu: null,
          dataSekolah: [],
          loading: false,
          sekolah: ref('sekolah'),
          ids: null,
          logos: null,
          form: {
            npsn: null,
            nama_sekolah: null,
            web_sekolah: null,
            telepon: null,
            alamat_sekolah: null,
            provinsi: null,
            kab_kota: null,
            kecamatan: null,
            kode_pos: null,
            luas_tanah: null,
            ruang_kelas: null,
            lab: null,
            perpus: null,
            email_sekolah: null,
            logo: null,
            logolama: null,
          }
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
        onSubmit () {
          const formData = new FormData()
          formData.append('logo', this.form.logo)
          formData.append('data', JSON.stringify(this.form))
          this.$axios.put('setSekolah/' + btoa(this.ids),  formData)
            .then(res => {
              if (res.data.msg.status == true) {
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })
                this.getSekolah()
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

        },
        getSekolah () {
          const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)
          this.loading = true
          this.$q.loading.show(this.$loadingStyle)
          this.$axios.get(`getSekolah/${id}`)
            .finally(() => this.$q.loading.hide())
            .then(response => {
              this.loading = false
             //  console.log(response)
              if (response.data.msg.status === true) {
                this.dataSekolah = response.data.data
                this.form = response.data.data
                this.ids = response.data.data.id
                this.form.logolama = response.data.data.logo
                //console.log(this.dataSekolah.nama_sekolah)
              } else {
                this.dataSekolah = []
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
      },
      created() {
        this.getSekolah()
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
