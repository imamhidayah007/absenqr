<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header bordered class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />

        <q-toolbar-title  shrink class="row items-center no-wrap">
<!--          <img :src="`${$baseAlbumSekolah}${dataSekolah.logo}`" :style="$q.screen.lt.md ? 'width: 15%' : 'width: 12%'">-->
          <img src="~assets/logo2.png" :style="$q.screen.lt.md ? 'width: 15%' : 'width: 35%'">
<!--          <span class="q-ml-sm" >Absen QR</span>-->
        </q-toolbar-title>

        <q-space />

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">


          <q-btn round dense flat color="grey-8" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn>

<!--          <q-btn round dense flat color="grey-8" icon="notifications">-->
<!--            <q-badge color="red" text-color="white" floating>-->
<!--              2-->
<!--            </q-badge>-->
<!--            <q-tooltip>Notifications</q-tooltip>-->
<!--            <q-menu-->
<!--            >-->
<!--              <q-list style="min-width: 100px">-->
<!--                <q-item style="max-width: 420px">-->
<!--                  <q-item-section avatar>-->
<!--                    <q-avatar>-->
<!--                      <img src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg">-->
<!--                    </q-avatar>-->
<!--                  </q-item-section>-->

<!--                  <q-item-section>-->
<!--                    <q-item-label>Judul Text</q-item-label>-->
<!--                    <q-item-label caption lines="1">Halo Text panjang disini</q-item-label>-->
<!--                  </q-item-section>-->

<!--                  <q-item-section side>-->
<!--                    27 Maret 2021-->
<!--                  </q-item-section>-->
<!--                </q-item>-->
<!--&lt;!&ndash;                <q-card class="text-center no-shadow no-border">&ndash;&gt;-->
<!--&lt;!&ndash;                  <q-btn  @click="view()"  style="max-width: 120px !important;" flat dense&ndash;&gt;-->
<!--&lt;!&ndash;                          class="text-indigo-8">Lihat Semua</q-btn>&ndash;&gt;-->
<!--&lt;!&ndash;                </q-card>&ndash;&gt;-->
<!--              </q-list>-->
<!--            </q-menu>-->
<!--          </q-btn>-->
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
            <q-menu>
              <q-list style="min-width: 200px">
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img style="width: 100%;"  src="https://cdn.quasar.dev/img/boy-avatar.png">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $q.localStorage.getItem('dataUser').nama }}</q-item-label>
                    <q-item-label caption>Aktif</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator></q-separator>
                <!-- <q-item clickable :to="{ name: 'distriProfile' }">
                  <q-item-section side>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>Profil Anda</q-item-section>
                </q-item> -->
                <q-item clickable :to="{name: 'profile'}">
                  <q-item-section side>
                    <q-icon name="fas fa-user-tie" />
                  </q-item-section>
                  <q-item-section>Setting</q-item-section>
                </q-item>
                <q-item clickable @click="logout">
                  <q-item-section side>
                    <q-icon name="fas fa-sign-out-alt" />
                  </q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-white"
      :width="250"
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-grey-8">

<!--          <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact  :to="{name: 'dashboard'}">-->
<!--            <q-item-section avatar>-->
<!--              <q-icon name="dashboard" />-->
<!--            </q-item-section>-->

