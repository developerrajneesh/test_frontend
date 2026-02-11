export function getEnv(name, fallback = undefined) {
  return import.meta.env?.[name] ?? fallback
}

export function getApiBaseUrl() {
  return (
    getEnv('VITE_API_URL') ||
    getEnv('VITE_REACT_APP_API_URL') ||
    ''
  )
}

export function buildQuery(params = {}) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    sp.set(key, String(value))
  })
  const qs = sp.toString()
  return qs ? `?${qs}` : ''
}

export function getErrorMessage(err, fallback = 'Something went wrong') {
  if (!err) return fallback

  const maybeAxiosMessage =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    err?.toString?.()

  if (typeof maybeAxiosMessage === 'string' && maybeAxiosMessage.trim()) {
    return maybeAxiosMessage.trim()
  }

  const maybeSupabase = err?.error?.message || err?.message
  if (typeof maybeSupabase === 'string' && maybeSupabase.trim()) {
    return maybeSupabase.trim()
  }

  return fallback
}

export function formatDateTime(value) {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

