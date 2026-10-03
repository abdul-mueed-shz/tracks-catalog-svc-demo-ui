<template>
  <q-page class="q-pa-lg">
    <div v-if="isLoading" class="text-center q-pa-xl">
      <q-spinner-audio color="primary" size="48px" />
      <div class="text-caption text-grey-5 q-mt-md">Loading artist profile from backend...</div>
    </div>

    <div v-else-if="!artist" class="text-center q-pa-xl">
      <q-icon name="error_outline" color="negative" size="48px" />
      <div class="text-h6 text-white q-mt-md">Artist Not Found in Backend</div>
      <q-btn flat color="primary" label="Back to Artists" to="/artists" class="q-mt-sm" />
    </div>

    <div v-else class="column q-gutter-y-lg">
      <!-- 1. Artist Hero Section -->
      <div class="artist-hero q-pa-lg glass-panel relative-position">
        <div class="row items-center q-col-gutter-lg">
          <div class="col-auto">
            <q-avatar size="100px" rounded class="shadow-4">
              <img
                src="/artist-placeholder.png"
                alt="Artist Avatar"
              />
            </q-avatar>
          </div>

          <div class="col">
            <div class="flex items-center q-gutter-x-sm q-mb-xs">
              <q-badge
                dense
                color="primary"
                text-color="dark"
                class="text-weight-bolder text-uppercase text-caption q-px-sm"
              >
                {{ artist.isArtist ? 'Artist' : 'User' }}
              </q-badge>
              <span class="text-caption text-grey-5">
                Joined {{ formatDate(artist.createdAt) }}
              </span>
              <span class="text-caption text-grey-6 text-mono">
                UUID: {{ artist.id || artist.uuid }}
              </span>
            </div>

            <h1 class="text-h4 text-weight-bolder text-white q-my-none profile-name">
              {{ artist.name }}
            </h1>

            <!-- Historical Aliases Display -->
            <div class="q-mt-sm flex items-center q-gutter-xs">
              <span class="text-caption text-grey-4 text-weight-bold">
                Aliases / Prior Names:
              </span>
              <template v-if="aliases.length > 0">
                <q-chip
                  v-for="alias in aliases"
                  :key="alias.id || alias.uuid"
                  dense
                  outline
                  color="secondary"
                  class="text-caption"
                >
                  <q-icon name="history" size="14px" class="q-mr-xs" />
                  {{ alias.aliasName }}
                </q-chip>
              </template>
              <span v-else class="text-caption text-grey-6 italic">
                None recorded (original stage name)
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="row items-center q-gutter-sm q-mt-md">
              <q-btn
                outline
                color="white"
                icon="edit"
                label="Edit Artist Name"
                class="text-weight-bold q-px-md"
                @click="showEditDialog = true"
              />

              <q-btn
                unelevated
                color="primary"
                text-color="dark"
                icon="library_add"
                label="Add Track"
                class="text-weight-bold"
                @click="$emit('open-add-track', artist)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Artist Catalog Tracks -->
      <section>
        <div class="row items-center justify-between q-mb-sm">
          <div>
            <h2 class="text-h6 text-weight-bolder text-white q-my-none flex items-center">
              <q-icon name="music_note" color="primary" class="q-mr-sm" size="22px" />
              Artist Tracks ({{ artistTracks.length }})
            </h2>
            <div class="text-caption text-grey-5">
              Tracks associated with "{{ artist.name }}" in backend
            </div>
          </div>

          <q-btn
            outline
            dense
            color="primary"
            icon="add"
            label="Add Track"
            class="text-weight-bold q-px-sm"
            @click="$emit('open-add-track', artist)"
          />
        </div>

        <div class="glass-panel q-pa-md">
          <TrackListTable :tracks="artistTracks" />
        </div>
      </section>

      <!-- 3. Historical Aliases Audit Card -->
      <section v-if="aliases.length > 0" class="glass-panel q-pa-md">
        <div class="text-subtitle1 text-weight-bolder text-white flex items-center q-mb-sm">
          <q-icon name="manage_history" color="secondary" class="q-mr-sm" size="20px" />
          Alias History (GET /catalog-svc/users/{{ artist.id || artist.uuid }}/aliases)
        </div>
        <p class="text-caption text-grey-4 q-mb-sm">
          Historical stage names stored in backend database when the artist was updated.
        </p>

        <q-list separator dark class="rounded-borders bg-dark">
          <q-item v-for="alias in aliases" :key="alias.id || alias.uuid" class="q-py-sm">
            <q-item-section avatar>
              <q-avatar icon="history" color="secondary" text-color="white" size="28px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold text-white">{{ alias.aliasName }}</q-item-label>
              <q-item-label caption class="text-grey-5">
                Normalized: <code>{{ alias.normalizedName || alias.aliasName.toLowerCase() }}</code>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <span class="text-caption text-grey-6">{{ formatDate(alias.createdAt) }}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </div>

    <!-- Edit Name Dialog -->
    <EditArtistDialog
      v-model="showEditDialog"
      :artist="artist"
      @artist-updated="handleArtistUpdated"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { formatDate } from '@/utils/formatters'
import TrackListTable from '@/components/TrackListTable.vue'
import EditArtistDialog from '@/components/EditArtistDialog.vue'
import type { UserItem, UserAliasItem } from '@/types/catalog'

defineEmits<{
  (e: 'open-add-track', artist: UserItem | null): void
}>()

const route = useRoute()
const catalogStore = useCatalogStore()

const isLoading = ref(true)
const artist = ref<UserItem | null>(null)
const aliases = ref<UserAliasItem[]>([])
const showEditDialog = ref(false)

const artistId = computed(() => String(route.params.id))

onMounted(async () => {
  await loadArtistProfile()
})

async function loadArtistProfile() {
  isLoading.value = true
  try {
    const fetched = await catalogStore.fetchUserDetails(artistId.value)
    artist.value = fetched
    if (fetched) {
      aliases.value = await catalogStore.fetchArtistAliases(artistId.value)
      await catalogStore.fetchTracks({ userId: artistId.value })
    }
  } finally {
    isLoading.value = false
  }
}

const artistTracks = computed(() => {
  return catalogStore.tracks.filter(
    t => t.user.id === artistId.value || t.user.uuid === artistId.value
  )
})

async function handleArtistUpdated(updated: UserItem) {
  artist.value = updated
  aliases.value = await catalogStore.fetchArtistAliases(artistId.value)
}
</script>

<style scoped lang="scss">
.artist-hero {
  border-radius: 12px;
  background: rgba(18, 25, 38, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.profile-name {
  letter-spacing: -0.02em;
}

.text-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
}
</style>
