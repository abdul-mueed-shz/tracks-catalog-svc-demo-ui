<template>
  <div class="artist-of-the-day-hero q-pa-md glass-panel relative-position">
    <div class="row items-center q-col-gutter-md">
      <!-- Left: Static Avatar -->
      <div class="col-auto">
        <q-avatar size="84px" rounded class="shadow-4">
          <img src="/artist-placeholder.png" alt="Artist of the Day" />
        </q-avatar>
      </div>

      <!-- Center: Info received from backend -->
      <div class="col">
        <div class="flex items-center q-gutter-x-sm q-mb-xs">
          <q-badge
            color="primary"
            text-color="dark"
            class="text-weight-bold text-caption text-uppercase"
          >
            Artist of the Day
          </q-badge>
          <span class="text-caption text-grey-5">Daily Rotation (Backend)</span>
        </div>

        <template v-if="isLoading">
          <q-spinner-dots color="primary" size="24px" />
        </template>
        <template v-else-if="artist">
          <h2 class="text-h5 text-weight-bolder q-my-none text-white">
            {{ artist.name }}
          </h2>
          <div class="text-caption text-grey-5 text-mono q-mt-xs">
            UUID: {{ artist.id || artist.uuid }}
          </div>
        </template>
        <template v-else>
          <div class="text-subtitle1 text-grey-4">
            No Artist of the Day assigned currently in backend.
          </div>
          <div class="text-caption text-grey-6">
            Register artists and add tracks to initialize the rotation sequence.
          </div>
        </template>
      </div>

      <!-- Right: Direct Navigation Actions -->
      <div class="col-auto" v-if="artist">
        <div class="row items-center q-gutter-x-sm">
          <q-btn
            outline
            color="grey-3"
            icon="person"
            label="Artist Profile"
            class="text-weight-bold"
            :to="`/artists/${artist.id || artist.uuid}`"
          />

          <q-btn
            flat
            color="primary"
            icon="library_add"
            label="Add Track"
            class="text-weight-bold"
            @click="$emit('open-add-track', artist)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArtistOfTheDay } from '@/types/catalog'

defineProps<{
  artist: ArtistOfTheDay | null
  isLoading?: boolean
}>()

defineEmits<{
  (e: 'open-add-track', artist: ArtistOfTheDay | null): void
}>()
</script>

<style scoped lang="scss">
.artist-of-the-day-hero {
  border-radius: 12px;
  background: rgba(18, 25, 38, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.text-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
}
</style>
