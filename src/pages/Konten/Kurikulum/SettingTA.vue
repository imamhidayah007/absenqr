<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Setting Tahun Ajaran</strong>
        <template v-slot:action>
          <span>{{waktu}}</span>
        </template>
      </q-banner>
      <br />

      <q-card flat bordered>
        <q-tabs
          v-model="TahunAjaran"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="isita" label="Tahun Ajaran" />
          <q-tab name="inputta" label="Tambah Tahun Ajaran" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="TahunAjaran" animated>
          <q-tab-panel name="isita">
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
                    <q-btn outline color="blue" size="sm" @click="detailTA(props.row)" icon="receipt_long"> Ubah</q-btn>
                    <q-btn outline color="red" size="sm" @click="deleteTA(props.row.id)" icon="delete_sweep"> Hapus</q-btn>
                  </div>
                </q-td>
              </template>

            </q-table>

          </q-tab-panel>

          <q-tab-panel name="inputta">
            <q-form @submit="onSubmit">

              <div class="row">
                <div class="col-12">
                  <q-item>
                    <q-input  outlined class="full-width" v-model="form.tahun_ajaran" label="Masukan Tahun Ajaran"  required/>
                  </q-item>

                </div>
                <div class="col-6">

                  <q-item>
                    <q-select outlined class="full-width" v-model="form.semester" :options="semesterOptions" label="Pilih Semester"/>
                  </q-item>
                </div>

                <div class="col-6">

                  <q-item>
                    <q-select :options="statusOptions"  outlined class="full-width" v-model="form.status" label="Pilih Statuf aktif"/>
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

  <q-dialog v-model="modalTA">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
<!--        <div class="text-h6">Close icon</div>-->
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="simpanEdit">
          <div class="row">
          <div class="col-12">
            <q-item>
              <q-input  outlined class="full-width" v-model="formEdit.tahun_ajaran" label="Masukan Tahun Ajaran"  required/>
            </q-item>

          </div>
          <div class="col-6">

            <q-item>
              <q-select outlined class="full-width" v-model="formEdit.semester" :options="semesterOptions" label="Pilih Semester"/>
            </q-item>
          </div>

          <div class="col-6">

            <q-item>
              <q-select :options="statusOptions"  outlined class="full-width" v-model="formEdit.status" label="Pilih Statuf aktif"/>
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
          document.title = to.meta.title || 'Setting Tahun Ajaran - Absen QR';
        }
      },
    },
    data() {

      return {
        modalTA: ref(false),
        waktu: null,
        dataSekolah: [],
        loading: false,
        TahunAjaran: ref('isita'),

        semesterOptions: ['Ganjil', 'Genap'],
        statusOptions: ['Aktif', 'Tidak Aktif'],
        form: {
          id_sekolah: this.$q.localStorage.getItem('dataUser').id_sekolah,
          tahun_ajaran: null,
          semester: null,
          status: null,

        },
        formEdit: {
          tahun_ajaran: null,
          semester: null,
          status: null,
        },
        idTA: null,
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          {
            name: "tahun_ajaran",
            align: "left",
            label: "Tahun Ajaran",
            field: "tahun_ajaran",
            sortable: true
          },
          { name: "semester", required: true, label: "semester", align: "left", field: "semester", sortable: true },
          { name: "status", required: true, label: "Status Aktif", align: "left", field: "status", sortable: true },
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
      getTA(){
        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        const id = btoa( this.$q.localStorage.getItem('dataUser').id_sekolah)


        this.$axios.get(`getTahunAjaran/${id}`)
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

        this.$axios.post('inputTahunAjaran/',  this.form)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.form.tahun_ajaran = null
              this.form.semester = null
              this.form.status = null

              this.getTA()
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

      detailTA(id){
        this.modalTA = true
        this.formEdit = id
        this.idTA = id.id
       // console.log(this.idTA)
      },
      simpanEdit (){

        this.loading = true
        this.$q.loading.show(this.$loadingStyle)

        this.$axios.put('updateTA/'+btoa(this.idTA),  this.formEdit)
          .finally(() => this.$q.loading.hide())
          .then(res => {
            this.loading = false
            if (res.data.msg.status == true) {
              this.$q.notify({
                color: 'positive',
                message: res.data.msg.msg,
                icon: 'ion-checkmark'
              })

              this.getTA()
              this.modalTA = false
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
      deleteTA (id){

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

          this.$axios.delete('hapusTahunAjaran/'+ btoa(id))
            .finally(() => this.$q.loading.hide())
            .then(res => {
              this.loading = false
              if (res.data.msg.status == true) {
                this.$q.notify({
                  color: 'positive',
                  message: res.data.msg.msg,
                  icon: 'ion-checkmark'
                })
                this.getTA()
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
      this.getTA()
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
