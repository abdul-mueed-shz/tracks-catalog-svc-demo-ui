<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'

const catalogStore = useCatalogStore()

onMounted(async () => {
  await catalogStore.initializeCatalog()
})
</script>

<style>
/* Global app reset */
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
