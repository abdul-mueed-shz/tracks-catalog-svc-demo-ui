<template>
  <q-page class="q-pa-lg">
    <div class="column q-gutter-y-lg">
      <!-- Title Header -->
      <div class="row items-center justify-between">
        <div>
          <h1 class="text-h4 text-weight-bolder text-white q-my-none flex items-center">
            <q-icon name="groups" color="secondary" class="q-mr-sm" size="32px" />
            Artists & Users
          </h1>
          <p class="text-caption text-grey-5 q-mt-xs q-mb-none">
            Artists and users received from backend GET /catalog-svc/users.
          </p>
        </div>

        <div class="row items-center q-gutter-x-sm">
          <q-btn
            unelevated
            color="accent"
            text-color="dark"
            icon="person_add"
            label="Register User / Artist"
            class="text-weight-bold glow-pill"
            @click="$emit('open-register')"
          />
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="glass-panel q-pa-md">
        <div class="row q-col-gutter-sm items-center justify-between">
          <div class="col-12 col-sm-6 col-md-5">
            <q-input
              v-model="searchFilter"
              dense
              outlined
              dark
              placeholder="Search by name or alias..."
              color="secondary"
              bg-color="dark"
              clearable
            >
              <template #prepend>
                <q-icon name="search" color="grey-5" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-4 flex justify-end">
            <q-btn-toggle
              v-model="roleFilter"
              dense
              rounded
              outline
              color="secondary"
              toggle-color="secondary"
              toggle-text-color="white"
              text-color="grey-4"
              :options="[
                { label: 'All', value: 'all' },
                { label: 'Artists Only', value: 'artists' },
                { label: 'Listeners', value: 'listeners' }
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Artists Grid -->
      <div v-if="catalogStore.isLoadingArtists" class="text-center q-pa-xl">
        <q-spinner-dots color="secondary" size="48px" />
        <div class="text-caption text-grey-5 q-mt-md">Loading artists from backend...</div>
      </div>

      <div v-else-if="filteredArtists.length === 0" class="glass-panel q-pa-xl text-center text-grey-5">
        <q-icon name="person_off" size="48px" class="q-mb-sm opacity-50" />
        <div class="text-subtitle1">No artists found in backend</div>
        <div class="text-caption text-grey-6">Click "Register User / Artist" to add your first user.</div>
      </div>

      <div v-else class="row q-col-gutter-md">
        <div
          v-for="artist in filteredArtists"
          :key="artist.id || artist.uuid"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <div class="artist-card glass-card q-pa-md rounded-borders column justify-between">
            <div class="text-center cursor-pointer" @click="$router.push(`/artists/${artist.id || artist.uuid}`)">
              <q-avatar size="84px" class="q-mb-md shadow-4 artist-card-avatar">
                <img
                  src="/artist-placeholder.png"
                  alt="Artist"
                />
              </q-avatar>

              <div class="text-h6 text-weight-bolder text-white ellipsis q-mb-xs">
                {{ artist.name }}
              </div>

              <div class="flex items-center justify-center q-gutter-x-xs q-mb-sm">
                <q-badge
                  dense
                  :color="artist.isArtist ? 'primary' : 'grey-7'"
                  :text-color="artist.isArtist ? 'dark' : 'white'"
                  class="text-weight-bold text-caption q-px-sm"
                >
                  {{ artist.isArtist ? 'ARTIST' : 'LISTENER' }}
                </q-badge>
              </div>

              <div class="text-caption text-grey-5">
                {{ getTrackCountForArtist(artist.id || artist.uuid) }} tracks in catalog
              </div>

              <div class="text-caption text-grey-6 text-mono q-mt-xs ellipsis" :title="artist.id || artist.uuid">
                {{ artist.id || artist.uuid }}
              </div>
            </div>

            <!-- Card Actions -->
            <div class="q-mt-md row q-col-gutter-xs">
              <div class="col-6">
                <q-btn
                  outline
                  dense
                  color="grey-4"
                  label="Profile"
                  icon="visibility"
                  class="full-width text-caption"
                  :to="`/artists/${artist.id || artist.uuid}`"
                />
              </div>
              <div class="col-6">
                <q-btn
                  flat
                  dense
                  color="secondary"
                  label="Edit Name"
                  icon="edit"
                  class="full-width text-caption"
                  @click="openEditDialog(artist)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Artist Dialog -->
    <EditArtistDialog
      v-model="showEditDialog"
      :artist="selectedArtistToEdit"
      @artist-updated="handleArtistUpdated"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import EditArtistDialog from '@/components/EditArtistDialog.vue'
import type { UserItem } from '@/types/catalog'

defineEmits<{
  (e: 'open-register'): void
}>()

const catalogStore = useCatalogStore()

const searchFilter = ref('')
const roleFilter = ref<'all' | 'artists' | 'listeners'>('artists')
const showEditDialog = ref(false)
const selectedArtistToEdit = ref<UserItem | null>(null)

onMounted(async () => {
  if (catalogStore.artists.length === 0) {
    await catalogStore.fetchArtists()
  }
})

function getTrackCountForArtist(artistId: string): number {
  return catalogStore.tracks.filter(t => t.user.id === artistId || t.user.uuid === artistId).length
}

function openEditDialog(artist: UserItem) {
  selectedArtistToEdit.value = artist
  showEditDialog.value = true
}

function handleArtistUpdated() {
  catalogStore.fetchArtists()
}

const filteredArtists = computed(() => {
  return catalogStore.artists.filter(a => {
    // Role filter
    if (roleFilter.value === 'artists' && !a.isArtist) return false
    if (roleFilter.value === 'listeners' && a.isArtist) return false

    // Search filter
    if (searchFilter.value.trim()) {
      const q = searchFilter.value.toLowerCase()
      const matchesName = a.name.toLowerCase().includes(q)
      const aliases = catalogStore.aliasesMap[a.id] || catalogStore.aliasesMap[a.uuid] || []
      const matchesAlias = aliases.some(al => al.aliasName.toLowerCase().includes(q))
      return matchesName || matchesAlias
    }
    return true
  })
})
</script>

<style scoped lang="scss">
.artist-card {
  min-height: 260px;
  background: rgba(22, 30, 46, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
}

.artist-card-avatar {
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.text-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
}
</style>
