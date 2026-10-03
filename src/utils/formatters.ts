/**
 * Format milliseconds into MM:SS format (e.g. 210000 -> "3:30")
 */
export function formatDuration(durationMs?: number): string {
  if (!durationMs || durationMs <= 0) return '0:00'
  const totalSeconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Parse string duration ("3:30", "03:45", or seconds "210") into milliseconds
 */
export function parseDurationToMs(input: string): number {
  if (!input) return 0
  const trimmed = input.trim()
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':')
    const minutes = parseInt(parts[0], 10) || 0
    const seconds = parseInt(parts[1], 10) || 0
    return (minutes * 60 + seconds) * 1000
  }
  const numeric = parseInt(trimmed, 10)
  if (isNaN(numeric)) return 0
  // If user entered less than 1000, treat as seconds; otherwise treat as ms
  return numeric < 1000 ? numeric * 1000 : numeric
}

/**
 * Format ISO date string into readable date (e.g., "Nov 18, 2008")
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown date'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}
