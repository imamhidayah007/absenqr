<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Data Pengguna/Users</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-card flat bordered class>
            <q-card-section>
              <div class="text-h6">Form User</div>
            </q-card-section>

            <q-separator inset></q-separator>

            <q-card-section>
              <q-form @submit="onSubmit">

                <q-item>
                  <q-select :options="penggunaOptions"  outlined class="full-width" v-model="form.pengguna" label="Pengguna"/>
                </q-item>

                <q-item v-if="(form.pengguna == 'Siswa')? hiddeSiswa: false">
                  <q-select outlined class="full-width"  v-model="form.siswa" use-input
                            option-value="id" option-label="nama_siswa"
                            input-debounce="0" label="Siswa"
                            :options="Siswaptions" @filter="filterSiswa" behavior="menu" >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                </q-item>

                <q-item v-if="(form.pengguna == 'Guru/Staff')? hiddeGuru: false">
                  <q-select outlined class="full-width"  v-model="form.guru" use-input
                   option-value="id" option-label="Nama"
                    input-debounce="0" label="Guru/Staff"
                    :options="Guruoptions" @filter="filterGuru" behavior="menu" >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item>

                <q-item>
                  <q-input  outlined class="full-width" v-model="form.username" label="Username" />
                </q-item>

                <q-item v-if="(form.pengguna == 'Admin')? hiddeAdmin: false">
                  <q-input  outlined class="full-width" v-model="form.nama" label="Nama" />
                </q-item>

                <q-item>
                  <q-input v-model="form.password" class="full-width"  outlined :type="isPwd ? 'password' : 'text'" lazy-rules :rules="[
                     val => val !== null && val !== '' || 'Please type something' ]">

                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </q-item>


                  <q-card-actions style="padding-top: 25px;" align="center" class="text-teal">
                    <q-btn style="width: 100%"
                           label="Simpan"
                           type="submit"
                           color="primary"
                    />
                  </q-card-actions>

              </q-form>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
          <q-card flat bordered class>
            <q-card-section>
              <div class="text-h6">Daftar Pengguna/Users</div>
            </q-card-section>

            <q-separator inset></q-separator>

            <q-card-section>
              <q-table
                flat
                bordered
                :rows="data"
                :hide-header="mode === 'grid'"
                :columns="columns"
                row-key="name"
                :grid="mode == 'grid'"
                :pagination="pagination"
                :filter="filter"
              >
                <template v-slot:top-right="props">
                  <q-input
                    outlined
                    dense
                    debounce="300"
                    v-model="filter"
                    placeholder="Search"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>

                  <q-btn
                    flat
                    round
                    dense
                    :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="props.toggleFullscreen"
                    v-if="mode === 'list'"
                  >
                    <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
                    >{{
                      props.inFullscreen
                      ? "Exit Fullscreen"
                      : "Toggle Fullscreen"
                      }}
                    </q-tooltip>
                  </q-btn>

                  <q-btn
                    flat
                    round
                    dense
                    :icon="mode === 'grid' ? 'list' : 'grid_on'"
                    @click="
                    mode = mode === 'grid' ? 'list' : 'grid';
                    separator = mode === 'grid' ? 'none' : 'horizontal';
                  "
                    v-if="!props.inFullscreen"
                  >
                    <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
                    >{{ mode === "grid" ? "List" : "Grid" }}
                    </q-tooltip>
                  </q-btn>
                </template>
                <template v-slot:body-cell-level="props">
                  <q-td :props="props">
                    <span v-if="props.row.level == 'Guru'">Guru/Staff</span>
                    <span v-else>{{props.row.level}}</span>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <div class="q-gutter-sm">
                      <q-btn dense color="orange"  @click="resetpw(props.row.id)" icon="repeat"><q-tooltip class="bg-orange text-white shadow-4" :offset="[10, 10]">
                        Reset password
                      </q-tooltip></q-btn>
                      <q-btn dense color="red"  @click="deleteUsers(props.row.id)" icon="delete"> <q-tooltip class="bg-red text-white shadow-4" :offset="[10, 10]">
                        Hapus User
                      </q-tooltip></q-btn>

                    </div>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>


    </div>
  </q-page>

</template>

