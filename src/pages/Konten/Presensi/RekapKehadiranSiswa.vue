<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Rekap Kehadiran Siswa | TA. {{jTA +' '+jSemester+' Kelas '+jKelas}}</strong>
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

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="(props.row.status == 'Hadir')?'green':(props.row.status == 'Sakit')?'blue':(props.row.status == 'Alpha'?'red':'purple')"
              text-color="white"
              dense
              class="text-weight-bolder"
              square
            >
              {{props.row.status}}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn outline color="primary" size="sm"  @click="detailabsen(props.row)" label="Detail Kehadiran" />
            </div>
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
          document.title = to.meta.title || 'Rekap Kehadiran Siswa - Absen QR';
        }
      },
    },
    data() {
      var info = atob(this.$route.params.data)
      var splitinfo = info.split('-')
      var kelas = splitinfo[2].replace(null, ' ');

      return {
        waktu: null,
        loading: false,
        jTA: splitinfo[0],
        jKelas: kelas,
        jSemester: splitinfo[1],
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
          { name: "nama_siswa", required: true, label: "Nama", align: "left", field: "nama_siswa", sortable: true },
          { name: "hadir", required: true, label: "Hadir", align: "left", field: "Hadir", sortable: true },
          { name: "sakit", required: true, label: "Sakit", align: "left", field: "Sakit", sortable: true },
          { name: "izin", required: true, label: "Izin", align: "left", field: "Izin", sortable: true },
          { name: "alpha", required: true, label: "Alpha", align: "left", field: "Alpha", sortable: true },
          { name: "dispensasi", required: true, label: "Dispensasi", align: "left", field: "Dispensasi", sortable: true },
          { name: "total", required: true, label: "Total", align: "left", field: "Total", sortable: true },
          { name: "action", required: true, label: "Action", align: "left", field: "action", sortable: true },
        ],
        data : []
      }
    },
    methods: {

      tanggal() {
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
      getRekapAbsen(){

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        const idk = this.$route.params.id

        this.$axios.get(`admrekapabsenkelas/${idk}`)
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
                message: 'GAGAL MEMUAT',
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
      detailabsen (data){

        const ids = btoa(data.id_siswa)
        const  nama = btoa(data.nama_siswa)
        this.$router.push({name: 'detailabsen' , params: {id :ids,namasiswa: nama}})

      }

    },
    created() {
      this.tanggal()
      this.getRekapAbsen()
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
