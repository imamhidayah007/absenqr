<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Jadwal Pelajaran {{$q.localStorage.getItem('dataUser').nama}} | TA. {{ta+' '+semester}}</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />
      <q-table
        class="my-sticky-column-table"
        title="Jadwal Pelajaran"
        flat
        bordered
        :rows="data"
        :columns="columns"
        row-key="nisn"
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
          document.title = to.meta.title || 'Jadwal Mengajar - Absen QR';
        }
      },
    },
    data() {
      return {
        waktu: null,
        loading: false,
        ta: null,
        semester: null,
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "hari",
            align: "left",
            label: "Hari",
            field: "hari",
            sortable: true
          },
          { name: "mapel", required: true, label: "Mata Pelajaran", align: "left", field: "nama_mapel", sortable: true },
          { name: "guru", required: true, label: "Nama Guru", align: "left", field: "Nama_guru_mapel", sortable: true },
          { name: "jammulai", required: true, label: "Jam Mulai", align: "left", field: "jam_mulai", sortable: true },
          { name: "jamselesai", required: true, label: "Jam Selesai", align: "left", field: "jam_selesai", sortable: true },

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

      getjadwalsiswafull (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_relasi)

        this.$axios.get(`getjadwalsiswafull/${id}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
            //  console.log(response)
            if (response.data.msg.status === true) {

              this.data = response.data.data

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
            message: 'Gagal Terhubung',
            icon: 'ion-close'
          })
        })

      },
      getTAAktif (){
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getTahunAjaranAktif/${id}`)
          .then(response => {

            if (response.data.msg.status === true) {

              this.ta = response.data.data[0].tahun_ajaran
              this.semester = response.data.data[0].semester

            } else {

              this.ta = null,
                this.semester = null,

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

      }


    },
    created() {
      this.tanggal()
      this.getTAAktif()
      this.getjadwalsiswafull()

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
      background-color: #f5f5dc

    th:first-child,
    td:first-child
      position: sticky
      left: 0
      z-index: 1
</style>
