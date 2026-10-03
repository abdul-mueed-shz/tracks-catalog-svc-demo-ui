// Strong TypeScript definitions aligning with OpenAPI spec in api/catalog-api.ts and backend DTOs

export interface UserSummary {
  id: string
  uuid: string
  name: string
  isArtist?: boolean
}

export interface UserItem {
  id: string
  uuid: string
  name: string
  isArtist: boolean
  createdAt?: string
  updatedAt?: string
}

export interface TrackItem {
  id: string
  uuid: string
  title: string
  genre: string
  durationMs: number
  releaseDate: string
  user: UserSummary
  createdAt?: string
  updatedAt?: string
  coverUrl?: string // Client-side cover art helper
}

export interface UserAliasItem {
  id: string
  uuid: string
  aliasName: string
  normalizedName?: string
  createdAt?: string
  updatedAt?: string
}

export interface ArtistOfTheDay {
  id: string
  uuid: string
  name: string
  isArtist?: boolean
}

export interface PageResponse<T> {
  cursor?: string | null
  size: number
  data: T[]
}

export interface RegisterUserPayload {
  name: string
  isArtist: boolean
}

export interface UpdateUserPayload {
  name: string
}

export interface AddTrackPayload {
  title: string
  genre: string
  durationMs: number
  releaseDate: string
}

export interface TrackQueryParams {
  userId?: string
  userName?: string
  cursor?: string
  size?: number
  property?: string
  direction?: 'ASC' | 'DESC'
}

export interface UserQueryParams {
  isArtist?: boolean
  cursor?: string
  size?: number
  property?: string
  direction?: 'ASC' | 'DESC'
}
