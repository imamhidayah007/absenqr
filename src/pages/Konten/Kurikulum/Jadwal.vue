<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Setting Jadwal {{jTA +' '+jSemester+' Kelas '+jKelas}}</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-tabs
          v-model="Jadwal"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="datajadwal" label="Data Jadwal" />
          <q-tab name="formjadwal" label="Tambah Jadwal" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="Jadwal" animated>
          <q-tab-panel name="datajadwal">
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
              <template v-slot:body-cell-kode="props">
                <q-td :props="props">
                  {{props.row.tingkat_kelas +' '+ props.row.nama_kelas +' '+ props.row.kelompok_kelas}}
                </q-td>
              </template>

              <template v-slot:body-cell-Nama_guru_mapel="props">
                <q-td :props="props">
                 {{props.row.NIP_guru_mapel+' - '+props.row.Nama_guru_mapel}}
                </q-td>
              </template>

              <template v-slot:body-cell-nama_mapel="props">
                <q-td :props="props">
                  {{props.row.kode_mapel+' - '+props.row.nama_mapel}}
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
<!--                    <q-btn outline color="blue" size="sm" @click="detailMapel(props.row)" icon="receipt_long"> Ubah</q-btn>-->
                    <q-btn outline color="red" size="sm" @click="deleteJadwal(props.row.idJadwal)" icon="delete_sweep"> Hapus</q-btn>
                  </div>
                </q-td>
              </template>

            </q-table>

          </q-tab-panel>

          <q-tab-panel name="formjadwal">
            <q-form @submit="onSubmit">

              <div class="row">
                <div class="col-6">

                  <q-item>
                    <q-select :options="mapelOptions"  outlined class="full-width" v-model="form.id_mapel" label="Mata Pelajaran" option-value="id"
                              :option-label="opt => Object(opt) === opt && 'nama_mapel' in opt ? opt.kode_mapel +' - '+ opt.nama_mapel : '- Tidak Ada Mapel Aktif -'"/>
                  </q-item>

                </div>
                <div class="col-6">
                  <q-item>
                    <q-select :options="guruOptions"  outlined class="full-width" v-model="form.id_guru" label="Guru Mapel" option-value="id"
                              :option-label="opt => Object(opt) === opt && 'Nama' in opt ? opt.NIP +' - '+ opt.Nama : '- Tidak Ada Guru Aktif -'"/>
                  </q-item>

                </div>

                <div class="col-12">
                  <q-item>
                    <q-select :options="hariOptions"  outlined class="full-width" v-model="form.hari" label="Hari"  option-value="id"  option-label="hari"/>
                  </q-item>
                </div>

                <div class="col-6">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_mulai" mask="time" :rules="['jam_mulai']" label="Jam Mulai">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_mulai">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input outlined class="full-width" v-model="form.jam_selesai" mask="time" :rules="['jam_selesai']" label="Jam Selesai">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.jam_selesai">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>

                <div class="col-12">

                  <q-card-actions style="padding-top: 25px; padding-right: 18px" align="center" class="text-teal">
                    <q-btn style="width: 100%"
                           label="Simpan"
                           type="submit"
                           color="primary"
                    />
                  </q-card-actions>
                </div>

              </div>

            </q-form>

          </q-tab-panel>

        </q-tab-panels>
      </q-card>
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
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Setting Jadwal - Absen QR';
        }
      },
    },
    data() {

      return {
        modalMapel: ref(false),
        waktu: null,
        dataSekolah: [],
        loading: false,
        Jadwal: ref('datajadwal'),

        jTA: '',
        jKelas: '',
        jSemester: '',

        mapelOptions: [{
          id: null,
          kode_mapel: null,
          nama_mapel: null,
        }],
        guruOptions: [ {
          id: null,
          Nama: null,
          NIP: null,
        }],
        hariOptions: [
          {
            angka: 1,
            hari: 'Senin'
          },
          {
            angka: 2,
            hari: 'Selasa'
          },
          {
            angka: 3,
            hari: 'Rabu'
          },
          {
            angka: 4,
            hari: 'Kamis'
          },
          {
            angka: 5,
            hari: 'Jumat'
          },
          {
            angka: 6,
            hari: 'Sabtu'
          },
          {
            angka: 7,
            hari: 'Minggu'
          }
        ],

        form: {
          id_kelasberjalan: null,
          id_mapel: null,
          id_guru: null,
          hari: null,
          jam_mulai: ref('00:00'),
          jam_selesai: ref('00:01'),

        },
        formEdit: {
          kode_mapel: null,
          nama_mapel: null,
          kkm: null,
          status_mapel: null,
        },
        idMapel: null,
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "hari",
            align: "left",
            label: "Hari",
            field: "hari",
            sortable: true
          },
          { name: "nama_mapel", required: true, label: "Nama Mapel", align: "left", field: "nama_mapel", sortable: true },
          { name: "jam_mulai", required: true, label: "Jam Mulai", align: "left", field: "jam_mulai", sortable: true },
          { name: "jam_selesai", required: true, label: "Jam Selesai", align: "left", field: "jam_selesai", sortable: true },
          { name: "Nama_guru_mapel", required: true, label: "Nama Guru", align: "left", field: "Nama_guru_mapel", sortable: true },
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
        this.waktu = thisDay + ', ' + day + ' ' + months[month] + ' ' + year
      },
      optionsGuru(){
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getGuru/${id}`)
          .then(response => {
            // console.log(response)
            if (response.data.msg.status === true) {
              this.guruOptions = response.data.data
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
      optionsMapel(){
        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)

        this.$axios.get(`getmapel/${id}`)
          .then(response => {
            // console.log(response)
            if (response.data.msg.status === true) {
              this.mapelOptions = response.data.data
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
      getJadwal(){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.get(`getjadwal/${this.$route.params.id}`)
          .finally(() => this.$q.loading.hide())
          .then(response => {
            this.loading = false
            // console.log(response)
            if (response.data.msg.status === true) {
              this.data = response.data.data

              if (response.data.data.length > 0) {
                this.jTA = response.data.data[0].tahun_ajaran
                this.jSemester = response.data.data[0].semester
                this.jKelas = response.data.data[0].kelompok_kelas ? response.data.data[0].tingkat_kelas + '  ' + response.data.data[0].nama_kelas + ' ' + response.data.data[0].kelompok_kelas : response.data.data[0].tingkat_kelas + '  ' + response.data.data[0].nama_kelas
              }

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
      onSubmit () {
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.form.id_mapel = this.form.id_mapel.id
        this.form.id_guru = this.form.id_guru.id
        this.form.hari = this.form.hari.hari
        this.form.id_kelasberjalan = atob(this.$route.params.id)


        this.$axios.post('inputjadwal/',  this.form)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.form.id_mapel = null
              this.form.id_guru = null
              this.form.hari = null
              this.jam_mulai = ref('00:00')
              this.jam_selesai = ref('00:01')

               this.getJadwal()
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

      // detailMapel(id){
      //   this.modalMapel = true
      //   this.formEdit = id
      //   this.idMapel = id.id
      //   // console.log(this.idTA)
      // },
      simpanEdit (){

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.put('updatemapel/'+btoa(this.idMapel),  this.formEdit)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.getMapel()
              this.modalMapel = false
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
      deleteJadwal (id){
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

          this.$axios.delete('hapusjadwal/'+ btoa(id))
            .finally(() => this.$q.loading.hide())
            .then(res => {
              this.loading = false
              if (res.data.msg.status == true) {
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })
                this.getJadwal()
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
      this.optionsMapel()
      this.optionsGuru()
      this.getJadwal()
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