<script>
  import { ref } from 'vue'

  let stringGuru = []
  let stringSiswa = []

  export default {
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Data Guru dan Staff - Absen Apps';
        }
      },
    },
    data() {

      return {
        waktu: null,
        loading: false,
        mode: "list",
        penggunaOptions: ['Siswa', 'Guru/Staff','Admin'],
        hiddeGuru: true,
        hiddeSiswa: true,
        hiddeAdmin: true,
        hiddeNama: true,
        isPwd: ref(true),
        form: {
          id_sekolah: this.$q.localStorage.getItem('dataUser').id_sekolah,
          pengguna: null,
          siswa: {
            id: null,
            nama_siswa: null,
          },
          guru: {
            id:null,
            Nama: null
          },
          username: null,
          nama: null,
          password: null

        },
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "username",
            align: "left",
            label: "Username",
            field: "username",
            sortable: true
          },
          { name: "nama", required: true, label: "Nama ", align: "left", field: "nama", sortable: true },
          { name: "level", required: true, label: "Hak Akses", align: "left", field: "level", sortable: true },
          { name: "status_aktif", required: true, label: "Status", align: "left", field: "status_aktif", sortable: true },
          { name: "action", required: true, label: "Action", align: "left", field: "action", sortable: true },
        ],
        data : [],

        Guruoptions: stringGuru,
        Siswaptions: stringSiswa,

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

      loadGuru (){
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getGuru/${id}`)
          .then(response => {
            //console.log(response)
            stringGuru = response.data.data
          }).catch(() =>  this.$q.notify({color: 'negative', message: 'Gagal Terhubung', icon: 'ion-close'}))
      },
      filterGuru (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          this.Guruoptions = stringGuru.filter(v => v.Nama.toLowerCase().indexOf(needle) > -1)
        })
      },

      loadSiswa (){
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getSiswa/${id}`)
          .then(response => {
            //console.log(response)
            stringSiswa = response.data.data
          }).catch(() =>  this.$q.notify({color: 'negative', message: 'Gagal Terhubung', icon: 'ion-close'}))
      },
      filterSiswa (val, update, abort) {
        update(() => {
          const needle = val.toLowerCase()
          this.Siswaptions = stringSiswa.filter(v => v.nama_siswa.toLowerCase().indexOf(needle) > -1)
        })
      },
      onSubmit(){
       // console.log(this.form)
        var nama,level,id_relasi;
        if (this.form.pengguna == 'Admin'){
           nama = this.form.nama
            level = 'Admin'
            id_relasi = 0
        }else if(this.form.pengguna == 'Siswa'){
           nama = this.form.siswa.nama_siswa
            level = 'Siswa'
            id_relasi = this.form.siswa.id
        }else{
          nama = this.form.guru.Nama
          level = 'Guru'
          id_relasi = this.form.guru.id
        }

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.post('insertUsers/',  {
          id_sekolah: this.form.id_sekolah,
          username: this.form.username,
          password: this.form.password,
          nama: nama,
          level: level,
          id_relasi: id_relasi

        })
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.getUsers()
            } else {
              this.$q.notify({
                color: 'negative',
                message: res.data.msg.msg,
                icon: 'ion-close'
              })
            }
          }).catch(() => {
          this.$q.notify({
            color: 'negative',
            message: 'Gagal terhubung',
            icon: 'ion-close'
          })
        })

      },
      getUsers (){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getusers/${id}`)
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

      resetpw(id){

        var url = 'resetpw/'+ btoa(id)

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.get(url)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })
              this.getUsers()
            } else {
              this.$q.notify({
                color: 'negative',
                message: res.data.msg.msg,
                icon: 'ion-close'
              })
            }
          }).catch(() => {
          this.$q.notify({
            color: 'negative',
            message: 'Gagal terhubung',
            icon: 'ion-close'
          })
        })

      },
      deleteUsers (id){

        var url = 'hapususers/'+ btoa(id)
        this.$q.dialog({
          title: 'Konfirmasi',
          message: 'Yakin ingin menghapus data ini?',
          ok: {
            push: true
          },
          cancel: {
            push: true,
            color: 'negative'
          },
          persistent: true
        }).onOk(() => {
          // console.log('>>>> OK')


          this.loading = true
          this.$q.loading.show(this.$loadingStyle)

          this.$axios.delete(url)
            .finally(() => this.$q.loading.hide())
            .then(res => {
              this.loading = false
              if (res.data.msg.status == true) {
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })
                this.getUsers()
              } else {
                this.$q.notify({
                  color: 'negative',
                  message: res.data.msg.msg,
                  icon: 'ion-close'
                })
              }
            }).catch(() => {
            this.$q.notify({
              color: 'negative',
              message: 'Gagal terhubung',
              icon: 'ion-close'
            })
          })

        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })

      }
    },
    created() {
      this.getUsers()
      this.loadSiswa()
      this.loadGuru()
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
