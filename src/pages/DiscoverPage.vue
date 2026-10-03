<template>
  <q-page class="q-pa-lg">
    <div class="column q-gutter-y-lg">
      <!-- 1. Backend Connectivity Alert if offline -->
      <div v-if="!catalogStore.isBackendLive" class="glass-panel q-pa-md bg-negative-subtle">
        <div class="row items-center justify-between">
          <div class="flex items-center q-gutter-x-sm">
            <q-icon name="cloud_off" color="negative" size="24px" />
            <div>
              <div class="text-subtitle2 text-weight-bold text-white">Backend Offline (localhost:8080)</div>
              <div class="text-caption text-grey-4">
                No data received. Please start the Spring Boot service on port 8080.
              </div>
            </div>
          </div>
          <q-btn
            dense
            outline
            color="white"
            label="Retry Connection"
            icon="refresh"
            :loading="catalogStore.isCheckingHealth"
            @click="catalogStore.initializeCatalog"
          />
        </div>
      </div>

      <!-- 2. Artist of the Day (GET /artist-of-the-day) -->
      <section>
        <ArtistOfTheDayCard
          :artist="catalogStore.artistOfTheDay"
          :is-loading="catalogStore.isLoadingArtistOfTheDay"
          @open-add-track="artist => $emit('open-add-track', artist)"
        />
      </section>

      <!-- 3. Recent Tracks from Backend (GET /tracks) -->
      <section>
        <div class="row items-center justify-between q-mb-sm">
          <div>
            <h2 class="text-h6 text-weight-bold text-white q-my-none flex items-center">
              <q-icon name="library_music" color="primary" class="q-mr-sm" size="22px" />
              Catalog Tracks ({{ catalogStore.tracks.length }})
            </h2>
            <div class="text-caption text-grey-5">
              Live records from backend database
            </div>
          </div>

          <q-btn
            flat
            dense
            no-caps
            color="primary"
            label="View All Tracks"
            icon-right="chevron_right"
            to="/tracks"
          />
        </div>

        <div class="glass-panel q-pa-md">
          <TrackListTable :tracks="catalogStore.tracks.slice(0, 8)" />
        </div>
      </section>

      <!-- 4. Registered Artists from Backend (GET /users) -->
      <section>
        <div class="row items-center justify-between q-mb-sm">
          <div>
            <h2 class="text-h6 text-weight-bold text-white q-my-none flex items-center">
              <q-icon name="groups" color="secondary" class="q-mr-sm" size="22px" />
              Registered Artists ({{ catalogStore.artists.length }})
            </h2>
            <div class="text-caption text-grey-5">
              Artists returned by GET /catalog-svc/users
            </div>
          </div>

          <div class="row items-center q-gutter-x-sm">
            <q-btn
              flat
              dense
              no-caps
              color="secondary"
              label="View All Artists"
              icon-right="chevron_right"
              to="/artists"
            />
          </div>
        </div>

        <div v-if="catalogStore.artists.length === 0" class="glass-panel q-pa-lg text-center text-grey-5">
          <q-icon name="person_off" size="36px" class="q-mb-xs opacity-50" />
          <div class="text-subtitle2">No artists registered in backend</div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Use "Register User / Artist" to add your first artist.
          </div>
        </div>

        <div v-else class="row q-col-gutter-sm">
          <div
            v-for="artist in catalogStore.artists.slice(0, 6)"
            :key="artist.id || artist.uuid"
            class="col-12 col-sm-6 col-md-4 col-lg-2"
          >
            <div
              class="artist-mini-card glass-panel-subtle q-pa-sm text-center cursor-pointer rounded-borders"
              @click="$router.push(`/artists/${artist.id || artist.uuid}`)"
            >
              <q-avatar size="56px" class="q-mb-xs shadow-2">
                <img src="/artist-placeholder.png" alt="Artist Avatar" />
              </q-avatar>
              <div class="text-subtitle2 text-weight-bold text-white ellipsis">
                {{ artist.name }}
              </div>
              <div class="text-caption text-grey-5">
                {{ artist.isArtist ? 'Artist' : 'Listener' }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ArtistOfTheDayCard from '@/components/ArtistOfTheDayCard.vue'
import TrackListTable from '@/components/TrackListTable.vue'
import { useCatalogStore } from '@/stores/catalog'
import type { ArtistOfTheDay } from '@/types/catalog'

defineEmits<{
  (e: 'open-add-track', artist?: ArtistOfTheDay | null): void
}>()

const catalogStore = useCatalogStore()

onMounted(async () => {
  if (catalogStore.tracks.length === 0 && catalogStore.artists.length === 0) {
    await catalogStore.initializeCatalog()
  }
})
</script>

<style scoped lang="scss">
.bg-negative-subtle {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px;
}

.artist-mini-card {
  transition: all 0.15s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(139, 92, 246, 0.4);
  }
}
</style>
