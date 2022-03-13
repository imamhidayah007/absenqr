<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Data Guru dan Staff</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-tabs
          v-model="guru"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="isidata" label="Data Guru dan Staff" />
          <q-tab name="inputdata" label="Tambah Data Guru dan Staff" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="guru" animated>
          <q-tab-panel name="isidata">
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

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn outline color="purple" size="sm" @click="QRGuru(props.row)" icon="select_all"> QR Code Guru</q-btn>
                    <q-btn outline color="blue" size="sm" @click="detailGuru(props.row.id)" icon="receipt_long"> Detail</q-btn>
                    <q-btn outline color="red" size="sm" @click="deleteGuru(props.row.id,props.row.Foto)" icon="delete_sweep"> Hapus</q-btn>
                  </div>
                </q-td>
              </template>

            </q-table>

          </q-tab-panel>

          <q-tab-panel name="inputdata">
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
        modalQR: false,
        namaQR: '',
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
          id_sekolah: this.$q.localStorage.getItem('dataUser').id_sekolah,
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
          Foto: null
        },
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "NIP",
            align: "left",
            label: "NIP",
            field: "NIP",
            sortable: true
          },
          { name: "Nama", required: true, label: "Nama Guru / Staff", align: "left", field: "Nama", sortable: true },
          { name: "Telepon", required: true, label: "Telepon / HP", align: "left", field: "Telepon", sortable: true },
          { name: "Email", required: true, label: "Email", align: "left", field: "Email", sortable: true },
          { name: "Alamat", required: true, label: "Alamat", align: "left", field: "Alamat", sortable: true },
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
      QRGuru (data){

        this.modalQR = true
        this.namaQR = data.Nama

        new QRious({
          level: "H",
          padding: 25,
          size: 300,
          element: document.getElementById("qr-code"),
          value: 'G/'+data.id+'/'+this.makeid(4)+'/'+data.nisn
        });

      },
      donwloadCanvas () {
        const canvas = document.getElementsByTagName('canvas')
        const link = document.createElement('a')
        link.download = this.makeid(4)+'-'+this.namaQR+'-ADMQRCode.png'
        link.href = canvas[0].toDataURL()
        link.click()
      },
      getGuru (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getGuru/${id}`)
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
        this.$axios.post('inputGuru/',  formData)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })
                this.form.NIP= null
                this.form.NIK = null
                this.form.Nama = null
                this.form.Agama = null
                this.form.Tempat_Lahir = null
                this.form.Tanggal_Lahir = ref('2022/01/01'),
                this.form.Jenis_Kelamin =null
                this.form.Alamat = null
                this.form.Telepon = null
                this.form.Email = null
                this.form.Jabatan = null
                this.form.Pangkat = null
                this.form.Golongan = null
                this.form.NUPTK = null
                this.form.Status_Marital = null
                this.form.Gol_Darah = null
                this.form.Gelar_Depan = null
                this.form.Gelar_Belakang = null
                this.form.Tahun_Masuk = null
                this.form.Jabatan_Sekolah = null
                this.form.NIY = null
                this.form.Status_Guru = null
                this.form.Sertifikasi = null
                this.form.Foto = null

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
      detailGuru (id){
        const idg = btoa(id)
        this.$router.push({name: 'detailguru' , params: {id :idg}})
      },
      deleteGuru (id,foto){

        var url = 'hapusGuru/'+btoa(id)+'/'+btoa(foto)

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
