<template>
  <q-layout class="bg-image" v-cloak>
    <q-page-container>
      <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">

          <q-card flat bordered class="card-bg text-black" v-bind:style="$q.screen.lt.md?{'width': '99%'}:{'width':'50%'}">
            <q-card-section class="text-center bg-transparent">

              <canvas id="qr-code" /><br />
              <q-btn outline rounded color="teal"  @click="donwloadCanvas()" label="Download QR Code" />
            </q-card-section>

          </q-card>

      </q-page>
    </q-page-container>
  </q-layout>
</template>


<script>

  import {ref} from "vue";
  import QRious from "qrious";
    export default {
      name: "GeneratorQR",
      watch: {
        $route: {
          immediate: true,
          handler(to, from) {
            // document.title = to.meta.title || `login ${this.$route.name}`;
            document.title = to.meta.title || 'Scan QR Code - Absen QR';
          }
        },
      },
      data() {
        return {

          loading: false,
          isiqr: 'djancok'
        }
      },
      methods: {
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
        generateQrCode () {
          // if (this.isiqr != "" && this.isiqr != "\n") {
          //   console.log("generatingnn");
          // }
          var l;
          if (this.$q.localStorage.getItem('dataUser').level === 'Siswa'){
            l = 'S'
          }else {
            l = 'G'
          }
            new QRious({
              level: "H",
              padding: 25,
              size: 300,
              element: document.getElementById("qr-code"),
              value: l+'/'+this.$q.localStorage.getItem('dataUser').id_relasi+'/'+this.makeid(4)+'/'+this.$q.localStorage.getItem('dataUser').username
            });
        },
        donwloadCanvas () {
          const canvas = document.getElementsByTagName('canvas')
          const link = document.createElement('a')
          link.download = this.makeid(4)+'-'+this.$q.localStorage.getItem('dataUser').nama+'-QRCode.png'
          link.href = canvas[0].toDataURL()
          link.click()
        }

      },
      mounted() {
        this.generateQrCode()
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
