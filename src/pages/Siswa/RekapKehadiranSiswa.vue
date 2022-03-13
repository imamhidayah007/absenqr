<template>
  <q-page class="q-pa-sm" style="padding-left: 15px; padding-right: 15px">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded style="background:linear-gradient(to right,#99c9ff, #c6ddff) " class=" text-white">
        <strong>Rekap Kehadiran Siswa | TA. 2021 Genap</strong>
        <template v-slot:action>
          <span>Senin, 24 Januari 2021</span>
        </template>
      </q-banner>
      <br />
      <q-table
        class="my-sticky-column-table"
        title="Rekap Kehadiran Siswa"
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
          document.title = to.meta.title || 'Rekap Kehadiran Siswa - Absen QR';
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
          { name: "hadir", required: true, label: "Hadir", align: "left", field: "hadir", sortable: true },
          { name: "sakit", required: true, label: "Sakit", align: "left", field: "sakit", sortable: true },
          { name: "izin", required: true, label: "Izin", align: "left", field: "izin", sortable: true },
          { name: "alpha", required: true, label: "Alpha", align: "left", field: "alpha", sortable: true },
          { name: "dispensasi", required: true, label: "Dispensasi", align: "left", field: "dispensasi", sortable: true },

        ],
        data : []
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
