<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Manajemen Kelas Berjalan</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-tabs
          v-model="KelasBerjalan"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="datakelasberjalan" label="Data Kelas Berjalan" />
          <q-tab name="formkelasberjalan" label="Tambah Kelas Berjalan" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="KelasBerjalan" animated>
          <q-tab-panel name="datakelasberjalan">
            <!--              <div class="text-h6">Mails</div>-->
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

              <template v-slot:body-cell-wali_kelas="props">
                <q-td :props="props">
                  {{props.row.NIP+'-'+props.row.Nama}}
                </q-td>
              </template>

              <template v-slot:body-cell-kelas="props">
                <q-td :props="props" v-if="props.row.kelompok_kelas === null || props.row.kelompok_kelas === '' ">
                  {{props.row.tingkat_kelas +' '+ props.row.nama_kelas}}
                </q-td>
                <q-td :props="props" v-else>
                  {{props.row.tingkat_kelas +' '+ props.row.nama_kelas+' '+ props.row.kelompok_kelas}}

                </q-td>
              </template>

              <template v-slot:body-cell-opsi="props">
                <q-td :props="props">
                  <div class="q-gutter-sm" style="padding-left: 20px;padding-right: 20px">
                    <q-btn outline color="green" size="sm" @click="setJadwal(props.row.id)" icon="assignment">Manajemen Jadwal</q-btn>
                    <q-btn outline color="purple" size="sm" @click="setSiswa(props.row)" icon="group_remove"> Manajemen Siswa</q-btn>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn outline color="blue" size="sm" @click="detailKelasBerjalan(props.row)" icon="receipt_long"> Ubah</q-btn>
