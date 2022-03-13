<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Data Master Siswa</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-tabs
          v-model="siswa"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="isisiswa" label="Data Siswa" />
          <q-tab name="inputsiswa" label="Tambah Data Siswa" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="siswa" animated>
          <q-tab-panel name="isisiswa">
            <!--              <div class="text-h6">Mails</div>-->

            <div class="text-center" v-show="modalQR" style="padding-bottom: 10px">

              <canvas id="qr-code" /><br />
              <q-btn outline rounded color="teal" @click="donwloadCanvas" label="Download QR Code" />

            </div>


            <q-table
              class="my-sticky-column-table"
              flat
              bordered
              :rows="data"
              :columns="columns"
              row-key="NIP"
              :filter="filter"
              :pagination="pagination"
            >
              <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body-cell-tempat_lahir="props">
                <q-td :props="props">
                  {{props.row.tempat_lahir+', '+new  Date(props.row.tanggal_lahir).getDate()+'-'+(new  Date(props.row.tanggal_lahir).getUTCMonth()+1)+'-'+new  Date(props.row.tanggal_lahir).getUTCFullYear()}}
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn outline color="purple" size="sm" @click="QRSiswa(props.row)" icon="select_all"> QR Code Siswa</q-btn>
                    <q-btn outline color="blue" size="sm" @click="detailSiswa(props.row.id)" icon="receipt_long"> Detail</q-btn>
                    <q-btn outline color="red" size="sm" @click="deleteSiswa(props.row.id, props.row.Foto)" icon="delete_sweep"> Hapus</q-btn>
                  </div>
                </q-td>
              </template>

            </q-table>

          </q-tab-panel>

          <q-tab-panel name="inputsiswa">
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

          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </div>
  </q-page>

</template>

<script>
  import { ref } from 'vue'
  import QRious from "qrious";

  export default {
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Data Guru dan Staff - Absen QR';
        }
      },
    },
    data() {

      return {
        waktu: null,
        dataSekolah: [],
        loading: false,
        modalQR: false,
        namaQR: '',
        siswa: ref('isisiswa'),
        agamaOptions: ['Islam','Katolik','Protestan','Hindu','Buddha','Khonghucu'],
        jeniskelaminOptions: ['L', 'P'],
        goldarahOptions: ['A', 'B','AB','O'],
        statusMaritalOptions: ['Menikah', 'Belum Menikah','Cerai'],
        sertifikasiOptions: ['Ya', 'Tidak'],
        statusguruOptions: ['PNS', 'Honor','Tetap'],
        statussiswaOptions: ['Aktif', 'Pindah Sekolah','DO', 'Skors','Lulus'],
        form: {
          id_sekolah: this.$q.localStorage.getItem('dataUser').id_sekolah,
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
          Foto: null
        },
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "nisn",
            align: "left",
            label: "NISN",
            field: "nisn",
            sortable: true
          },
          { name: "nis", required: true, label: "NIS", align: "left", field: "nis", sortable: true },
          { name: "nama_siswa", required: true, label: "Nama Siswa", align: "left", field: "nama_siswa", sortable: true },
          { name: "tempat_lahir", required: true, label: "Tempat & Tanggal Lahir", align: "left", field: "tempat_lahir", sortable: true },
          { name: "nama_ibu", required: true, label: "Nama Ibu", align: "left", field: "nama_ibu", sortable: true },
          { name: "alamat", required: true, label: "Alamat", align: "left", field: "alamat", sortable: true },
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
      getSiswa (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getSiswa/${id}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
            // console.log(response)
            if (response.data.msg.status === true) {
              this.data = response.data.data
            } else {
              this.data = []
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
        this.$axios.post('inputSiswa/',  formData)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

                this.form.nisn = null
                this.form.nis = null
                this.form.nama_siswa = null
                this.form.jenis_kelamin = null
                this.form.tempat_lahir = null
                this.form.tanggal_lahir = ref('2022/01/01'),
                this.form.agama= null
                this.form.email_siswa = null
                this.form.hp_siswa = null
                this.form.nama_ayah = null
                this.form.nama_ibu = null
                this.form.pekerjaan_ayah = null
                this.form.pekerjaan_ibu = null
                this.form.hp_ayah = null
                this.form.hp_ibu = null
                this.form.alamat = null
                this.form.nama_wali = null
                this.form.pekerjaan_wali = null
                this.form.hp_wali = null
                this.form.tanggal_diterima = ref('2022/01/01')
                this.form.diterima_dikelas = null
                this.form.tahun_ijazah = null
                this.form.tahun_nopes = null
                this.form.no_shun_ijazah = null
                this.form.no_ijazah = null
                this.form.asal_sekolah = null
                this.form.tanggal_masuk = ref('2022/01/01')
                this.form.tanggal_keluar = ref('2022/01/01')
                this.form.anak_ke = null
                this.form.status_siswa = null
                this.form.Foto = null

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
      QRSiswa (data){

        this.modalQR = true
        this.namaQR = data.nama_siswa

        new QRious({
          level: "H",
          padding: 25,
          size: 300,
          element: document.getElementById("qr-code"),
          value: 'S/'+data.id+'/'+this.makeid(4)+'/'+data.nisn
        });

      },
      donwloadCanvas () {
        const canvas = document.getElementsByTagName('canvas')
        const link = document.createElement('a')
        link.download = this.makeid(4)+'-'+this.namaQR+'-ADMQRCode.png'
        link.href = canvas[0].toDataURL()
        link.click()
      },
      detailSiswa(id){
        const ids = btoa(id)
        this.$router.push({name: 'detailsiswa' , params: {id :ids}})

      },
      deleteSiswa (id,foto){

        var url = 'hapusSiswa/'+ btoa(id)+'/'+btoa(foto)
        this.$q.dialog({
          title: 'Konfirmasi',
          message: 'Yakin ingin menghapus data ini?',
          ok: {
            push: true
          },
          cancel: {
            push: true,
            color: 'negative'
          },
          persistent: true
        }).onOk(() => {
          // console.log('>>>> OK')


        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.delete(url)
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

        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })

      },
      makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
        }
        return result;
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
