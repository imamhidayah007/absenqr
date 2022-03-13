<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/DB2.png"
      :style="$q.screen.lt.md ? 'width: 100%': ''"
    >
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        // document.title = to.meta.title || `login ${this.$route.name}`;
        document.title = to.meta.title || 'Dashboard - Absen QR';
      }
    },
  },
  name: 'PageIndex'
})
</script>