<!--                    <q-btn outline color="red" size="sm" @click="deleteKelasBerjalan(props.row.id)" icon="delete_sweep"> Hapus</q-btn>-->
                  </div>
                </q-td>
              </template>

            </q-table>

          </q-tab-panel>

          <q-tab-panel name="formkelasberjalan">
            <q-form @submit="onSubmit">

              <div class="row">
                <div class="col-6">

                  <q-item>
                    <q-select outlined class="full-width" v-model="form.id_ta" :options="taOptions"  label="Pilih Tahun Ajaran" option-value="id"
                              :option-label="opt => Object(opt) === opt && 'tahun_ajaran' in opt ? opt.tahun_ajaran +' - '+ opt.semester : '- Tidak Ada TA Aktif -'"/>
                  </q-item>

                  <q-item>
                    <q-select :options="walikelasOptions"  outlined class="full-width" v-model="form.id_walikelas" label="Wali Kelas" option-value="id"
                              :option-label="opt => Object(opt) === opt && 'Nama' in opt ? opt.NIP +' - '+ opt.Nama : '- Tidak Ada Guru Aktif -'"/>
                  </q-item>

                </div>

                <div class="col-6">

                  <q-item>
                    <q-select :options="klmpkkelasOptions"  outlined class="full-width" v-model="form.id_kelompokkelas" label="Kelompok Kelas" option-value="id"
                              :option-label="opt => Object(opt) === opt && 'tingkat_kelas' in opt ? opt.kelompok_kelas ? opt.tingkat_kelas +'  '+ opt.nama_kelas+' '+opt.kelompok_kelas :  opt.tingkat_kelas +'  '+ opt.nama_kelas : '- Tidak Ada Kelas Aktif -'"/>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.ruang_kelas" label="Ruang Kelas" />
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

  <q-dialog v-model="modalKelasBerjalan">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <!--        <div class="text-h6">Close icon</div>-->
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="simpanEdit">
          <div class="row">
            <div class="col-6">

              <q-item>
                <q-input  outlined class="full-width" v-model="formEdit.ta" label="Tahun Ajaran" readonly />
              </q-item>
              <q-item>
                <q-select :options="walikelasOptions"  outlined class="full-width" v-model="formEdit.id_walikelas" label="Wali Kelas" option-value="id"
                          :option-label="opt => Object(opt) === opt && 'Nama' in opt ? opt.NIP +' - '+ opt.Nama : '- Tidak Ada Guru Aktif -'"/>
              </q-item>


            </div>

            <div class="col-6">

              <q-item>
                <q-input  outlined class="full-width" v-model="formEdit.kelas" label="Kelompok Kelas" readonly />
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="formEdit.ruang_kelas" label="Ruang Kelas" />
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
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script>
  import { ref } from 'vue'

  export default {
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Setting Kelas Berjalan - Absen QR';
        }
      },
    },
    data() {

      return {

        modalKelasBerjalan: ref(false),
        waktu: null,
        dataSekolah: [],
        loading: false,
        KelasBerjalan: ref('datakelasberjalan'),

       taOptions: [ {
           id: null,
           tahun_ajaran: null,
            semester: null,
          }],

        klmpkkelasOptions: [ {
          id: null,
          tingkat_kelas: null,
          nama_kelas: null,
          kelompok_kelas: null,

        }],

        walikelasOptions: [ {
          id: null,
          Nama: null,
          NIP: null,
        }],

        form: {
          id_sekolah: this.$q.localStorage.getItem('dataUser').id_sekolah,
          id_ta: null,
          id_kelompokkelas: null,
          id_walikelas: null,
          ruang_kelas: null,
        },
        formEdit: {
          ta: null,
          kelas: null,
          id_walikelas: null,
          ruang_kelas: null,
        },
        idKelasBerjalan: null,
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "tahun_ajaran",
            align: "left",
            label: "Tahun AJaran",
            field: "tahun_ajaran",
            sortable: true
          },
          { name: "semester", required: true, label: "Semester", align: "left", field: "semester", sortable: true },
          { name: "kelas", required: true, label: "Kelompok Kelas", align: "left", field: "kelas", sortable: true },
          { name: "wali_kelas", required: true, label: "Wali Kelas", align: "left", field: "wali_kelas", sortable: true },
          { name: "ruang_kelas", required: true, label: "Ruang Kelas", align: "left", field: "ruang_kelas", sortable: true },
          { name: "status", required: true, label: "Status", align: "left", field: "status", sortable: true },
          { name: "opsi", required: true, label: "Setting", align: "center", field: "opsi", sortable: true },
          { name: "action", required: true, label: "Action", align: "center", field: "action", sortable: true },
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

      optionsTA(){
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getTahunAjaranAktif/${id}`)
          .then(response => {
            // console.log(response)
            if (response.data.msg.status === true) {
               this.taOptions = response.data.data
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
      optionsWaliKelas(){
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getGuru/${id}`)
          .then(response => {
            // console.log(response)
            if (response.data.msg.status === true) {
              this.walikelasOptions = response.data.data
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
      optionsKelompokKelas () {
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getkelompokkelasAktif/${id}`)
          .then(response => {
            // console.log(response)
            if (response.data.msg.status === true) {
              this.klmpkkelasOptions = response.data.data
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
      getKelasBerjalan(){

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getkelasberjalan/${id}`)
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
        this.form.id_walikelas = this.form.id_walikelas.id
        this.form.id_ta = this.form.id_ta.id
        this.form.id_kelompokkelas = this.form.id_kelompokkelas.id

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.post('inputkelasberjalan/',  this.form)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.form.id_walikelas = null
              this.form.id_ta =null
              this.form.id_kelompokkelas = null
              this.form.ruang_kelas = null

               this.getKelasBerjalan()
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

      detailKelasBerjalan(id){
        this.modalKelasBerjalan = true
        this.formEdit = id
        // this.formEdit.id_walikelas = id.id
        this.formEdit.ta = id.tahun_ajaran+' '+id.semester
        this.formEdit.kelas = id.kelompok_kelas ? id.tingkat_kelas+' '+id.nama_kelas+' '+id.kelompok_kelas : id.tingkat_kelas+' '+id.nama_kelas
        this.idKelasBerjalan = id.id

      },
      setJadwal(id){
        const ids = btoa(id)
        this.$router.push({name: 'jadwal' , params: {id :ids}})

      },
      setSiswa(id){
        const ids = btoa(id.id)
        const status = btoa(id.status)
        const kelas = btoa(id.tahun_ajaran+'-'+id.semester+'-'+id.tingkat_kelas+' '+id.nama_kelas+' '+id.kelompok_kelas)
        this.$router.push({name: 'settsiswa' , params: {id :ids,kelas: kelas, status:status}})

      },
      simpanEdit (){

        if (this.formEdit.id_walikelas == null || this.formEdit.id_walikelas === ''){
          this.$q.notify({
            color: 'negative',
            message: 'Mohon Pilih Wali Kelas',
            icon: 'ion-close'
          })
        }else{

          // console.log(this.idKelasBerjalan)
          // console.log(this.formEdit.ruang_kelas)
          // console.log( this.formEdit.id_walikelas.id)

          this.loading = true
          this.$q.loading.show(this.$loadingStyle)

          this.$axios.put('updatekelasberjalan/'+btoa(this.idKelasBerjalan),  {
            id_walikelas: this.formEdit.id_walikelas.id,
            ruang_kelas: this.formEdit.ruang_kelas
          })
            .finally(() => this.$q.loading.hide())
            .then(res => {
              this.loading = false
              if (res.data.msg.status == true) {
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })

                this.getKelasBerjalan()
                this.modalKelasBerjalan = false
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
      deleteKelas (id){

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

          this.$axios.delete('hapuskelompokkelas/'+ btoa(id))
            .finally(() => this.$q.loading.hide())
            .then(res => {
              this.loading = false
              if (res.data.msg.status == true) {
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })
                this.getKelasBerjalan()
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

      }
    },
    created() {
      this.getKelasBerjalan()
      this.optionsWaliKelas()
      this.optionsKelompokKelas()
      this.optionsTA()
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
