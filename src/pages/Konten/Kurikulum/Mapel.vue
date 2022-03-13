<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Data Mata Pelajaran</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-tabs
          v-model="Mapel"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="datamapel" label="Data Mata Pelajaran" />
          <q-tab name="formmapel" label="Tambah Mata Pelajaran" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="Mapel" animated>
          <q-tab-panel name="datamapel">
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

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn outline color="blue" size="sm" @click="detailMapel(props.row)" icon="receipt_long"> Ubah</q-btn>
                    <q-btn outline color="red" size="sm" @click="deleteMapel(props.row.id)" icon="delete_sweep"> Hapus</q-btn>
                  </div>
                </q-td>
              </template>

            </q-table>

          </q-tab-panel>

          <q-tab-panel name="formmapel">
            <q-form @submit="onSubmit">

              <div class="row">
                <div class="col-6">

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.kode_mapel" label="Masukan Kode Mapel"  required/>
                  </q-item>

                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.kkm" label="KKM" type="number"  required/>
                  </q-item>

                </div>

                <div class="col-6">
                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.nama_mapel" label="Nama Mapel"  required/>
                  </q-item>

                  <q-item>
                    <q-select :options="statusmapelOptions"  outlined class="full-width" v-model="form.status_mapel" label="Status Mapel"/>
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

  <q-dialog v-model="modalMapel">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <!--        <div class="text-h6">Close icon</div>-->
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="simpanEdit">
          <div class="row">
            <div class="col-6">

              <q-item>
                <q-input  outlined class="full-width" v-model="formEdit.kode_mapel" label="Masukan Kode Mapel"  required/>
              </q-item>

              <q-item>
                <q-input  outlined class="full-width" v-model="formEdit.kkm" label="KKM" type="number"  required/>
              </q-item>

            </div>

            <div class="col-6">
              <q-item>
                <q-input  outlined class="full-width" v-model="formEdit.nama_mapel" label="Nama Mapel"  required/>
              </q-item>

              <q-item>
                <q-select :options="statusmapelOptions"  outlined class="full-width" v-model="formEdit.status_mapel" label="Status Mapel"/>
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
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script>
  import { ref } from 'vue'

  export default {
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // document.title = to.meta.title || `login ${this.$route.name}`;
          document.title = to.meta.title || 'Mata Pelajaran - Absen QR';
        }
      },
    },
    data() {

      return {
        modalMapel: ref(false),
        waktu: null,
        dataSekolah: [],
        loading: false,
        Mapel: ref('datamapel'),

        statusmapelOptions: ['Aktif' , 'Tidak Aktif'],
        form: {
          id_sekolah: this.$q.localStorage.getItem('dataUser').id_sekolah,
          kode_mapel: null,
          nama_mapel: null,
          kkm: null,
          status_mapel: null,

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
            name: "kode_mapel",
            align: "left",
            label: "Kode Mapel",
            field: "kode_mapel",
            sortable: true
          },
          { name: "nama_mapel", required: true, label: "Nama Mapel", align: "left", field: "nama_mapel", sortable: true },
          { name: "kkm", required: true, label: "KKM", align: "left", field: "kkm", sortable: true },
          { name: "status_aktif", required: true, label: "Status Mapel", align: "left", field: "status_mapel", sortable: true },
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
      getMapel(){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)


        this.$axios.get(`getmapel/${id}`)
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
      onSubmit () {
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.post('inputmapel/',  this.form)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.form.nama_mapel = null
              this.form.kode_mapel = null
              this.form.kkm = null
              this.form.status_mapel = null

              this.getMapel()
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

      detailMapel(id){
        this.modalMapel = true
        this.formEdit = id
        this.idMapel = id.id
        // console.log(this.idTA)
      },
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
      deleteMapel (id){

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

          this.$axios.delete('hapusmapel/'+ btoa(id))
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
      this.getMapel()
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
