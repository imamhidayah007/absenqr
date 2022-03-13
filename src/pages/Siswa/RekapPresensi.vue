<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Rekap Presensi {{$q.localStorage.getItem('dataUser').nama}} | TA. {{rta+' '+rsemester}}</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />


      <q-table
        class="my-sticky-column-table"
        title="Rekap Kehadiran Siswa"
        flat
        bordered
        :rows="data"
        :columns="columns"

      >

      </q-table>


      <q-table
        title="Detail Kehadiran"
        flat
        bordered
        :rows="datadetail"
        :columns="columnsdetail"
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

        <template v-slot:body-cell-tgl_absen="props">
          <q-td :props="props">
            {{new  Date(props.row.tgl_absen).getDate()+'-'+(new  Date(props.row.tgl_absen).getUTCMonth()+1)+'-'+new  Date(props.row.tgl_absen).getUTCFullYear()}}
          </q-td>
        </template>

        <template v-slot:body-cell-kehadiran="props">
          <q-td :props="props" :style="props.row.kehadiran == 'Hadir' ? 'background-color: #B1FAD1' :props.row.kehadiran == 'Alpha' ? 'background-color: #F78773' : 'background-color: #F9D669' ">
          {{props.row.kehadiran}}
          </q-td>
        </template>

      </q-table>



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
          document.title = to.meta.title || 'Rekap Presensi - Absen QR';
        }
      },
    },
    data() {
      return {
        waktu: null,
        loading: false,
        rta: null,
        rsemester: null,
        model: ref(null),
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          { name: "hadir", required: true, label: "Hadir", align: "left", field: "Hadir", sortable: true },
          { name: "sakit", required: true, label: "Sakit", align: "left", field: "Sakit", sortable: true },
          { name: "izin", required: true, label: "Izin", align: "left", field: "Izin", sortable: true },
          { name: "alpha", required: true, label: "Alpha", align: "left", field: "Alpha", sortable: true },
          { name: "dispensasi", required: true, label: "Dispensasi", align: "left", field: "Dispensasi", sortable: true },

        ],
        data : [],

        columnsdetail: [
          { name: "tgl_absen", required: true, label: "Tanggal", align: "left", field: "tgl_absen", sortable: true },
          { name: "hari", required: true, label: "Hari", align: "left", field: "hari", sortable: true },
          { name: "kehadiran", required: true, label: "Status Kehadiran", align: "left", field: "kehadiran", sortable: true },

        ],
        datadetail : []
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

      getTAAktif (){
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getTahunAjaranAktif/${id}`)
          .then(response => {

            if (response.data.msg.status === true) {

              this.rta = response.data.data[0].tahun_ajaran
              this.rsemester = response.data.data[0].semester

            } else {

              this.rta = null,
                this.rsemester = null,

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

      getrekapabsen_siswa (){

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_relasi)


        this.$axios.get(`rekapabsensiswa/${id}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
            //  console.log(response)
            if (response.data.msg.status === true) {

              this.data = response.data.data
              if (response.data.data.length > 0) {
                this.getDetail(response.data.data[0].id_kelasberjalan)
              }
            } else {
              this.data = null
              this.$q.notify({
                color: 'negative',
                message: response.data.msg.msg,
                icon: 'ion-close'
              })
            }
          }).catch(() => {
          this.$q.notify({
            color: 'negative',
            message: 'Gagal Terhubung X01',
            icon: 'ion-close'
          })
        })

      },

      getDetail (idkelas){

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_relasi)
        const idk = btoa(idkelas)

        this.$axios.get(`detailrekapabsensiswa/${id}/${idk}`)
          .then(response => {

           //console.log(response)
          this.datadetail = response.data.data
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
      this.tanggal()
      this.getTAAktif()
      this.getrekapabsen_siswa()

    }
  }
</script>

<style lang="sass">
  .my-sticky-column-table
    /* specifying max-width so the example can
      highlight the sticky column on any browser window */

    thead tr:first-child th:first-child
      /* bg color is important for th; just specify one */
      background-color: #fff

    td:first-child
      background-color: #B1FAD1

    th:first-child,
    td:first-child
      position: sticky
      left: 0
      z-index: 1
</style>


