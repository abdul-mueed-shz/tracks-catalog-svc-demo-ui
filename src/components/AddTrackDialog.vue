<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="glass-panel text-white" style="min-width: 480px; max-width: 560px; border-radius: 16px;">
      <q-card-section class="row items-center justify-between q-pb-none">
        <div class="text-h6 text-weight-bolder flex items-center">
          <q-icon name="queue_music" color="primary" class="q-mr-sm" size="24px" />
          Add Track to Catalog
        </div>
        <q-btn flat round dense icon="close" color="grey-5" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit="handleSubmit" class="q-gutter-y-md">
          <!-- Artist Selection -->
          <div>
            <label class="text-caption text-grey-4 text-weight-bold block q-mb-xs">
              Artist <span class="text-negative">*</span>
            </label>
            <q-select
              v-model="selectedArtistId"
              :options="artistOptions"
              emit-value
              map-options
              outlined
              dense
              dark
              options-dark
              color="primary"
              bg-color="dark"
              placeholder="Select or search artist"
              :rules="[val => !!val || 'Please select an artist']"
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="person" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Track Title -->
          <div>
            <label class="text-caption text-grey-4 text-weight-bold block q-mb-xs">
              Track Title <span class="text-negative">*</span>
            </label>
            <q-input
              v-model="form.title"
              outlined
              dense
              dark
              color="primary"
              bg-color="dark"
              placeholder="e.g. Midnight City"
              :rules="[val => (val && val.trim().length > 0) || 'Track title is required']"
            />
          </div>

          <!-- Genre Selection / Input -->
          <div>
            <label class="text-caption text-grey-4 text-weight-bold block q-mb-xs">
              Genre <span class="text-negative">*</span>
            </label>
            <q-select
              v-model="form.genre"
              :options="genreOptions"
              use-input
              new-value-mode="add-unique"
              outlined
              dense
              dark
              options-dark
              color="primary"
              bg-color="dark"
              placeholder="Select or type genre"
              :rules="[val => !!val || 'Genre is required']"
            />
          </div>

          <!-- Duration & Release Date in two columns -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <label class="text-caption text-grey-4 text-weight-bold block q-mb-xs">
                Duration <span class="text-negative">*</span>
              </label>
              <q-input
                v-model="durationInput"
                outlined
                dense
                dark
                color="primary"
                bg-color="dark"
                placeholder="e.g. 3:45 or 225s"
                :rules="[val => parseDurationToMs(val) > 0 || 'Valid duration required']"
              >
                <template #append>
                  <span class="text-caption text-grey-5" v-if="parsedMs > 0">
                    {{ parsedMs.toLocaleString() }} ms
                  </span>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6">
              <label class="text-caption text-grey-4 text-weight-bold block q-mb-xs">
                Release Date <span class="text-negative">*</span>
              </label>
              <q-input
                v-model="form.releaseDate"
                outlined
                dense
                dark
                color="primary"
                bg-color="dark"
                mask="####-##-##"
                placeholder="YYYY-MM-DD"
                :rules="[val => /^\d{4}-\d{2}-\d{2}$/.test(val) || 'Format: YYYY-MM-DD']"
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.releaseDate" mask="YYYY-MM-DD" dark color="primary">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <div class="row justify-end q-gutter-x-sm q-mt-lg">
            <q-btn flat label="Cancel" color="grey-4" v-close-popup />
            <q-btn
              unelevated
              type="submit"
              label="Save Track"
              color="primary"
              text-color="dark"
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
import { useCatalogStore } from '@/stores/catalog'
import { parseDurationToMs } from '@/utils/formatters'
import { useQuasar } from 'quasar'

const props = defineProps<{
  modelValue: boolean
  preselectedArtistId?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'track-added'): void
}>()

const catalogStore = useCatalogStore()
const $q = useQuasar()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

const selectedArtistId = ref<string>('')
const durationInput = ref('3:30')

const form = ref({
  title: '',
  genre: 'Synthwave',
  releaseDate: new Date().toISOString().slice(0, 10)
})

const genreOptions = [
  'Synthwave',
  'Pop',
  'Rock',
  'Hip-Hop',
  'Electronic',
  'Disco',
  'Jazz',
  'Ambient',
  'Indie'
]

const artistOptions = computed(() => {
  return catalogStore.artists
    .filter(a => a.isArtist)
    .map(a => ({
      label: a.name,
      value: a.id || a.uuid
    }))
})

const parsedMs = computed(() => parseDurationToMs(durationInput.value))

watch(
  () => props.preselectedArtistId,
  newId => {
    if (newId) selectedArtistId.value = newId
    else if (artistOptions.value.length > 0 && !selectedArtistId.value) {
      selectedArtistId.value = artistOptions.value[0].value
    }
  },
  { immediate: true }
)

async function handleSubmit() {
  if (!selectedArtistId.value) {
    $q.notify({ type: 'negative', message: 'Please select an artist' })
    return
  }

  const ms = parseDurationToMs(durationInput.value)
  if (ms <= 0) {
    $q.notify({ type: 'negative', message: 'Duration must be greater than zero' })
    return
  }

  try {
    await catalogStore.createTrack(selectedArtistId.value, {
      title: form.value.title.trim(),
      genre: form.value.genre.trim(),
      durationMs: ms,
      releaseDate: form.value.releaseDate
    })

    $q.notify({
      type: 'positive',
      message: `Track "${form.value.title}" successfully added!`,
      position: 'top-right',
      timeout: 3000
    })

    // Reset form
    form.value.title = ''
    isOpen.value = false
    emit('track-added')
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Failed to add track',
      position: 'top-right'
    })
  }
}
</script>
