<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="glass-panel text-white" style="min-width: 440px; max-width: 520px; border-radius: 16px;">
      <q-card-section class="row items-center justify-between q-pb-none">
        <div class="text-h6 text-weight-bolder flex items-center">
          <q-icon name="edit" color="secondary" class="q-mr-sm" size="24px" />
          Edit Artist Name / Aliases
        </div>
        <q-btn flat round dense icon="close" color="grey-5" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <!-- Explanatory Banner -->
        <div class="alias-notice q-pa-sm rounded-borders q-mb-md flex items-start">
          <q-icon name="history_edu" color="secondary" size="24px" class="q-mr-sm q-mt-xs" />
          <div class="text-caption text-grey-3">
            <span class="text-weight-bold text-white">Historical Alias Tracking:</span>
            Updating the artist's name will automatically archive their current name
            (<strong class="text-primary">{{ currentArtist?.name }}</strong>)
            as a historical stage alias. All tracks remain discoverable under both past and new names!
          </div>
        </div>

        <q-form @submit="handleSubmit" class="q-gutter-y-md">
          <div>
            <label class="text-caption text-grey-4 text-weight-bold block q-mb-xs">
              Current Name
            </label>
            <q-input
              :model-value="currentArtist?.name"
              readonly
              outlined
              dense
              dark
              bg-color="dark"
              disable
            />
          </div>

          <div>
            <label class="text-caption text-grey-4 text-weight-bold block q-mb-xs">
              New Artist Stage Name <span class="text-negative">*</span>
            </label>
            <q-input
              v-model="newName"
              outlined
              dense
              dark
              autofocus
              color="secondary"
              bg-color="dark"
              placeholder="e.g. The Weeknd (formerly Abel Tesfaye)"
              :rules="[
                val => (val && val.trim().length > 0) || 'Name is required',
                val => val !== currentArtist?.name || 'New name must be different from current name'
              ]"
            />
          </div>

          <div class="row justify-end q-gutter-x-sm q-mt-lg">
            <q-btn flat label="Cancel" color="grey-4" v-close-popup />
            <q-btn
              unelevated
              type="submit"
              label="Save & Archive Alias"
              color="secondary"
              text-color="white"
              class="text-weight-bold q-px-md"
              :loading="catalogStore.isSubmitting"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { UserItem } from '@/types/catalog'
import { useCatalogStore } from '@/stores/catalog'
import { useQuasar } from 'quasar'

const props = defineProps<{
  modelValue: boolean
  artist: UserItem | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'artist-updated', updated: UserItem): void
}>()

const catalogStore = useCatalogStore()
const $q = useQuasar()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

const currentArtist = computed(() => props.artist)
const newName = ref('')

watch(
  () => props.artist,
  art => {
    newName.value = art ? art.name : ''
  },
  { immediate: true }
)

async function handleSubmit() {
  if (!props.artist) return
  const artistId = props.artist.id || props.artist.uuid
  const trimmed = newName.value.trim()

  try {
    const updated = await catalogStore.updateArtist(artistId, trimmed)
    $q.notify({
      type: 'positive',
      message: `Artist name updated to "${trimmed}". Previous name archived into alias history.`,
      position: 'top-right',
      timeout: 3500
    })
    isOpen.value = false
    emit('artist-updated', updated)
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Failed to update artist name',
      position: 'top-right'
    })
  }
}
</script>

<style scoped lang="scss">
.alias-notice {
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.25);
}
</style>
