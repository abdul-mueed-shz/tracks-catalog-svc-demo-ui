<template>
  <q-page class="q-pa-lg">
    <div class="column q-gutter-y-lg">
      <!-- Page Title & Header -->
      <div class="row items-center justify-between">
        <div>
          <h1 class="text-h4 text-weight-bolder text-white q-my-none flex items-center">
            <q-icon name="library_music" color="primary" class="q-mr-sm" size="32px" />
            Catalog Tracks
          </h1>
          <p class="text-caption text-grey-5 q-mt-xs q-mb-none">
            Query tracks with cursor pagination from backend GET /catalog-svc/tracks.
          </p>
        </div>

        <div class="row items-center q-gutter-x-sm">
          <q-btn
            unelevated
            color="primary"
            text-color="dark"
            icon="add"
            label="Add Track"
            class="text-weight-bold glow-pill"
            @click="$emit('open-add-track')"
          />
        </div>
      </div>

      <!-- Filters & Controls Bar -->
      <div class="glass-panel q-pa-md">
        <div class="row q-col-gutter-sm items-center">
          <!-- Search Input (Matches artist name or aliases via backend) -->
          <div class="col-12 col-md-5">
            <q-input
              v-model="searchQuery"
              dense
              outlined
              dark
              placeholder="Search by artist name or alias in backend..."
              color="primary"
              bg-color="dark"
              clearable
              @update:model-value="onFilterChange"
            >
              <template #prepend>
                <q-icon name="search" color="grey-5" />
              </template>
            </q-input>
          </div>

          <!-- Sort Property -->
          <div class="col-6 col-md-4">
            <q-select
              v-model="sortProperty"
              :options="sortOptions"
              emit-value
              map-options
              dense
              outlined
              dark
              options-dark
              color="primary"
              bg-color="dark"
              @update:model-value="onFilterChange"
            >
              <template #prepend>
                <q-icon name="sort" color="grey-5" />
              </template>
            </q-select>
          </div>

          <!-- Sort Direction & View Toggle -->
          <div class="col-6 col-md-3 flex items-center justify-end q-gutter-x-xs">
            <q-btn
              flat
              round
              dense
              :icon="sortDirection === 'DESC' ? 'south' : 'north'"
              color="grey-4"
              @click="toggleSortDirection"
            >
              <q-tooltip>{{ sortDirection === 'DESC' ? 'Descending' : 'Ascending' }}</q-tooltip>
            </q-btn>

            <q-separator vertical color="white" style="opacity: 0.1; height: 24px" class="q-mx-xs" />

            <q-btn-toggle
              v-model="viewMode"
              dense
              rounded
              outline
              color="primary"
              toggle-color="primary"
              toggle-text-color="dark"
              text-color="grey-4"
              :options="[
                { icon: 'view_list', value: 'list' },
                { icon: 'grid_view', value: 'grid' }
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Tracks Content -->
      <div v-if="catalogStore.isLoadingTracks && catalogStore.tracks.length === 0" class="text-center q-pa-xl">
        <q-spinner-audio color="primary" size="48px" />
        <div class="text-caption text-grey-5 q-mt-md">Loading tracks from backend...</div>
      </div>

      <div v-else>
        <!-- Table View -->
        <div v-if="viewMode === 'list'" class="glass-panel q-pa-md">
          <TrackListTable :tracks="catalogStore.tracks" />
        </div>

        <!-- Grid View -->
        <div v-else class="row q-col-gutter-md">
          <div
            v-for="track in catalogStore.tracks"
            :key="track.id || track.uuid"
            class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
          >
            <TrackCard :track="track" />
          </div>
        </div>

        <!-- Load More / Cursor Pagination -->
        <div v-if="catalogStore.hasMoreTracks" class="text-center q-mt-xl">
          <q-btn
            outline
            color="primary"
            label="Load More (Keyset Cursor)"
            icon="expand_more"
            class="q-px-lg text-weight-bold"
            :loading="isLoadingMore"
            @click="loadMore"
          />
          <div class="text-caption text-grey-6 q-mt-xs">
            Keyset pagination token: {{ catalogStore.tracksCursor }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import TrackCard from '@/components/TrackCard.vue'
import TrackListTable from '@/components/TrackListTable.vue'

defineEmits<{
  (e: 'open-add-track'): void
}>()

const route = useRoute()
const catalogStore = useCatalogStore()

const viewMode = ref<'grid' | 'list'>('list')
const searchQuery = ref('')
const sortProperty = ref('createdAt')
const sortDirection = ref<'ASC' | 'DESC'>('DESC')
const isLoadingMore = ref(false)

const sortOptions = [
  { label: 'Date Added (createdAt)', value: 'createdAt' },
  { label: 'Track Title (title)', value: 'title' },
  { label: 'Duration (durationMs)', value: 'durationMs' },
  { label: 'Release Date (releaseDate)', value: 'releaseDate' }
]

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = String(route.query.q)
  }
  fetchData()
})

function fetchData(append = false) {
  catalogStore.fetchTracks(
    {
      userName: searchQuery.value.trim() || undefined,
      cursor: append ? catalogStore.tracksCursor || undefined : undefined,
      property: sortProperty.value,
      direction: sortDirection.value,
      size: 16
    },
    append
  )
}

function onFilterChange() {
  fetchData(false)
}

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'DESC' ? 'ASC' : 'DESC'
  fetchData(false)
}

async function loadMore() {
  isLoadingMore.value = true
  try {
    await fetchData(true)
  } finally {
    isLoadingMore.value = false
  }
}
</script>

<style scoped lang="scss">
// Styles
</style>
