<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Detail {{txtNama}}</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>

        <div style="text-align: center;padding: 20px">
          <q-avatar size="150px" class="shadow-10">
            <img style="width: 100%;" :src="`${$baseAlbumSekolah}${imgFoto}`">
          </q-avatar>
        </div>
        <q-form @submit="onSubmit">
          <div class="row">
            <div class="col-12">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.nama_siswa" label="Nama Siswa" required/>
              </q-item>

            </div>
            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.nisn" label="NISN" required/>
              </q-item>

              <q-item>
                <q-select outlined class="full-width" v-model="form.agama" :options="agamaOptions" label="Agama" />
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.tempat_lahir" label="Tempat Lahir" required/>
              </q-item>


            </div>

            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.nis" label="NIS"/>
              </q-item>

              <q-item>
                <q-select :options="jeniskelaminOptions"  outlined class="full-width" v-model="form.jenis_kelamin" label="Jenis Kelamin"/>
              </q-item>

              <q-item>
                <q-input outlined class="full-width" v-model="form.tanggal_lahir" label="Tanggal Lahir" mask="date" :rules="['tanggal_lahir']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.tanggal_lahir">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item>

            </div>

            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.hp_siswa" label="Telp.HP Siswa"/>
              </q-item>
            </div>
            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.email_siswa" label="Email Siswa"/>
              </q-item>
            </div>

            <div class="col-12">
              <q-item>
                <q-input
                  class="full-width"
                  v-model="form.alamat"
                  outlined
                  type="textarea"
                  label="Alamat"
                />
              </q-item>
            </div>

            <div class="col-6">
              <q-item>
                <q-input outlined class="full-width" v-model="form.tanggal_diterima" label="Tanggal Diterima Disekolah" mask="date" :rules="['tanggal_diterima']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.tanggal_diterima">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item>
            </div>
            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.diterima_dikelas" label="Diterima Dikelas"/>
              </q-item>
            </div>

            <div class="col-12">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.anak_ke" label="Anak Ke"/>
              </q-item>
            </div>

            <div style="padding-left:17px;padding-right:15px;padding-top: 20px" class="col-12">

              <span style="color: #1976D2"><strong>Data Orang Tua</strong></span>
              <q-separator style="background-color:#1976D2;padding-top: 1px" />

            </div>

            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.nama_ayah" label="Nama Ayah"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.pekerjaan_ayah" label="Pekerjaan Ayah"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.hp_ayah" label="Telp./HP Ayah"/>
              </q-item>



            </div>

            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.nama_ibu" label="Nama Ibu"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.pekerjaan_ibu" label="Pekerjaan Ibu"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.hp_ibu" label="Telp./HP Ibu"/>
              </q-item>

            </div>

            <div style="padding-left:17px;padding-right:15px;padding-top: 20px" class="col-12">

              <span style="color: #1976D2"><strong>Data Wali</strong></span>
              <q-separator style="background-color:#1976D2;padding-top: 1px" />

            </div>

            <div class="col-12">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.nama_wali" label="Nama Wali"/>
              </q-item>

            </div>

            <div class="col-6">

              <q-item>
                <q-input  outlined class="full-width" v-model="form.pekerjaan_wali" label="Pekerjaan Wali"/>
              </q-item>

            </div>

            <div class="col-6">

              <q-item>
                <q-input  outlined class="full-width" v-model="form.hp_wali" label="Telp./HP Wali"/>
              </q-item>

            </div>

            <div style="padding-left:17px;padding-right:15px;padding-top: 20px" class="col-12">

              <span style="color: #1976D2"><strong>Data Ijazah dan Asal Sekolah (Optional)</strong></span>
              <q-separator style="background-color:#1976D2;padding-top: 1px" />

            </div>

            <div class="col-12">

              <q-item>
                <q-input  outlined class="full-width" v-model="form.asal_sekolah" label="Asal Sekolah"/>
              </q-item>

            </div>

            <div class="col-6">

              <q-item>
                <q-input outlined class="full-width" v-model="form.tanggal_masuk" label="Tanggal Masuk " mask="date" :rules="['tanggal_masuk']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.tanggal_masuk">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.tahun_ijazah" label="Tahun Ijazah"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.no_shun_ijazah" label="No. SHUN "/>
              </q-item>

            </div>

            <div class="col-6">

              <q-item>
                <q-input outlined class="full-width" v-model="form.tanggal_keluar" label="Tanggal Lulus" mask="date" :rules="['tanggal_keluar']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.tanggal_keluar">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.no_ijazah" label="No Ijazah"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.tahun_nopes" label="Nomor Peserta UN"/>
              </q-item>

            </div>

            <div style="padding-left:17px;padding-right:15px;padding-top: 20px" class="col-12">

              <span style="color: #1976D2"><strong>Pas Foto</strong></span>
              <q-separator style="background-color:#1976D2;padding-top: 1px" />

            </div>

            <div class="col-12">

              <q-item>
                <q-select :options="statussiswaOptions"  outlined class="full-width" v-model="form.status_siswa" label="Status Siswa"/>
              </q-item>

            </div>

            <div class="col-12">
              <q-item>
                <q-file class="full-width" accept=".jpg, image/*" color="grey-3" outlined label-color="blue" v-model="form.Foto" label="Pas Foto">
                  <template v-slot:append>
                    <q-icon name="attachment" color="blue" />
                  </template>
                </q-file>
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
          document.title = to.meta.title || 'Detail Siswa - Absen QR';
        }
      },
    },
    data() {
      return {
        waktu: null,
        dataSekolah: [],
        loading: false,
        agamaOptions: ['Islam','Katolik','Protestan','Hindu','Buddha','Khonghucu'],
        jeniskelaminOptions: ['L', 'P'],
        goldarahOptions: ['A', 'B','AB','O'],
        statusMaritalOptions: ['Menikah', 'Belum Menikah','Cerai'],
        sertifikasiOptions: ['Ya', 'Tidak'],
        statusguruOptions: ['PNS', 'Honor','Tetap'],
        statussiswaOptions: ['Aktif', 'Pindah Sekolah','DO', 'Skors','Lulus'],
        form: {
          nisn: null,
          nis: null,
          nama_siswa: null,
          jenis_kelamin: null,
          tempat_lahir: null,
          tanggal_lahir: ref('2022/01/01'),
          agama: null,
          email_siswa: null,
          hp_siswa: null,
          nama_ayah: null,
          nama_ibu: null,
          pekerjaan_ayah: null,
          pekerjaan_ibu: null,
          hp_ayah: null,
          hp_ibu: null,
          alamat: null,
          nama_wali: null,
          pekerjaan_wali: null,
          hp_wali: null,
          tanggal_diterima: ref('2022/01/01'),
          diterima_dikelas: null,
          tahun_ijazah: null,
          tahun_nopes: null,
          no_shun_ijazah: null,
          no_ijazah: null,
          asal_sekolah: null,
          tanggal_masuk : ref('2022/01/01'),
          tanggal_keluar : ref('2022/01/01'),
          anak_ke: null,
          status_siswa: null,
          Foto: null,
          FotoLama: null
        },
        imgFoto: null,
        txtNama:null
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
      getSiswa (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        var linkd = this.$route.params.id
        this.$axios.get(`detailSiswa/${linkd}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
          //  console.log(response.data.data)
            if (response.data.msg.status === true) {
              this.form = response.data.data
              this.form.FotoLama = response.data.data.Foto
              this.txtNama = response.data.data.nama_siswa
              this.imgFoto = response.data.data.Foto
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

        const formData = new FormData()
        formData.append('Foto', this.form.Foto)
        formData.append('data', JSON.stringify(this.form))
        this.$axios.put('updatesiswa/'+this.$route.params.id,  formData)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })
              this.getSiswa()
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

    },
    created() {
      this.getSiswa()
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
