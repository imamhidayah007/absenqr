<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner v-if="jmlh > 0" inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Anda Memiliki {{jmlh}} Jadwal Pelajaran Hari Ini</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
    </div>
    <div v-if="jmlh > 0" class="row">
      <div class="col-md-4">
        <div class="q-px-lg q-pb-md">
          <q-timeline color="secondary">

            <q-timeline-entry  v-for="(jadwal, i) in listJadwal" :key="i"
              :title="jadwal.nama_mapel"
              :subtitle= waktu
              icon="checklist"
            >
              <div>
                Nama Guru : <b>{{jadwal.Nama_guru_mapel}}</b><br />Jam Mulai : {{jadwal.jam_mulai}} WIB<br />Jam Selesai: {{jadwal.jam_selesai}} WIB

              </div>
            </q-timeline-entry>

          </q-timeline>
        </div>
      </div>
      <div class="col-md-8">

        <div style="padding-right: 20px; text-align: center">
          <q-img style="width: 70%"
                 src="~assets/absenhd.png"
          />

          <q-banner dense inline-actions class="text-white bg-grey" v-if="cekabsensi == 404">
            Kamu Belum Melakukan Presensi Hari Ini, Mohon Scan QR Presensi Terlebih Dahulu. Terimakasih.
<!--            <template v-slot:action>-->
<!--              <q-btn flat color="white" label="Turn ON Wifi" />-->
<!--            </template>-->
          </q-banner>
          <q-banner dense inline-actions class="text-white bg-blue" v-if="cekabsensi == 200">
            Status Kehadiranmu pada hari ini <b>{{kehadiran}}</b>. Terimakasih.
          </q-banner>

        </div>

      </div>
    </div>

    <div class="row" v-else>
      <div class="col-md-12">

        <div style="padding-top: 50px; text-align: center">
          <q-img :style="$q.screen.lt.md ? 'width: 80%' : 'width: 40%'"
                 src="~assets/emptyjadwal.png"
          />
        </div>
        <div style="padding-top: 25px;" align="center">
          <q-banner :style="$q.screen.lt.md ? 'width: 80%' : 'width: 30%'" dense inline-actions class="text-white bg-purple">
            Tidak Ada Jadwal Untuk Hari Ini. Terimakasih.
            <!--            <template v-slot:action>-->
            <!--              <q-btn flat color="white" label="Turn ON Wifi" />-->
            <!--            </template>-->
          </q-banner>
        </div>
      </div>


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
          document.title = to.meta.title || 'Presensi Harian - Absen QR';
        }
      },
    },
    data() {
      return {
        waktu: null,
        jmlh: null,
        loading: false,
        listJadwal : [],
        cekabsensi: null,
        kehadiran: null
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

      getJadwalSiswa (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_relasi)

        this.$axios.get(`getjadwalsiswa/${id}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
           //  console.log(response)
            if (response.data.msg.status === true) {

              this.listJadwal = response.data.data
              this.jmlh = this.listJadwal.length

            } else {
              this.listJadwal = null
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
      cekAbsen (){

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_relasi)

        this.$axios.get(`cekabsensi/${id}`)
          .then(response => {

            if (response.data.msg.status === true) {

              this.cekabsensi = 200
              this.kehadiran = response.data.data.kehadiran

            } else {
              this.cekabsensi = 404

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
      this.getJadwalSiswa()
      this.cekAbsen()
    }
  }
</script>

<style scoped>

</style>
