<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Jadwal Mengajar Sugeng Ing Kaweruh,S.Pd | TA. 2021 Genap</strong>
        <template v-slot:action>
          <span>Senin, 24 Januari 2021</span>
        </template>
      </q-banner>
      <br />
      <q-table
        class="my-sticky-column-table"
        title="Jadwal Mengajar"
        flat
        bordered
        :rows="data"
        :columns="columns"
        row-key="nisn"
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

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="(props.row.status == 'Hadir')?'green':(props.row.status == 'Sakit')?'blue':(props.row.status == 'Alpha'?'red':'purple')"
              text-color="white"
              dense
              class="text-weight-bolder"
              square
            >
              {{props.row.status}}
            </q-chip>
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
          document.title = to.meta.title || 'Jadwal Mengajar - Absen QR';
        }
      },
    },
    data() {
      return {
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
          { name: "kelas", required: true, label: "Kelas", align: "left", field: "kelas", sortable: true },
          { name: "mapel", required: true, label: "Mata Pelajaran", align: "left", field: "mapel", sortable: true },
          { name: "jammulai", required: true, label: "Jam Mulai", align: "left", field: "jammulai", sortable: true },
          { name: "jamselesai", required: true, label: "Jam Selesai", align: "left", field: "jamselesai", sortable: true },

        ],
        data : [
          {
            hari: 'Senin',
            kelas: 'IV A',
            mapel: 'Matematika',
            jammulai: '08.00 WIB',
            jamselesai: '10.00 WIB',
          },
          {
            hari: 'Senin',
            kelas: 'II B',
            mapel: 'Kalkulus',
            jammulai: '11.00 WIB',
            jamselesai: '11.30 WIB',
          },
          {
            hari: 'Senin',
            kelas: 'VI C',
            mapel: 'Mekanika Quantum',
            jammulai: '13.00 WIB',
            jamselesai: '14.30 WIB',
          },
          {
            hari: 'Selasa',
            kelas: 'IV A',
            mapel: 'Matematika',
            jammulai: '08.00 WIB',
            jamselesai: '14.30 WIB',
          },
          {
            hari: 'Rabu',
            kelas: 'III A',
            mapel: 'Kalkulus',
            jammulai: '10.00 WIB',
            jamselesai: '12.30 WIB',
          },


        ]
      }
    }
  }
</script>

<style lang="sass">
  .my-sticky-column-table
    /* specifying max-width so the example can
      highlight the sticky column on any browser window */

    thead tr:first-child th:first-child
      /* bg color is important for th; just specify one */
      background-color: #fff

    td:first-child
      background-color: #f5f5dc

    th:first-child,
    td:first-child
      position: sticky
      left: 0
      z-index: 1
</style>
