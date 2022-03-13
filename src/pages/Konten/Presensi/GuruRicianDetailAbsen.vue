<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Detail Presensi {{namaguru}} </strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-card-section>
          <div class="q-pa-md">
            <div class="q-gutter-md row">

              <q-input outlined v-model="tanggalmulai"  style="width: 44%" mask="date" :rules="['tanggalmulai']" label="Dari Tanggal">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="tanggalmulai">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input outlined v-model="tanggalakhir"  style="width: 44%" mask="date" :rules="['tanggalakhir']" label="Sampai Tanggal">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="tanggalakhir">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>


              <div>
                <q-btn size="md" outline style="height: 57px" @click="filterTanggal()" label="Pilih" type="button" color="primary"/>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="my-card" flat bordered>
        <q-item>


          <q-item-section>
            <q-item-label>Total Kehadiran (Sesuai Tanggal Terpilih) : {{total}}</q-item-label>
<!--            <q-item-label caption>-->
<!--              Subhead-->
<!--            </q-item-label>-->
          </q-item-section>
        </q-item>
      </q-card>


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
          document.title = to.meta.title || 'Detail Presensi - Absen QR';
        }
      },
    },
    data() {
      return {
        namaguru: atob(this.$route.params.namaguru),
        waktu: null,
        loading: false,
        tanggalmulai: '',
        tanggalakhir: '',
        total: 0,
        model: ref(null),
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          { name: "hadir", required: true, label: "Hadir", align: "left", field: "Hadir", sortable: true },
          { name: "sakit", required: true, label: "Sakit", align: "left", field: "Sakit", sortable: true },

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
        var xb = date.getMonth()+1
        var bulan
        if(xb > 9){
          bulan = xb
        }else{
          bulan = '0'+xb
        }

        this.tanggalmulai = year+'/'+bulan+'/'+'1'
        this.tanggalakhir = year+'/'+bulan+'/'+day

        this.waktu = thisDay + ', ' + day + ' ' + months[month] + ' ' + year
      },
      filterTanggal(){


        const tglm = btoa(this.tanggalmulai)
        const tgla = btoa(this.tanggalakhir)
        const id = this.$route.params.id

        this.$axios.get(`guru_rekapabsen_rinci/${id}/${tglm}/${tgla}`)
          .then(response => {

            this.total =   response.data.data.length
            this.datadetail = response.data.data
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
        const id = this.$route.params.id

        this.$axios.get(`rekapabsensiswa/${id}`)
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
            message: 'Gagal Terhubung X01',
            icon: 'ion-close'
          })
        })

      },

      getDetail_guru (){

        const id = this.$route.params.id

        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth();
        var yy = date.getYear();
        var year = (yy < 1000) ? yy + 1900 : yy;

        var xb = date.getMonth()+1
        var bulan
        if(xb > 9){
          bulan = xb
        }else{
          bulan = '0'+xb
        }

      //  console.log(id)

        this.tanggalmulai = year+'/'+bulan+'/'+'1'
        this.tanggalakhir = year+'/'+bulan+'/'+day

        const tglm = btoa(this.tanggalmulai)
        const tgla = btoa(this.tanggalakhir)

        this.$axios.get(`guru_rekapabsen_rinci/${id}/${tglm}/${tgla}`)
          .then(response => {
          this.total =   response.data.data.length
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
      this.getrekapabsen_siswa()
      this.getDetail_guru()



    }
  }
</script>

<style lang="sass">
  .my-sticky-column-table2
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


