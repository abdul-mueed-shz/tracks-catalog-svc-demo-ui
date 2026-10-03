<template>
  <q-layout view="lHh LpR fFf" class="main-layout text-white">
    <!-- Top Header -->
    <q-header class="glass-panel q-px-md header-bar">
      <q-toolbar class="q-py-xs">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="lt-md q-mr-sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <div class="row items-center cursor-pointer gt-xs q-mr-lg" @click="$router.push('/')">
          <q-avatar size="32px" class="q-mr-sm bg-primary text-dark shadow-4">
            <q-icon name="library_music" size="20px" />
          </q-avatar>
          <span class="text-h6 text-weight-bolder tracking-tight brand-text">CATALOG SERVICE</span>
        </div>

        <!-- Global Search Bar -->
        <div class="search-container col-grow flex items-center q-mx-md">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            dark
            placeholder="Search catalog tracks by title or artist..."
            class="full-width search-input"
            color="primary"
            bg-color="dark"
            @keyup.enter="handleSearch"
          >
            <template #prepend>
              <q-icon name="search" color="grey-5" />
            </template>
            <template #append v-if="searchQuery">
              <q-icon name="close" class="cursor-pointer" @click="searchQuery = ''; handleSearch()" />
            </template>
          </q-input>
        </div>

        <!-- Right Header Actions -->
        <div class="flex items-center q-gutter-x-sm no-wrap">
          <ApiStatusBadge />

          <q-btn
            unelevated
            dense
            color="primary"
            text-color="dark"
            icon="add"
            label="Add Track"
            class="text-weight-bold q-px-sm gt-xs glow-pill"
            @click="showAddTrackDialog = true"
          />

          <q-btn
            flat
            dense
            round
            icon="person_add"
            color="grey-4"
            class="gt-xs"
            @click="showRegisterUserDialog = true"
          >
            <q-tooltip>Register Artist / User</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left Navigation Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="240"
      class="sidebar-drawer glass-panel"
    >
      <div class="column full-height justify-between q-pa-md">
        <div>
          <!-- Mobile Brand Heading -->
          <div class="lt-sm q-mb-lg flex items-center">
            <q-avatar size="32px" class="q-mr-sm bg-primary text-dark">
              <q-icon name="library_music" size="20px" />
            </q-avatar>
            <span class="text-h6 text-weight-bolder brand-text">CATALOG</span>
          </div>

          <!-- Navigation Links -->
          <div class="text-caption text-weight-bold text-grey-5 text-uppercase q-mb-xs q-px-sm">
            Menu
          </div>
          <q-list class="nav-list q-gutter-y-xs">
            <q-item
              clickable
              v-ripple
              to="/"
              exact
              active-class="nav-item--active"
              class="nav-item rounded-borders"
            >
              <q-item-section avatar>
                <q-icon name="dashboard" size="22px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Overview</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              to="/tracks"
              active-class="nav-item--active"
              class="nav-item rounded-borders"
            >
              <q-item-section avatar>
                <q-icon name="queue_music" size="22px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Catalog Tracks</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              to="/artists"
              active-class="nav-item--active"
              class="nav-item rounded-borders"
            >
              <q-item-section avatar>
                <q-icon name="groups" size="22px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Artists & Aliases</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              to="/docs"
              active-class="nav-item--active"
              class="nav-item rounded-borders"
            >
              <q-item-section avatar>
                <q-icon name="code" size="22px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">API Endpoints</q-item-section>
            </q-item>
          </q-list>

          <q-separator color="white" style="opacity: 0.08" class="q-my-md" />

          <!-- Quick Actions in Drawer -->
          <div class="text-caption text-weight-bold text-grey-5 text-uppercase q-mb-xs q-px-sm">
            Actions
          </div>
          <q-list class="q-gutter-y-xs">
            <q-item
              clickable
              v-ripple
              class="nav-item rounded-borders"
              @click="showAddTrackDialog = true"
            >
              <q-item-section avatar>
                <q-icon name="add_circle" color="primary" size="22px" />
              </q-item-section>
              <q-item-section class="text-weight-medium text-white">Add New Track</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              class="nav-item rounded-borders"
              @click="showRegisterUserDialog = true"
            >
              <q-item-section avatar>
                <q-icon name="person_add" color="accent" size="22px" />
              </q-item-section>
              <q-item-section class="text-weight-medium text-white">Register User / Artist</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Sidebar Footer -->
        <div class="glass-panel-subtle q-pa-sm rounded-borders text-caption text-grey-5">
          <div class="flex items-center justify-between">
            <span>Catalog API</span>
            <q-badge color="primary" text-color="dark" label="8080" />
          </div>
          <div class="text-grey-6 text-caption q-mt-xs">
            Spring Boot • PostgreSQL • Redis
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- Main Page View Container -->
    <q-page-container class="page-container">
      <router-view
        @open-add-track="handleAddTrackFromPage"
        @open-register="showRegisterUserDialog = true"
      />
    </q-page-container>

    <!-- Modals -->
    <AddTrackDialog
      v-model="showAddTrackDialog"
      :preselected-artist-id="preselectedArtistId"
      @track-added="handleTrackAdded"
    />

    <RegisterUserDialog
      v-model="showRegisterUserDialog"
      @user-registered="handleUserRegistered"
    />
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ApiStatusBadge from '@/components/ApiStatusBadge.vue'
import AddTrackDialog from '@/components/AddTrackDialog.vue'
import RegisterUserDialog from '@/components/RegisterUserDialog.vue'
import { useCatalogStore } from '@/stores/catalog'
import type { ArtistOfTheDay } from '@/types/catalog'

const router = useRouter()
const catalogStore = useCatalogStore()

const leftDrawerOpen = ref(false)
const searchQuery = ref('')
const showAddTrackDialog = ref(false)
const showRegisterUserDialog = ref(false)
const preselectedArtistId = ref<string | undefined>(undefined)

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/tracks',
      query: { q: searchQuery.value.trim() }
    })
  } else {
    router.push('/tracks')
  }
}

function handleAddTrackFromPage(artist?: ArtistOfTheDay | null) {
  if (artist) {
    preselectedArtistId.value = artist.id || artist.uuid
  } else {
    preselectedArtistId.value = undefined
  }
  showAddTrackDialog.value = true
}

function handleTrackAdded() {
  catalogStore.fetchTracks()
}

function handleUserRegistered() {
  catalogStore.fetchArtists()
}
</script>

<style scoped lang="scss">
.main-layout {
  background-color: var(--app-bg);
  min-height: 100vh;
}

.header-bar {
  background: rgba(11, 14, 20, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 1000;
}

.brand-text {
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #10b981 0%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-container {
  max-width: 500px;
}

.search-input {
  :deep(.q-field__control) {
    border-radius: 9999px;
    background: rgba(22, 30, 46, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}

.sidebar-drawer {
  background: rgba(11, 14, 20, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-item {
  color: #94a3b8;
  border: 1px solid transparent;
  transition: all 0.15s ease;

  &:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.04);
  }

  &--active {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.25);
    font-weight: 700;
  }
}

.page-container {
  padding-bottom: 24px;
}
</style>
