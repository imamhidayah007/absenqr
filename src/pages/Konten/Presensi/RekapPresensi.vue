<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Rekap Presensi Siswa </strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-card-section>
          <div class="q-pa-md">
            <div class="q-gutter-md row">
<!--              <q-select-->
<!--                outlined-->
<!--                v-model="formFilter.kelas"-->
<!--                label="Tingkat Kelas"-->
<!--                :options="Kelas"-->
<!--                style="width: 48%"-->
<!--                behavior="menu"-->
<!--              />-->

                <q-select outlined v-model="formFilter.ta" :options="TAOptions"  label="Pilih Tahun Ajaran" option-value="id" style="width: 98%" behavior="menu"
                          @update:model-value="filterTA()" :option-label="opt => Object(opt) === opt && 'tahun_ajaran' in opt ? opt.tahun_ajaran +' - '+ opt.semester : '- Tidak Ada TA -'"/>

            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-table
        class="my-sticky-column-table"
        title="Daftar Kelas"
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


        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn size="sm" outline color="primary" @click="ViewDetailRekap(props.row)" label="Detail Kehadiran" />
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
        ta: null,
        semester: null,
        model: ref(null),
        formFilter: {
          kelas: null,
          ta: null
        },
        TAOptions: [{
          id: null,
          tahun_ajaran: null,
          semester: null,
        }],
        Kelas: ['I', 'II', 'III' , 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "tahun_ajaran",
            align: "left",
            label: "Tahun Ajaran",
            field: "tahun_ajaran",
            sortable: true
          },
          { name: "semester", required: true, label: "Semester", align: "left", field: "semester", sortable: true },
          { name: "kelas", required: true, label: "Kelas", align: "left", field: "kelas", sortable: true },
          { name: "wali_kelas", required: true, label: "Wali Kelas", align: "left", field: "Nama", sortable: true },
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
      ViewDetailRekap (data) {

        const idx = btoa(data.id)
        const datakelas = btoa(data.tahun_ajaran+'-'+data.semester+'-'+data.tingkat_kelas+' '+data.nama_kelas+' '+data.kelompok_kelas)
        this.$router.push({name: 'rekapkehadiransiswa' , params: {id :idx,data: datakelas}})


      },
      filterTA(){

        const id = btoa(this.formFilter.ta.id)

       // console.log(id)

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        const ids = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)


        this.$axios.get(`getkelasberjalanbyta/${id}/${ids}`)
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

      },
      OptionsTA(){
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getTahunAjaran/${id}`)
          .then(response => {
            // console.log(response)
            if (response.data.msg.status === true) {
              this.TAOptions = response.data.data
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
    },
    created() {
      this.tanggal()
      this.getTAAktif()
      this.OptionsTA()
      this.getKelasBerjalan()
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
