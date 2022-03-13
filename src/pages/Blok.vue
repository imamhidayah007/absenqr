<template>
  <q-layout class="bg-image" v-cloak>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card :flat="$q.screen.lt.md" class="card-bg text-black" v-bind:style="$q.screen.lt.md?{'width': '99%'}:{'width':'50%'}">
          <q-card-section class="text-center bg-transparent">

              <img style="width: 30%" src="~assets/road-block.png" alt="">


            <div class="text-h5">{{ this.$q.localStorage.getItem('dataUser').nama }}</div>
          </q-card-section>
          <q-card-section>
            <div class="text-h6 text-center">
              Mohon Maaf, Saat Ini Akun Anda Tidak Dapat Masuk Kehalaman Ini.
            </div>
          </q-card-section>
          <q-card-section class="text-center bg-transparent">
            <q-btn style="width: 40%" class="active" label="Keluar" clickable @click="logout" />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    name: "Blok",
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Block - Absen QR';
        }
      },
    },
    data() {
      return {
        password: '',
        isPwd: 'password'
      }
    },
    methods: {
      logout() {
        this.$q.localStorage.clear()
        this.$router.push({name: 'loginPage'})
      }
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

