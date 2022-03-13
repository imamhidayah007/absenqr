<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Rekap Presensi Kelas | TA. {{rta+' '+rsemester}}</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-table
        class="my-sticky-column-table"
        :title="'Daftar Kelas Yang Diajar TA. '+rta+' '+rsemester"
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

        <template v-slot:body-cell-kelas="props">
          <q-td :props="props" v-if="props.row.kelompok_kelas === null || props.row.kelompok_kelas === '' ">
            {{props.row.tingkat_kelas +' '+ props.row.nama_kelas}}
          </q-td>
          <q-td :props="props" v-else>
            {{props.row.tingkat_kelas +' '+ props.row.nama_kelas+' '+ props.row.kelompok_kelas}}

          </q-td>
        </template>

        <template v-slot:body-cell-Nama_Walikelas="props">
          <q-td :props="props">
            {{props.row.NIP_WaliKelas+'-'+props.row.Nama_Walikelas}}
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn outline color="primary" size="sm"  @click="ViewDetailRekapG(props.row)" label="Detail Kehadiran" />
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
        TAOptions: ['2021 Gajil', '2021 Genap'],
        Kelas: ['I', 'II' ,'III' , 'IV', 'V', 'VI'],
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          { name: "kelas", required: true, label: "Kelas", align: "left", field: "kelas", sortable: true },
          { name: "mapel", required: true, label: "Mapel", align: "left", field: "nama_mapel", sortable: true },
          { name: "Nama_Walikelas", required: true, label: "Wali Kelas", align: "left", field: "Nama_Walikelas", sortable: true },
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
      ViewDetailRekapG (data) {

        const idx = btoa(data.id)
        const datakelas = btoa(data.tahun_ajaran+'-'+data.semester+'-'+data.tingkat_kelas+' '+data.nama_kelas+' '+data.kelompok_kelas)
        const  mapel= btoa(data.nama_mapel)
        this.$router.push({name: 'guru_rekapkehadiransiswa' , params: {id :idx,data: datakelas,mapel: mapel}})


      },
      getTAAktif (){
        const ids = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getTahunAjaranAktif/${ids}`)
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
      getjadwalrekap (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_relasi)
        const ids = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getjadwalrekap/${id}/${ids}`)
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
    },
    created() {
      this.tanggal()
      this.getTAAktif()
      this.getjadwalrekap()
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
