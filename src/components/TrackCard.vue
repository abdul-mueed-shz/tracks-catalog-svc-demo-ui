<template>
  <div class="track-card glass-card q-pa-sm relative-position">
    <!-- Static Cover Container -->
    <div class="cover-wrapper relative-position overflow-hidden rounded-borders">
      <img
        src="/placeholder.png"
        alt="Track Placeholder"
        class="track-cover"
      />
    </div>

    <!-- Metadata from backend -->
    <div class="q-pt-sm q-px-xs">
      <div class="text-subtitle1 text-weight-bold text-white ellipsis text-track-title" :title="track.title">
        {{ track.title }}
      </div>

      <div class="text-caption text-grey-4 ellipsis q-mt-xs flex items-center justify-between">
        <router-link
          :to="`/artists/${track.user.id || track.user.uuid}`"
          class="artist-link ellipsis"
        >
          {{ track.user.name }}
        </router-link>

        <span class="text-grey-5 text-mono text-caption">
          {{ formatDuration(track.durationMs) }}
        </span>
      </div>

      <div class="row items-center justify-between q-mt-sm">
        <q-badge
          dense
          outline
          color="secondary"
          class="text-caption text-weight-medium q-px-xs"
        >
          {{ track.genre }}
        </q-badge>

        <span class="text-caption text-grey-6">
          {{ formatDate(track.releaseDate) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrackItem } from '@/types/catalog'
import { formatDuration, formatDate } from '@/utils/formatters'

defineProps<{
  track: TrackItem
}>()
</script>

<style scoped lang="scss">
.track-card {
  width: 100%;
  border-radius: 10px;
  background: rgba(22, 30, 46, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: rgba(16, 185, 129, 0.4);
    transform: translateY(-2px);
  }
}

.cover-wrapper {
  aspect-ratio: 1;
  position: relative;
  background: #0f172a;
}

.track-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.artist-link {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  max-width: 65%;
  transition: color 0.15s ease;

  &:hover {
    color: #10b981;
    text-decoration: underline;
  }
}

.text-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
}
</style>
