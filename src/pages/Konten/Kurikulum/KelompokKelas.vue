<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Setting Manajemen Kelompok Kelas</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-tabs
          v-model="KelompokKelas"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="datakelas" label="Data Kelompok Kelas" />
          <q-tab name="formkelas" label="Tambah Kelompok Kelas" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="KelompokKelas" animated>
          <q-tab-panel name="datakelas">
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
              <template v-slot:body-cell-kode="props">
                <q-td :props="props" v-if="props.row.kelompok_kelas === null || props.row.kelompok_kelas === '' ">
                  {{props.row.tingkat_kelas +' '+ props.row.nama_kelas}}
                </q-td>
                <q-td :props="props" v-else>
                  {{props.row.tingkat_kelas +' '+ props.row.nama_kelas+' '+ props.row.kelompok_kelas}}

                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn outline color="blue" size="sm" @click="detailKelas(props.row)" icon="receipt_long"> Ubah</q-btn>
                    <q-btn outline color="red" size="sm" @click="deleteKelas(props.row.id)" icon="delete_sweep"> Hapus</q-btn>
                  </div>
                </q-td>
              </template>

            </q-table>

          </q-tab-panel>

          <q-tab-panel name="formkelas">
            <q-form @submit="onSubmit">

              <div class="row">
                <div class="col-6">

                  <q-item>
                    <q-select outlined class="full-width" v-model="form.tingkat_kelas" :options="tingkatkelasOptions" label="Pilih Tingkat Kelas"/>
                  </q-item>
                </div>

                <div class="col-6">

                  <q-item>
                    <q-select :options="kelompokkelasOptions"  outlined class="full-width" v-model="form.kelompok_kelas" label="Kelompok Kelas"/>
                  </q-item>

                </div>

                <div class="col-12">
                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.nama_kelas" label="Masukan Nama Kelas (EX: A, B, IPA, IPS)"  required/>
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

  <q-dialog v-model="modalKelas">
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
                <q-select outlined class="full-width" v-model="formEdit.tingkat_kelas" :options="tingkatkelasOptions" label="Pilih Tingkat Kelas"/>
              </q-item>
            </div>

            <div class="col-6">

              <q-item>
                <q-select :options="kelompokkelasOptions"  outlined class="full-width" v-model="formEdit.kelompok_kelas" label="Kelompok Kelas"/>
              </q-item>

            </div>

            <div class="col-12">
              <q-item>
                <q-input  outlined class="full-width" v-model="formEdit.nama_kelas" label="Masukan Nama Kelas (EX: A, B, IPA, IPS)"  required/>
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
          document.title = to.meta.title || 'Setting Kelompok Kelas - Absen QR';
        }
      },
    },
    data() {

      return {
        modalKelas: ref(false),
        waktu: null,
        dataSekolah: [],
        loading: false,
        KelompokKelas: ref('datakelas'),

        tingkatkelasOptions: ['I', 'II', 'III' , 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
        kelompokkelasOptions:  [''].reduce((acc) => {
                  for (let i = 1; i <= 20; i++) {
                    acc.push(i)
                  }
                  return acc
               }, []),
        form: {
          id_sekolah: this.$q.localStorage.getItem('dataUser').id_sekolah,
          tingkat_kelas: null,
          nama_kelas: null,
          kelompok_kelas: null,

        },
        formEdit: {
          tahun_ajaran: null,
          semester: null,
          status: null,
        },
        idKelas: null,
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "tingkat_kelas",
            align: "left",
            label: "Tingkat Kelas",
            field: "tingkat_kelas",
            sortable: true
          },
          { name: "nama_kelas", required: true, label: "Nama Kelas", align: "left", field: "nama_kelas", sortable: true },
          { name: "kelompok_kelas", required: true, label: "Kelompok Kelas", align: "left", field: "kelompok_kelas", sortable: true },
          { name: "kode", required: true, label: "Kode Kelas", align: "left", field: "kode", sortable: true },
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
      getKelas(){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getkelompokkelas/${id}`)
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

        this.$axios.post('inputkelomokkelas/',  this.form)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.form.kelompok_kelas = null
              this.form.nama_kelas = null
              this.form.tingkat_kelas = null

              this.getKelas()
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

      detailKelas(id){
        this.modalKelas = true
        this.formEdit = id
        this.idKelas = id.id
        // console.log(this.idTA)
      },
      simpanEdit (){

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.put('updateKelompokKelas/'+btoa(this.idKelas),  this.formEdit)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.getKelas()
              this.modalKelas = false
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
                this.getKelas()
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
      this.getKelas()
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
