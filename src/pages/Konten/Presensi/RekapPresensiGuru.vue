<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Data Rekap Presensi Guru dan Staff</strong>
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

<!--              <q-date-->
<!--                @update:model-value="filterTanggalMulai()"-->
<!--                v-model="tanggalmulai"-->
<!--                today-btn-->
<!--              />-->

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

<!--              <q-date-->
<!--                @update:model-value="filterTanggalSelesai()"-->
<!--                v-model="tanggalakhir"-->
<!--                today-btn-->
<!--              />-->

              <div>
                <q-btn size="md" outline style="height: 57px" @click="filterTanggalSelesai()" label="Pilih" type="button" color="primary"/>
              </div>

            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-tabs
          v-model="guru"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="isidata" label="Data Rekap Presensi Guru dan Staff" />

        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="guru" animated>
          <q-tab-panel name="isidata">
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

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn outline color="blue" style="width: 130px" size="sm" @click="detailguru_presensi(props.row)" icon="receipt_long"> Detail Rekap</q-btn>
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
  import QRious from "qrious";
  export default {
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Data Guru dan Staff - Absen QR';
        }
      },
    },
    data() {
      return {
        modalQR: false,
        namaQR: '',
        waktu: null,
        dataSekolah: [],
        loading: false,

        guru: ref('isidata'),
        tanggalmulai: '',
        tanggalakhir: '',

        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "NIP",
            align: "left",
            label: "NIP",
            field: "NIP",
            sortable: true
          },
          { name: "Nama", required: true, label: "Nama Guru / Staff", align: "left", field: "Nama", sortable: true },
          { name: "Telepon", required: true, label: "Telepon / HP", align: "left", field: "Telepon", sortable: true },
          { name: "Email", required: true, label: "Email", align: "left", field: "Email", sortable: true },
          { name: "total", required: true, label: "Jumlah Kehadiran", align: "left", field: "Total", sortable: true },
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
      filterTanggalMulai (){

      },
      filterTanggalSelesai (){

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)
        const tglm = btoa(this.tanggalmulai)
        const tgla = btoa(this.tanggalakhir)

        console.log(this.tanggalmulai)
        console.log(this.tanggalakhir)

        this.$axios.get(`guru_rekapabsen_all/${id}/${tglm}/${tgla}`)
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
      getRekapAbsenGuru (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

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

        this.tanggalmulai = year+'/'+bulan+'/'+'1'
        this.tanggalakhir = year+'/'+bulan+'/'+day

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)
        const tglm = btoa(this.tanggalmulai)
        const tgla = btoa(this.tanggalakhir)

       // console.log(this.tanggalmulai)

        this.$axios.get(`guru_rekapabsen_all/${id}/${tglm}/${tgla}`)
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

      detailguru_presensi (data){
        const idg = btoa(data.id_guru)
        const namaguru = btoa(data.Nama)
        this.$router.push({name: 'detail_rekababsenguru' , params: {id :idg, namaguru: namaguru}})
      },

      makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
        }
        return result;
      },
    },
    created() {
      this.getRekapAbsenGuru()
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
