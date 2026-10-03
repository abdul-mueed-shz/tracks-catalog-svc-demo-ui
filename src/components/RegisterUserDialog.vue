<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="glass-panel text-white" style="min-width: 440px; max-width: 500px; border-radius: 16px;">
      <q-card-section class="row items-center justify-between q-pb-none">
        <div class="text-h6 text-weight-bolder flex items-center">
          <q-icon name="person_add" color="accent" class="q-mr-sm" size="24px" />
          Register Artist / User
        </div>
        <q-btn flat round dense icon="close" color="grey-5" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit="handleSubmit" class="q-gutter-y-md">
          <div>
            <label class="text-caption text-grey-4 text-weight-bold block q-mb-xs">
              Name / Stage Name <span class="text-negative">*</span>
            </label>
            <q-input
              v-model="name"
              outlined
              dense
              dark
              autofocus
              color="accent"
              bg-color="dark"
              placeholder="e.g. Phoenix, Kaytranada, or Listener Name"
              :rules="[val => (val && val.trim().length > 0) || 'Name is required']"
            />
          </div>

          <div class="q-pa-sm rounded-borders bg-dark">
            <q-toggle
              v-model="isArtist"
              color="primary"
              label="Register as Artist (can publish music and enter Artist of the Day rotation)"
              dark
            />
          </div>

          <div class="row justify-end q-gutter-x-sm q-mt-lg">
            <q-btn flat label="Cancel" color="grey-4" v-close-popup />
            <q-btn
              unelevated
              type="submit"
              label="Register Profile"
              color="accent"
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
import { ref, computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useQuasar } from 'quasar'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'user-registered'): void
}>()

const catalogStore = useCatalogStore()
const $q = useQuasar()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

const name = ref('')
const isArtist = ref(true)

async function handleSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed) return

  try {
    const created = await catalogStore.registerUser({
      name: trimmed,
      isArtist: isArtist.value
    })

    $q.notify({
      type: 'positive',
      message: `Successfully registered "${created.name}" as ${created.isArtist ? 'an Artist' : 'a Listener'}!`,
      position: 'top-right',
      timeout: 3000
    })

    name.value = ''
    isArtist.value = true
    isOpen.value = false
    emit('user-registered')
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Registration failed',
      position: 'top-right'
    })
  }
}
</script>
