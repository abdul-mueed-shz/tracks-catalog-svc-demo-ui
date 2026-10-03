<template>
  <div class="api-status-badge flex items-center q-gutter-x-sm">
    <div
      class="status-pill text-caption q-px-sm flex items-center"
      :class="catalogStore.isBackendLive ? 'status-pill--live' : 'status-pill--offline'"
    >
      <div class="status-dot q-mr-xs" :class="{ 'status-dot--live': catalogStore.isBackendLive }" />
      <span class="text-weight-bold">
        {{ catalogStore.isBackendLive ? 'Backend: 8080 Connected' : 'Backend: 8080 Offline' }}
      </span>
      <q-tooltip anchor="bottom middle" self="top middle" class="bg-dark text-white shadow-4">
        {{
          catalogStore.isBackendLive
            ? 'Connected to Spring Boot catalog service at http://localhost:8080/catalog-svc'
            : 'Cannot reach backend at http://localhost:8080/catalog-svc. Click refresh to retry.'
        }}
      </q-tooltip>
    </div>

    <q-btn
      round
      dense
      flat
      size="sm"
      icon="refresh"
      :loading="catalogStore.isCheckingHealth"
      color="grey-4"
      @click="recheckHealth"
    >
      <q-tooltip>Recheck backend connection (http://localhost:8080)</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { useCatalogStore } from '@/stores/catalog'
import { useQuasar } from 'quasar'

const catalogStore = useCatalogStore()
const $q = useQuasar()

async function recheckHealth() {
  const isUp = await catalogStore.checkConnection()
  if (isUp) {
    $q.notify({
      type: 'positive',
      message: 'Connected to backend (localhost:8080/catalog-svc)',
      position: 'top-right',
      timeout: 2000
    })
    await Promise.allSettled([
      catalogStore.fetchArtistOfTheDay(),
      catalogStore.fetchTracks(),
      catalogStore.fetchArtists()
    ])
  } else {
    $q.notify({
      type: 'warning',
      message: 'Backend on localhost:8080 is unreachable. Ensure the service is running.',
      position: 'top-right',
      timeout: 3000
    })
  }
}
</script>

<style scoped lang="scss">
.status-pill {
  border-radius: 9999px;
  padding: 4px 10px;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &--live {
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #34d399;
  }

  &--offline {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #f87171;
  }
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #ef4444;

  &--live {
    background-color: #10b981;
    box-shadow: 0 0 8px #10b981;
  }
}
</style>