<!--            <q-item-section>-->
<!--             <strong>Dashboard</strong>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

          <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'dashboard'}">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>

            <q-item-section>
              <strong>Dashboard</strong>
            </q-item-section>
          </q-item>

          <div v-if="$q.localStorage.getItem('dataUser').level === 'Siswa'">
            <q-item-label class="text-blue-grey-14" header> Menu</q-item-label>


            <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact  :to="{name: 'siswa_presensi_harian'}">
              <q-item-section avatar>
                <q-icon name="spellcheck" />
              </q-item-section>

              <q-item-section>
                <strong>Presensi Harian</strong>
              </q-item-section>
            </q-item>

            <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'siswa_jadwalmengajar'}">
              <q-item-section avatar>
                <q-icon name="watch_later" />
              </q-item-section>

              <q-item-section>
                <strong>Jadwal Pelajaran</strong>
              </q-item-section>
            </q-item>


            <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'siswa_rekappresensi'}">
              <q-item-section avatar>
                <q-icon name="source" />
              </q-item-section>

              <q-item-section>
                <strong>Rekap Presensi</strong>
              </q-item-section>
            </q-item>

            <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'siswa_generateqr'}">
              <q-item-section avatar>
                <q-icon name="select_all" />
              </q-item-section>

              <q-item-section>
                <strong>Generate QR Code</strong>
              </q-item-section>
            </q-item>

          </div>

          <div v-if="$q.localStorage.getItem('dataUser').level === 'Guru'">
              <q-item-label class="text-blue-grey-14" header> Menu</q-item-label>


              <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact  :to="{name: 'guru_presensi_harian'}">
                <q-item-section avatar>
                  <q-icon name="spellcheck" />
                </q-item-section>

                <q-item-section>
                  <strong>Presensi Harian</strong>
                </q-item-section>
              </q-item>

              <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'guru_jadwalmengajar'}">
                <q-item-section avatar>
                  <q-icon name="watch_later" />
                </q-item-section>

                <q-item-section>
                  <strong>Jadwal Mengajar</strong>
                </q-item-section>
              </q-item>


              <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'guru_rekappresensi'}">
                <q-item-section avatar>
                  <q-icon name="source" />
                </q-item-section>

                <q-item-section>
                  <strong>Rekap Presensi</strong>
                </q-item-section>
              </q-item>

            <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'guru_generateqr'}">
              <q-item-section avatar>
                <q-icon name="select_all" />
              </q-item-section>

              <q-item-section>
                <strong>Generate QR Code</strong>
              </q-item-section>
            </q-item>

          </div>


          <div v-if="$q.localStorage.getItem('dataUser').level === 'Admin'">


            <q-item-label class="text-blue-grey-14" header> Menu</q-item-label>


            <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact  :to="{name: 'scanqr'}">
              <q-item-section avatar>
                <q-icon name="filter_center_focus" />
              </q-item-section>

              <q-item-section>
                <strong>Scan QR Presensi</strong>
              </q-item-section>
            </q-item>


<!--            <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'rekappresensi'}">-->
<!--              <q-item-section avatar>-->
<!--                <q-icon name="source" />-->
<!--              </q-item-section>-->

<!--              <q-item-section>-->
<!--                <strong>Rekap Presensi</strong>-->
<!--              </q-item-section>-->
<!--            </q-item>-->

            <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'settingjam'}" >
              <q-item-section avatar>
                <q-icon name="query_builder" />
              </q-item-section>

              <q-item-section>
                <strong>Setting Jam Absen</strong>
              </q-item-section>
            </q-item>

            <q-expansion-item class="GNL__drawer-item"
                              icon="source"
                              label="Rekap Presensi"
            >
              <q-list class="q-pl-lg">

                <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name:'rekappresensi'}" >
                  <q-item-section avatar>
                    <q-icon name="people_alt" />
                  </q-item-section>

                  <q-item-section>
                    <strong>Siswa</strong>
                  </q-item-section>
                </q-item>

                <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'rekababsenguru'}">
                  <q-item-section avatar>
                    <q-icon name="hot_tub" />
                  </q-item-section>

                  <q-item-section>
                    <strong>Guru</strong>
                  </q-item-section>
                </q-item>

              </q-list>
            </q-expansion-item>



                <q-separator inset class="q-my-sm" />
          <q-item-label class="text-blue-grey-14" header> Master</q-item-label>


          <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'mastersekolah'}">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>

            <q-item-section>
              <strong>Master Sekolah</strong>
            </q-item-section>
          </q-item>

          <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'gurustaff'}" >
            <q-item-section avatar>
              <q-icon name="account_box" />
            </q-item-section>

            <q-item-section>
              <strong>Data Guru / Staff</strong>
            </q-item-section>
          </q-item>

          <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'siswa'}" >
            <q-item-section avatar>
              <q-icon name="sports_handball" />
            </q-item-section>

            <q-item-section>
              <strong>Data Siswa</strong>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-my-sm" />
          <q-item-label class="text-blue-grey-14" header>Manajemen Kurikulum</q-item-label>


          <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'tahunajaran'}">
            <q-item-section avatar>
              <q-icon name="format_list_numbered" />
            </q-item-section>

            <q-item-section>
              <strong>Setting Tahun Ajaran</strong>
            </q-item-section>
          </q-item>

          <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'mapel'}">
            <q-item-section avatar>
              <q-icon name="book" />
            </q-item-section>

            <q-item-section>
              <strong>Mata Pelajaran</strong>
            </q-item-section>
          </q-item>



          <q-expansion-item class="GNL__drawer-item"
            icon="nature_people"
            label="Setting Kelas"
          >
            <q-list class="q-pl-lg">

              <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name:'kelompokkelas'}" >
                <q-item-section avatar>
                  <q-icon name="filter_3" />
                </q-item-section>

                <q-item-section>
                  <strong>Kelompok Kelas</strong>
                </q-item-section>
              </q-item>

              <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'kelasberjalan'}">
                <q-item-section avatar>
                  <q-icon name="assignment_turned_in" />
                </q-item-section>

                <q-item-section>
                  <strong>Setting Kelas Berjalan</strong>
                </q-item-section>
              </q-item>


