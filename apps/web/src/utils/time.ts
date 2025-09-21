export const formatRelativeTime = (timestamp: string): string => {
  const target = new Date(timestamp).getTime()
  const diffMs = Date.now() - target

  if (Number.isNaN(target)) {
    return '—'
  }

  const minutes = Math.max(Math.floor(diffMs / 60000), 0)
  if (minutes < 1) {
    return 'just now'
  }

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days}d ago`
  }

  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}
