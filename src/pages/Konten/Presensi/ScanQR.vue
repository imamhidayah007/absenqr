<template>
  <q-layout class="bg-image" v-cloak>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card flat class="card-bg text-black" v-bind:style="$q.screen.lt.md?{'width': '99%'}:{'width':'50%'}">
          <q-card-section class="text-center bg-transparent">

            <img style="width: 100%" src="~assets/scan.jpg" alt="">


          </q-card-section>
          <q-card-section class="text-center bg-transparent">
            <div class="text-center">
            <q-input rounded outlined v-model="form.id_siswa" autofocus  @update:model-value="inputAbsen()"  label="Scan QR Code" />

            </div>
            <div class="q-pa-md q-gutter-sm">
              <q-btn outline rounded color="primary" @click="inputAbsen()" label="Input Absensi" />
<!--              <q-btn outline rounded color="teal"  @click="turnCameraOn()" label="Open Camera" />-->
            </div>
          </q-card-section>
          <q-card-section class="text-center bg-transparent">
<!--            <div v-if="showCamera">-->
<!--              <qrcode-stream :camera="camera" @decode="onDecode" @init="onInit">-->
<!--              </qrcode-stream>-->
<!--            </div>-->
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>

  <q-dialog v-model="modalres">
    <q-card style="width: 20%; max-width: 80vw;">
      <q-card-section>

        <div class="text-center">
            <img style="width: 50%" :src="gambar" alt="" />
          <q-banner inline-actions rounded :class="code == 200 ? 'bg-teal-4 text-white' : code == 4041 ? 'bg-red-4 text-white': 'bg-orange-4 text-white'" >
            {{pesan}}
          </q-banner>
        </div>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
  // import { QrcodeStream } from 'vue-qrcode-reader'

  import {ref} from "vue";

  export default {
    name: "Scan",
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Scan QR Code - Absen QR';
        }
      },
    },
    // components: {
    //   QrcodeStream,
    // },
    data() {
      return {
        modalres: ref(false),
        loading: false,
        pesan: null,
        gambar: null,
        code: null,
        hari: null,
        jam: null,
        isValid: undefined,
        camera: 'auto',
        showCamera: false,
        form: {
          id_siswa: null
        },
        error: 'x',

      }
    },
    methods: {
      tanggal (){
        var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        var date = new Date();
        var millisecond = date.getMilliseconds();
        var detik = date.getSeconds();
        var menit = date.getMinutes();
        var jam = date.getHours();
        var day = date.getDate();
        var month = date.getMonth();
        var thisDay = date.getDay(),
          thisDay = myDays[thisDay];
        var yy = date.getYear();
        var year = (yy < 1000) ? yy + 1900 : yy;
        this.hari = thisDay
       // this.jam = jam+":"+menit+":"+detik
      },

      // delayinput (){
      //   let seconds = 3
      //
      //   const timer = setInterval(() => {
      //     seconds--
      //
      //     if (seconds  = 2) {
      //       this.inputAbsen()
      //
      //     }else{
      //       clearInterval(timer)
      //     }
      //
      //   }, 1000)
      //
      // },

      inputAbsen (){
        var date = new Date();
        var detik = date.getSeconds();
        var menit = date.getMinutes();
        var jam = date.getHours();
        this.jam = jam+":"+menit+":"+detik


        var idS = this.form.id_siswa.split('/')

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        //console.log(this.jam)

        var jam = btoa(this.jam)
        const ids = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)


        if (idS[0] === 'S'){
          //console.log('KE SISWA')

          this.$axios.get(`jamhadirsiswa/${jam}/${ids}`)
            .then(response => {
              if (response.data.data != null){
                // console.log('masuk')

                this.InsertAbsenSiswa('inputabsen/', idS[1])

              }else{

                this.$axios.get(`jampulangsiswa/${jam}/${ids}`)
                  .then(responsepulang => {
                    if (responsepulang.data.data != null){
                     // console.log('pulang')
                      this.InsertAbsenSiswa('inputabsenpulang/', idS[1])

                    }else{

                    //  console.log('gk ada jam')

                      this.$q.loading.hide()
                      this.loading = false

                      this.code =  4041
                      this.pesan =  'Tidak Ada Jam Absen'
                      this.gambar = 'https://cdn-icons-png.flaticon.com/512/399/399274.png'
                      this.form.id_siswa = focus()
                      this.autoCloseModal()

                    }

                  }).catch(() =>  this.$q.notify({color: 'negative', message: 'Gagal Terhubung', icon: 'ion-close'}))

              }

            }).catch(() =>  this.$q.notify({color: 'negative', message: 'Gagal Terhubung', icon: 'ion-close'}))





        }else if (idS[0] === 'G'){
         // console.log('KE GURU')
          this.$axios.get(`jamhadirguru/${jam}/${ids}`)
            .then(response => {
                if (response.data.data != null){
                  // console.log('masuk')

                  this.InsertAbsenGuru('guru_inputabsenharian/', idS[1])

                }else{
                  this.$axios.get(`jampulangguru/${jam}/${ids}`)
                    .then(responsepulang => {
                      if (responsepulang.data.data != null){
                        // console.log('pulang')
                        this.InsertAbsenGuru('guru_inputabsenharian_pulang/', idS[1])

                      }else{

                        //  console.log('gk ada jam')

                        this.$q.loading.hide()
                        this.loading = false

                        this.code =  4041
                        this.pesan =  'Tidak Ada Jam Absen'
                        this.gambar = 'https://cdn-icons-png.flaticon.com/512/399/399274.png'
                        this.form.id_siswa = focus()
                        this.autoCloseModal()

                      }

                    }).catch(() =>  this.$q.notify({color: 'negative', message: 'Gagal Terhubung', icon: 'ion-close'}))

                }
            }).catch(() =>  this.$q.notify({color: 'negative', message: 'Gagal Terhubung', icon: 'ion-close'}))


        }else{
         // this.form.id_siswa = focus()
          this.$q.loading.hide()
          this.loading = false

          this.code =  4041
          this.pesan =  'Scan QR Dengan Benar'
          this.gambar = 'https://cdn-icons-png.flaticon.com/512/399/399274.png'
          this.form.id_siswa = focus()
          this.autoCloseModal()
        }

      },


      InsertAbsenGuru (link,idguru){
        this.$axios.post(link, {
          id_guru: idguru,
          hari: this.hari,
          kehadiran: 'Hadir'

        }).finally(()=>this.$q.loading.hide())
          .then(response => {
            this.loading = false

            //console.log(response)
            if (response.data.code === 2001){

              // this.SaveAbsen(response.data.data)

              this.pesan =  response.data.msg.msg
              this.code =  response.data.code
              this.gambar = 'https://cdn-icons-png.flaticon.com/512/2530/2530973.png'
              this.form.id_siswa = focus()
              this.autoCloseModal()



            }else{
              this.pesan =  response.data.msg.msg
              this.code =  response.data.code
              if (this.code == 4041){
                this.gambar = 'https://cdn-icons-png.flaticon.com/512/399/399274.png'
              }else{
                this.gambar = 'https://cdn-icons-png.flaticon.com/512/1500/1500374.png'
              }
              this.form.id_siswa = focus()
              this.autoCloseModal()

            }


          })
      },
      InsertAbsenSiswa (link,idsiswa){
       // console.log(link)
        this.$axios.post(link, {
          id_siswa: idsiswa,
          hari: this.hari,
          kehadiran: 'Hadir'

        })
          .finally(()=>this.$q.loading.hide())
          .then(response => {
            this.loading = false

            //console.log(response)
            if (response.data.code === 2001){

              // this.SaveAbsen(response.data.data)

              this.pesan =  response.data.msg.msg
              this.code =  response.data.code
              this.gambar = 'https://cdn-icons-png.flaticon.com/512/2530/2530973.png'
              this.form.id_siswa = focus()
              this.autoCloseModal()



            }else{
              this.pesan =  response.data.msg.msg
              this.code =  response.data.code
              if (this.code == 4041){
                this.gambar = 'https://cdn-icons-png.flaticon.com/512/399/399274.png'
              }else{
                this.gambar = 'https://cdn-icons-png.flaticon.com/512/1500/1500374.png'
              }
              this.form.id_siswa = focus()
              this.autoCloseModal()

            }


          })
      },

      // SaveAbsen (data) {
      //
      //   this.$axios.post(`saveabsen`,data)
      //     .then(response => {
      //
      //       console.log(response)
      //       if (response.data.code == 2001){
      //
      //         this.pesan =  response.data.msg.msg
      //         this.code =  response.data.code
      //         this.gambar = 'https://cdn-icons-png.flaticon.com/512/2530/2530973.png'
      //         this.autoCloseModal()
      //
      //       }else{
      //
      //         this.$q.notify({
      //           color: 'negative',
      //           message: 'Gagal Input Absen',
      //           icon: 'ion-close'
      //         })
      //
      //       }
      //     }).catch(() => {
      //     this.$q.notify({
      //       color: 'negative',
      //       message: 'Gagal Terhubung',
      //       icon: 'ion-close'
      //     })
      //   })
      //
      // },
      autoCloseModal () {
        let seconds = 3

        const timer = setInterval(() => {
          seconds--

          if (seconds > 0) {
            this.modalres = true
          }
          else {
            clearInterval(timer)
            this.modalres = false

          }
        }, 1000)
      }

      // async onDecode (content) {
      //    this.text =  content
      //  // this.turnCameraOff()
      // },
      //
      // async onInit(promise) {
      //   try {
      //     await promise;
      //   } catch (error) {
      //     if (error.name === "NotAllowedError") {
      //       this.error = "ERROR: you need to grant camera access permisson";
      //     } else if (error.name === "NotFoundError") {
      //       this.error = "ERROR: no camera on this device";
      //     } else if (error.name === "NotSupportedError") {
      //       this.error = "ERROR: secure context required (HTTPS, localhost)";
      //     } else if (error.name === "NotReadableError") {
      //       this.error = "ERROR: is the camera already in use?";
      //     } else if (error.name === "OverconstrainedError") {
      //       this.error = "ERROR: installed cameras are not suitable";
      //     } else if (error.name === "StreamApiNotSupportedError") {
      //       this.error = "ERROR: Stream API is not supported in this browser";
      //     }
      //   }
      // },
      // turnCameraOn () {
      //   this.camera = 'auto'
      //   this.showCamera = true
      // },
      //
      // turnCameraOff () {
      //   this.camera = 'off'
      //   this.showCamera = false
      // }
    },
    created() {


      this.tanggal()
    }
  }
</script>

<style>
  .bg-image {
    /*background-image: url(https://wallpaperaccess.com/full/2189928.jpg);*/
    background-repeat: no-repeat;
    background-size: cover;
  }
  [v-cloak] {
    display: none !important;
  }

  .active {
    color: #ffffff;
    background: linear-gradient(to right,#1976D2, #99c9ff);
  }
</style>