<!--              <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name:'jadwal'}" >-->
<!--                <q-item-section avatar>-->
<!--                  <q-icon name="assignment" />-->
<!--                </q-item-section>-->

<!--                <q-item-section>-->
<!--                  <strong>Setting Jadwal</strong>-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--              <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact >-->
<!--                <q-item-section avatar>-->
<!--                  <q-icon name="safety_divider" />-->
<!--                </q-item-section>-->

<!--                <q-item-section>-->
<!--                  <strong>Setting Siswa</strong>-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--              <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact >-->
<!--                <q-item-section avatar>-->
<!--                  <q-icon name="group_remove" />-->
<!--                </q-item-section>-->

<!--                <q-item-section>-->
<!--                  <strong>Setting Pindah Siswa</strong>-->
<!--                </q-item-section>-->
<!--              </q-item>-->



            </q-list>
          </q-expansion-item>

          <q-separator inset class="q-my-sm" />
          <q-item-label class="text-blue-grey-14" header>Role & Hak Akses</q-item-label>

          <q-item class="GNL__drawer-item" active-class="active" v-ripple clickable exact :to="{name: 'users'}">
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>

            <q-item-section>
              <strong>Pengguna/Users</strong>
            </q-item-section>
          </q-item>

          </div>






          <q-separator inset class="q-my-sm" />

          <q-item class="GNL__drawer-item" v-ripple v-for="link in links3" :key="link.text" clickable>
            <q-item-section>
              <q-item-label>{{ link.text }} <q-icon v-if="link.icon" :name="link.icon" /></q-item-label>
            </q-item-section>
          </q-item>

          <div class="q-mt-md">
            <div class="flex flex-center q-gutter-xs">
              <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="Privacy">Privacy</a>
              <span> · </span>
              <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="Terms">Terms</a>
              <span> · </span>
              <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="About">Policy</a>
            </div>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
  import { ref } from 'vue'
  import { fasGlobeAmericas, fasFlask } from '@quasar/extras/fontawesome-v5'

  export default {
    name: 'MainLayout',

    data () {
      const leftDrawerOpen = ref(false)
      const search = ref('')
      const showAdvanced = ref(false)
      const showDateOptions = ref(false)
      const exactPhrase = ref('')
      const hasWords = ref('')
      const excludeWords = ref('')
      const byWebsite = ref('')
      const byDate = ref('Any time')

      function onClear () {
        exactPhrase.value = ''
        hasWords.value = ''
        excludeWords.value = ''
        byWebsite.value = ''
        byDate.value = 'Any time'
      }

      function changeDate (option) {
        byDate.value = option
        showDateOptions.value = false
      }

      function toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }

      return {

        dataSekolah: [],
        leftDrawerOpen,
        search,
        showAdvanced,
        showDateOptions,
        exactPhrase,
        hasWords,
        excludeWords,
        byWebsite,
        byDate,

        links3: [
          { icon: 'open_in_new', text: 'Kontak' },
          { icon: 'open_in_new', text: 'Bantuan' },
        ],

        onClear,
        changeDate,
        toggleLeftDrawer
      }
    },
    methods: {
      getSekolah () {
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)
        this.$axios.get(`getSekolah/${id}`)
          .then(response => {
            //  console.log(response)
            if (response.data.msg.status === true) {
              this.dataSekolah = response.data.data

              //console.log(this.dataSekolah.nama_sekolah)
            } else {
              this.dataSekolah = []
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
      logout () {
        this.$q.localStorage.clear()
        this.$router.push({ name: 'loginPage' })
      },
    },
    created() {
      this.getSekolah()
    }
  }
</script>

<style lang="sass">
  .GNL

    &__toolbar
      height: 64px

    &__toolbar-input
      width: 55%

    &__drawer-item
      line-height: 24px
      border-radius: 0 24px 24px 0
      margin-right: 12px
      /*color: #1976D2*/

      /*.q-item__section--avatar*/
      /*  .q-icon*/
      /*    color: #5f6368*/

      .q-item__label
        color: #3c4043
        letter-spacing: .01785714em
        font-size: .875rem
        font-weight: 500
        line-height: 1.25rem

    &__drawer-footer-link
      color: inherit
      text-decoration: none
      font-weight: 500
      font-size: .75rem

      &:hover
        color: #000
</style>

<style >
  .active {
    color: #1976D2;
    background: linear-gradient(to right,#99c9ff, #c6ddff);
    letter-spacing: .01785714em;
    font-size: .875rem;
    font-weight: 500;
    line-height: 1.25rem;

  }




</style>
