import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  ArtistOfTheDay,
  TrackItem,
  UserItem,
  UserAliasItem,
  AddTrackPayload,
  RegisterUserPayload,
  TrackQueryParams,
  UserQueryParams
} from '@/types/catalog'
import { catalogService } from '@/services/catalogService'
import { checkBackendHealth, formatErrorMessage } from '@/services/api'
import { STATIC_COVER_PLACEHOLDER } from '@/services/mockData'

export const useCatalogStore = defineStore('catalog', () => {
  const isBackendLive = ref(false)
  const isCheckingHealth = ref(false)

  const artistOfTheDay = ref<ArtistOfTheDay | null>(null)
  const tracks = ref<TrackItem[]>([])
  const artists = ref<UserItem[]>([])
  const aliasesMap = ref<Record<string, UserAliasItem[]>>({})

  const tracksCursor = ref<string | null>(null)
  const hasMoreTracks = ref(false)

  const isLoadingTracks = ref(false)
  const isLoadingArtists = ref(false)
  const isLoadingArtistOfTheDay = ref(false)
  const isSubmitting = ref(false)
  const errorMessage = ref<string | null>(null)

  async function checkConnection(): Promise<boolean> {
    isCheckingHealth.value = true
    try {
      const isUp = await checkBackendHealth()
      isBackendLive.value = isUp
      return isUp
    } catch {
      isBackendLive.value = false
      return false
    } finally {
      isCheckingHealth.value = false
    }
  }

  async function fetchArtistOfTheDay() {
    isLoadingArtistOfTheDay.value = true
    try {
      const res = await catalogService.getArtistOfTheDay()
      artistOfTheDay.value = res
    } catch (err) {
      // If no artist has been created or backend is empty, keep null
      artistOfTheDay.value = null
      console.info('Artist of the Day not available or empty in backend')
    } finally {
      isLoadingArtistOfTheDay.value = false
    }
  }

  async function fetchTracks(params?: TrackQueryParams, append = false) {
    isLoadingTracks.value = true
    errorMessage.value = null
    try {
      const res = await catalogService.getTracks(params)
      const mapped: TrackItem[] = (res.data || []).map(t => ({
        ...t,
        coverUrl: STATIC_COVER_PLACEHOLDER
      }))

      if (append) {
        tracks.value.push(...mapped)
      } else {
        tracks.value = mapped
      }
      tracksCursor.value = res.cursor || null
      hasMoreTracks.value = !!res.cursor && (res.data?.length ?? 0) > 0
    } catch (err) {
      errorMessage.value = formatErrorMessage(err)
      if (!append) {
        tracks.value = []
      }
      hasMoreTracks.value = false
      tracksCursor.value = null
    } finally {
      isLoadingTracks.value = false
    }
  }

  async function fetchArtists(params?: UserQueryParams) {
    isLoadingArtists.value = true
    errorMessage.value = null
    try {
      const res = await catalogService.getUsers(params)
      artists.value = res.data || []
    } catch (err) {
      errorMessage.value = formatErrorMessage(err)
      artists.value = []
    } finally {
      isLoadingArtists.value = false
    }
  }

  async function fetchArtistAliases(userId: string): Promise<UserAliasItem[]> {
    try {
      const list = await catalogService.getUserAliases(userId)
      aliasesMap.value[userId] = list || []
      return list || []
    } catch (err) {
      console.warn('Failed to load aliases for artist:', userId, err)
      aliasesMap.value[userId] = []
      return []
    }
  }

  async function fetchUserDetails(userId: string): Promise<UserItem | null> {
    try {
      return await catalogService.getUserDetails(userId)
    } catch (err) {
      console.warn('Failed to load user details:', userId, err)
      return null
    }
  }

  async function createTrack(userId: string, payload: AddTrackPayload): Promise<TrackItem> {
    isSubmitting.value = true
    errorMessage.value = null
    try {
      const created = await catalogService.addTrack(userId, payload)
      created.coverUrl = STATIC_COVER_PLACEHOLDER
      await fetchTracks()
      return created
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateArtist(userId: string, newName: string): Promise<UserItem> {
    isSubmitting.value = true
    errorMessage.value = null
    try {
      const updated = await catalogService.updateUser(userId, { name: newName })
      await fetchArtistAliases(userId)
      await fetchArtists()
      return updated
    } finally {
      isSubmitting.value = false
    }
  }

  async function registerUser(payload: RegisterUserPayload): Promise<UserItem> {
    isSubmitting.value = true
    errorMessage.value = null
    try {
      const created = await catalogService.registerUser(payload)
      await fetchArtists()
      return created
    } finally {
      isSubmitting.value = false
    }
  }

  async function initializeCatalog() {
    await checkConnection()
    await Promise.allSettled([
      fetchArtistOfTheDay(),
      fetchTracks(),
      fetchArtists()
    ])
  }

  return {
    isBackendLive,
    isCheckingHealth,
    artistOfTheDay,
    tracks,
    artists,
    aliasesMap,
    tracksCursor,
    hasMoreTracks,
    isLoadingTracks,
    isLoadingArtists,
    isLoadingArtistOfTheDay,
    isSubmitting,
    errorMessage,
    checkConnection,
    fetchArtistOfTheDay,
    fetchTracks,
    fetchArtists,
    fetchArtistAliases,
    fetchUserDetails,
    createTrack,
    updateArtist,
    registerUser,
    initializeCatalog
  }
})
