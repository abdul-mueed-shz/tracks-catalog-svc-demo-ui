<template>
  <div class="track-list-table overflow-hidden">
    <div class="table-header row items-center text-caption text-grey-5 text-weight-bold q-py-sm q-px-md">
      <div class="col-1 text-center">#</div>
      <div class="col-4">Title</div>
      <div class="col-3">Artist</div>
      <div class="col-2">Genre</div>
      <div class="col-1 text-center">Release Date</div>
      <div class="col-1 text-right">Duration</div>
    </div>

    <q-separator color="white" style="opacity: 0.08" />

    <div v-if="tracks.length === 0" class="text-center q-pa-xl text-grey-5">
      <q-icon name="library_music" size="48px" class="q-mb-sm opacity-50" />
      <div class="text-subtitle1">No tracks received from backend</div>
      <div class="text-caption text-grey-6">Use "Add Track" to insert tracks into the catalog.</div>
    </div>

    <div
      v-for="(track, index) in tracks"
      :key="track.id || track.uuid"
      class="table-row row items-center q-py-sm q-px-md rounded-borders"
    >
      <!-- Index -->
      <div class="col-1 text-center text-caption index-num text-grey-5 text-weight-medium">
        {{ index + 1 }}
      </div>

      <!-- Title & Static Thumbnail -->
      <div class="col-4 flex items-center no-wrap">
        <q-avatar rounded size="36px" class="q-mr-sm flex-shrink-0">
          <img src="/placeholder.png" alt="Track Cover" />
        </q-avatar>
        <div class="ellipsis">
          <div class="text-body2 text-weight-bold text-white ellipsis" :title="track.title">
            {{ track.title }}
          </div>
          <div class="text-caption text-grey-6 text-mono ellipsis" :title="track.id || track.uuid">
            {{ track.id || track.uuid }}
          </div>
        </div>
      </div>

      <!-- Artist -->
      <div class="col-3 ellipsis">
        <router-link
          :to="`/artists/${track.user.id || track.user.uuid}`"
          class="artist-table-link text-body2 text-weight-medium ellipsis"
        >
          {{ track.user.name }}
        </router-link>
      </div>

      <!-- Genre -->
      <div class="col-2">
        <q-badge
          dense
          outline
          color="secondary"
          class="text-caption text-weight-medium q-px-xs"
        >
          {{ track.genre }}
        </q-badge>
      </div>

      <!-- Release Date -->
      <div class="col-1 text-center text-caption text-grey-4">
        {{ formatDate(track.releaseDate) }}
      </div>

      <!-- Duration -->
      <div class="col-1 text-right text-caption text-grey-4 text-mono">
        {{ formatDuration(track.durationMs) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrackItem } from '@/types/catalog'
import { formatDuration, formatDate } from '@/utils/formatters'

defineProps<{
  tracks: TrackItem[]
}>()
</script>

<style scoped lang="scss">
.track-list-table {
  width: 100%;
}

.table-header {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.table-row {
  transition: background-color 0.15s ease;
  border: 1px solid transparent;

  &:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
}

.artist-table-link {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #10b981;
    text-decoration: underline;
  }
}

.text-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
}
</style>
