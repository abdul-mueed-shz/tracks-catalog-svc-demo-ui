import { apiClient } from './api'
import type {
  ArtistOfTheDay,
  TrackItem,
  UserItem,
  UserAliasItem,
  PageResponse,
  TrackQueryParams,
  UserQueryParams,
  AddTrackPayload,
  RegisterUserPayload,
  UpdateUserPayload
} from '@/types/catalog'

export const catalogService = {
  /**
   * Fetch current Artist of the Day (GET /catalog-svc/artist-of-the-day)
   */
  async getArtistOfTheDay(): Promise<ArtistOfTheDay> {
    const response = await apiClient.get<ArtistOfTheDay>('/artist-of-the-day')
    return response.data
  },

  /**
   * Query tracks with keyset/cursor pagination & filters (GET /catalog-svc/tracks)
   */
  async getTracks(params?: TrackQueryParams): Promise<PageResponse<TrackItem>> {
    const response = await apiClient.get<PageResponse<TrackItem>>('/tracks', {
      params: {
        userId: params?.userId || undefined,
        userName: params?.userName || undefined,
        cursor: params?.cursor || undefined,
        size: params?.size || 12,
        property: params?.property || 'createdAt',
        direction: params?.direction || 'DESC'
      }
    })
    return response.data
  },

  /**
   * Add a new track to an artist's catalog (POST /catalog-svc/tracks/user/{userId}/add)
   */
  async addTrack(userId: string, payload: AddTrackPayload): Promise<TrackItem> {
    const response = await apiClient.post<TrackItem>(`/tracks/user/${userId}/add`, payload)
    return response.data
  },

  /**
   * List users/artists with cursor pagination (GET /catalog-svc/users)
   */
  async getUsers(params?: UserQueryParams): Promise<PageResponse<UserItem>> {
    const response = await apiClient.get<PageResponse<UserItem>>('/users', {
      params: {
        isArtist: params?.isArtist !== undefined ? params.isArtist : true,
        cursor: params?.cursor || undefined,
        size: params?.size || 20,
        property: params?.property || 'createdAt',
        direction: params?.direction || 'DESC'
      }
    })
    return response.data
  },

  /**
   * Get single user/artist details (GET /catalog-svc/users/{userId})
   */
  async getUserDetails(userId: string): Promise<UserItem> {
    const response = await apiClient.get<UserItem>(`/users/${userId}`)
    return response.data
  },

  /**
   * Register a new user or artist (POST /catalog-svc/users)
   */
  async registerUser(payload: RegisterUserPayload): Promise<UserItem> {
    const response = await apiClient.post<UserItem>('/users', payload)
    return response.data
  },

  /**
   * Update artist/user name (PATCH /catalog-svc/users/{userId})
   * Automatically archives previous name as alias in the backend
   */
  async updateUser(userId: string, payload: UpdateUserPayload): Promise<UserItem> {
    const response = await apiClient.patch<UserItem>(`/users/${userId}`, payload)
    return response.data
  },

  /**
   * Fetch historical aliases for an artist (GET /catalog-svc/users/{userId}/aliases)
   */
  async getUserAliases(userId: string): Promise<UserAliasItem[]> {
    const response = await apiClient.get<UserAliasItem[]>(`/users/${userId}/aliases`)
    return response.data
  }
}
