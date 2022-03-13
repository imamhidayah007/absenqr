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
            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.NIP" required label="NIP"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.Nama" label="Nama Lengkap" required/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.Telepon" label="Nomor Telepon / HP"/>
              </q-item>

              <q-item>
                <q-select outlined class="full-width" v-model="form.Agama" :options="agamaOptions" label="Agama" />
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.Tempat_Lahir" label="Tempat Lahir"/>
              </q-item>


            </div>

            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.NIK" label="NIK (Nomor Induk Keluarga)" required/>
              </q-item>
              <q-item>
                <q-input  outlined class="full-width" v-model="form.NIY" label="NIY"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.Email" label="Email"/>
              </q-item>

              <q-item>
                <q-select :options="jeniskelaminOptions"  outlined class="full-width" v-model="form.Jenis_Kelamin" label="Jenis Kelamin"/>
              </q-item>

              <q-item>
                <q-input outlined class="full-width" label="Tanggal Lahir" v-model="form.Tanggal_Lahir" mask="date" :rules="['Tanggal_Lahir']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.Tanggal_Lahir">
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

            <div class="col-12">
              <q-item>
                <q-input
                  class="full-width"
                  v-model="form.Alamat"
                  outlined
                  type="textarea"
                  label="Alamat"
                />
              </q-item>
            </div>

            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.Pangkat" label="Pangkat"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.Golongan" label="Golongan"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.Gelar_Depan" label="Gelar Depan"/>
              </q-item>

              <q-item>
                <q-select :options="goldarahOptions"  outlined class="full-width" v-model="form.Gol_Darah" label="Golongan Darah"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.NUPTK" label="NUPTK"/>
              </q-item>

              <q-item>
                <q-select :options="statusguruOptions"  outlined class="full-width" v-model="form.Status_Guru" label="Status Guru/Staff"/>
              </q-item>

            </div>

            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="form.Jabatan" label="Jabatan"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.Jabatan_Sekolah" label="Jabatan Sekolah"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.Gelar_Belakang" label="Gelar Belakang"/>
              </q-item>

              <q-item>
                <q-select :options="statusMaritalOptions"  outlined class="full-width" v-model="form.Status_Marital" label="Status Marital"/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="form.Tahun_Masuk" label="Tahun Masuk"/>
              </q-item>

              <q-item>
                <q-select :options="sertifikasiOptions"  outlined class="full-width" v-model="form.Sertifikasi" label="Sertifikasi"/>
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
          document.title = to.meta.title || 'Detail Guru dan Staff - Absen QR';
        }
      },
    },
    data() {
      return {
        waktu: null,
        dataSekolah: [],
        loading: false,
        guru: ref('isidata'),
        agamaOptions: ['Islam','Katolik','Protestan','Hindu','Buddha','Khonghucu'],
        jeniskelaminOptions: ['L', 'P'],
        goldarahOptions: ['A', 'B','AB','O'],
        statusMaritalOptions: ['Menikah', 'Belum Menikah','Cerai'],
        sertifikasiOptions: ['Ya', 'Tidak'],
        statusguruOptions: ['PNS', 'Honor','Tetap'],

        form: {
          NIP: null,
          NIK: null,
          Nama: null,
          Agama: null,
          Tempat_Lahir: null,
          Tanggal_Lahir: ref('2022/01/01'),
          Jenis_Kelamin: null,
          Alamat: null,
          Telepon: null,
          Email: null,
          Jabatan: null,
          Pangkat: null,
          Golongan: null,
          NUPTK: null,
          Status_Marital: null,
          Gol_Darah: null,
          Gelar_Depan: null,
          Gelar_Belakang: null,
          Tahun_Masuk: null,
          Jabatan_Sekolah: null,
          NIY: null,
          Status_Guru: null,
          Sertifikasi: null,
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
      getGuru (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        var linkd = this.$route.params.id
        this.$axios.get(`detailGuru/${linkd}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
            // console.log(response)
            if (response.data.msg.status === true) {
              this.form = response.data.data
              this.form.FotoLama = response.data.data.Foto
              this.txtNama = response.data.data.Nama
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
        this.$axios.put('updateguru/'+this.$route.params.id,  formData)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })
              this.getGuru()
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
      this.getGuru()
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
