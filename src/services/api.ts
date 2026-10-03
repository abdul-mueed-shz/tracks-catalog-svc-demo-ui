import axios, { AxiosError } from 'axios'

// Configurable base URL: In Vite dev mode, requests to /catalog-svc proxy to http://localhost:8080/catalog-svc
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/catalog-svc'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Quick health check to test backend reachability on port 8080
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await apiClient.get('/actuator/health', { timeout: 3000 })
    return res.status === 200 && (res.data?.status === 'UP' || res.data?.status === 'UNKNOWN')
  } catch (err) {
    // If actuator is not directly exposed, ping /users or /tracks
    try {
      const ping = await apiClient.get('/users', { params: { size: 1 }, timeout: 3000 })
      return ping.status === 200
    } catch (err2) {
      if (axios.isAxiosError(err2) && err2.response) {
        // Backend responded with an HTTP status code, so the server is reachable
        return true
      }
      return false
    }
  }
}

export function formatErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string; detail?: string; error?: string }>
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message
    }
    if (axiosErr.response?.data?.detail) {
      return axiosErr.response.data.detail
    }
    if (axiosErr.response?.data?.error) {
      return axiosErr.response.data.error
    }
    if (axiosErr.code === 'ERR_NETWORK') {
      return 'Cannot reach backend server. Please verify backend is running on http://localhost:8080.'
    }
    return axiosErr.message || 'API request failed'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
