<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Anda Memiliki {{jmlhg}} Jadwal Mengajar Hari Ini</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
    </div>
    <div v-if="jmlhg > 0"  class="row">
      <div class="col-md-4">
        <div class="q-px-lg q-pb-md">
          <q-timeline color="secondary">

            <q-timeline-entry v-for="(jadwalg, i) in listjadwalguru" :key="i"
              :title="jadwalg.kelompok_kelas ? jadwalg.tingkat_kelas +' '+ jadwalg.nama_kelas+' '+jadwalg.kelompok_kelas :  jadwalg.tingkat_kelas +' '+ jadwalg.nama_kelas"
              :subtitle=waktu
              icon="checklist"
            >
              <div>
                Mata Pelajaran : <b>{{jadwalg.nama_mapel}}</b><br />Jam Mulai : {{jadwalg.jam_mulai}} WIB<br />Jam Selesai: {{jadwalg.jam_selesai}} WIB
                <br /> <q-btn size="sm" @click="cekAbsenSiswa(jadwalg.id,jadwalg.tingkat_kelas +'-'+ jadwalg.nama_kelas+'-'+jadwalg.kelompok_kelas)" outline color="teal" label="Lihat Kehadiran Siswa" />
              </div>
            </q-timeline-entry>



          </q-timeline>
        </div>
      </div>
      <div class="col-md-8">

        <div style="padding-top: 30px; padding-right: 20px">
          <q-table
            v-show="showtable"
            class="my-sticky-header-column-table"
            :title="'Daftar Kehadiran Siswa Kelas '+tkelas"
            :rows="data"
            flat
            bordered
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

            <template v-slot:body-cell-kehadiran="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.kehadiran == 'Hadir'?'green': props.row.kehadiran == 'Alpha'?'red': props.row.kehadiran == 'Belum Absen'?'gray':'orange'"
                  text-color="white"
                  dense
                  class="text-weight-bolder"
                  square
                >
                {{props.row.kehadiran}}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn-group outline>
                  <div class="q-gutter-sm">
                    <q-btn outline color="green" @click="ManualAbsen(props.row,'Hadir')" size="sm" >Hadir</q-btn>
                    <q-btn outline color="orange" @click="ManualAbsen(props.row,'Sakit')" size="sm" >Sakit</q-btn>
                    <q-btn outline color="brown" @click="ManualAbsen(props.row,'Izin')" size="sm" >Izin</q-btn>
                    <q-btn outline color="red" @click="ManualAbsen(props.row,'Alpha')" size="sm" >Alpha</q-btn>
                    <q-btn outline color="purple" @click="ManualAbsen(props.row,'Dispensasi')" size="sm" >Dispensasi</q-btn>
                  </div>
                </q-btn-group>
              </q-td>
            </template>

          </q-table>
        </div>

      </div>
    </div>

    <div v-else class="row">
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
        hari: null,
        loading: false,
        jmlhg: null,
        showtable: false,
        tkelas: null,
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
          { name: "nama_siswa", required: true, label: "Nama Siswa", align: "left", field: "nama_siswa", sortable: true },
          { name: "kehadiran", required: true, label: "Status Kehadiran", align: "left", field: "kehadiran", sortable: true },
          { name: "action", required: true, label: "Ubah/Manual Presensi", align: "left", field: "action", sortable: true },

        ],
        listjadwalguru: [],
        data: []
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
        this.hari = thisDay
      },

      getjadwalguru (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_relasi)
        const ids = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getjadwalguru/${id}/${ids}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
            //  console.log(response)
            if (response.data.msg.status === true) {

              this.listjadwalguru = response.data.data
              this.jmlhg =  this.listjadwalguru.length

            } else {
              this.listjadwalguru = null
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
      cekAbsenSiswa (id, kelas) {

        var a = kelas.split('-')
       var s = a[0]+' '+a[1]+' '+a[2]
       // console.log(a[2])
        this.tkelas = s.replace(null, " ");

        this.showtable = true
        const idk = btoa(id)

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.get(`guru_cekabsen/${idk}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
           //   console.log(response)
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
      ManualAbsen (data,status){

       if (data.io === 0){
         //insert absen

         this.loading = true
         this.$q.loading.show(this.$loadingStyle)

         this.$axios.post(`guru_inputabsen/`,{
           id_kelasberjalan: data.idkelasberjalan,
           id_siswa: data.id_siswa,
           kehadiran: status,
           hari: this.hari
         })
           .finally(() => this.$q.loading.hide())
           .then(response => {
             this.loading = false

             if (response.data.msg.status === true) {

               this.cekAbsenSiswa(data.idkelasberjalan,this.tkelas+'--')

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

       }else{
         //update absen


         this.loading = true
         this.$q.loading.show(this.$loadingStyle)

         const ids = btoa(data.id_siswa)
         const idk = btoa(data.idkelasberjalan)

         this.$axios.put(`guru_ubahabsen/${ids}/${idk}`,{
           kehadiran: status,
         })
           .finally(() => this.$q.loading.hide())
           .then(response => {
             this.loading = false

             if (response.data.msg.status === true) {

               this.cekAbsenSiswa(data.idkelasberjalan,this.tkelas+'--')

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

       }

      }

    },
    created() {
      this.tanggal()
      this.getjadwalguru()

    }
  }
</script>

<style scoped>

</style>
