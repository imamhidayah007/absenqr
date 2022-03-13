<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Setting Siswa {{jTA +' '+jSemester+' Kelas '+jKelas}}</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-tabs
          v-model="SetSiswa"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="datasiswa" label="Data Siswa" />
          <q-tab name="formsiswa" label="Tambah Siswa" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="SetSiswa" animated>
          <q-tab-panel name="datasiswa">
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
                <q-td :props="props">
                  {{props.row.tingkat_kelas +' '+ props.row.nama_kelas +' '+ props.row.kelompok_kelas}}
                </q-td>
              </template>

              <template v-slot:body-cell-Nama_guru_mapel="props">
                <q-td :props="props">
                  {{props.row.NIP_guru_mapel+' - '+props.row.Nama_guru_mapel}}
                </q-td>
              </template>

              <template v-slot:body-cell-nama_mapel="props">
                <q-td :props="props">
                  {{props.row.kode_mapel+' - '+props.row.nama_mapel}}
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <!--                    <q-btn outline color="blue" size="sm" @click="detailMapel(props.row)" icon="receipt_long"> Ubah</q-btn>-->
                    <q-btn v-if="statusta === 'Aktif'" outline color="red" size="sm" @click="deleteSetSiswa(props.row)" icon="delete_sweep"> Hapus</q-btn>
                    <q-btn disable v-else outline color="blue" size="sm"  icon="thumb_up_off_alt"> </q-btn>
                  </div>
                </q-td>
              </template>

            </q-table>

          </q-tab-panel>

          <q-tab-panel name="formsiswa">

            <q-table
              class="my-sticky-column-table"
              flat
              bordered
              :rows="datalistSiswa"
              :columns="columnslistSiswa"
              row-key="idSiswa"
              :filter="filterSiswa"
              :pagination="paginationSiswa"
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
                    <q-btn v-if="props.row.status == false" outline color="purple" size="sm" @click="pilihSiswa(props.row.id)" icon="ads_click"> &emsp;Pilih Siswa</q-btn>
                    <q-badge v-if="props.row.status == true" outline color="teal"><q-icon name="done_all" />&emsp;Siswa Telah Tepilih</q-badge>
                  </div>
                </q-td>
              </template>

            </q-table>

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
          document.title = to.meta.title || 'Setting Siswa - Absen QR';
        }
      },
    },
    data() {

      var info = atob(this.$route.params.kelas)
      var splitinfo = info.split('-')
      var kelas = splitinfo[2].replace(null, ' ');
      return {
        modalMapel: ref(false),
        waktu: null,
        dataSekolah: [],
        loading: false,
        SetSiswa: ref('datasiswa'),

        jTA: splitinfo[0],
        jKelas: kelas,
        jSemester: splitinfo[1],

        statusta: atob(this.$route.params.status),

        group: ref([]),
        optionsSiswa: [
          { label: 'Battery too low', value: 'bat' },
          { label: 'Friend request', value: 'friend', color: 'green' },
          { label: 'Picture uploaded', value: 'upload', color: 'red' }
        ],


        idMapel: null,
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        filterSiswa: '',
        paginationSiswa: {
          rowsPerPage: 100
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
          { name: "action", required: true, label: "Action", align: "left", field: "action", sortable: true },
        ],
        data : [],

        columnslistSiswa: [
          {
            name: "nisn",
            align: "left",
            label: "NISN",
            field: "nisn",
            sortable: true
          },
          { name: "nis", required: true, label: "NIS", align: "left", field: "nis", sortable: true },
          { name: "nama_siswa", required: true, label: "Nama Siswa", align: "left", field: "nama_siswa", sortable: true },
          { name: "action", required: true, label: "Action", align: "left", field: "action", sortable: true },
        ],
        datalistSiswa : []
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

      getSetSiswa(){

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.get(`getsetsiswa/${this.$route.params.id}`)
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

      getListSiswa(){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.get(`daftardatasiswa/${this.$route.params.status}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
            // console.log(response)
            if (response.data.msg.status === true) {
              this.datalistSiswa = response.data.data


            } else {
              this.datalistSiswa = []
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

      pilihSiswa (data){


        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.post(`inputsetSiswa`, {
          id_kelasberjalan: atob(this.$route.params.id),
          id_siswa: data
        })
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
            if (response.data.msg.status === true) {
              this.$q.notify({
                color: 'positive',
                message: response.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.getSetSiswa()
              this.getListSiswa()


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
      deleteSetSiswa (data){

       // console.log(data)
        const ids = btoa(data.id_siswa )
        const  idk = btoa(data.idkelasberjalan)
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

          this.$axios.delete('hapussetsiswa/'+ ids+'/'+idk)
            .finally(() => this.$q.loading.hide())
            .then(res => {
              this.loading = false
              if (res.data.msg.status == true) {
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })
                this.getSetSiswa()
                this.getListSiswa()
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

      this.getSetSiswa()
      this.getListSiswa()
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
