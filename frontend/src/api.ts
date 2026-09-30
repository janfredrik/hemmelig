const BASE = '/api/v1'

// Error bodies are JSON from the Go server, but a proxy in front of it may answer with HTML.
async function errorFrom(res: Response, fallback: string): Promise<Error> {
  try {
    const body = await res.json()
    if (body?.error) return new Error(body.error)
  } catch { /* not JSON */ }
  return new Error(fallback)
}

export interface SecretMeta {
  id: string
  isPasswordProtected: boolean
  remainingViews: number
  expiresAt: string
}

export async function apiCreateSecret(opts: {
  encryptedData: string
  maxViews: number
  expiresIn: number
  password: string
  isPasswordProtected: boolean
}): Promise<string> {
  const res = await fetch(`${BASE}/secrets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  })
  if (!res.ok) throw await errorFrom(res, 'Failed to create secret')
  return (await res.json()).id
}

export async function apiGetMeta(id: string): Promise<SecretMeta> {
  const res = await fetch(`${BASE}/secrets/${id}`)
  if (!res.ok) throw await errorFrom(res, 'Could not load this secret. Try again in a moment.')
  return res.json()
}

export async function apiReveal(id: string, password?: string): Promise<string> {
  const res = await fetch(`${BASE}/secrets/${id}/reveal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password ?? '' }),
  })
  if (!res.ok) throw await errorFrom(res, 'Failed to reveal secret')
  return (await res.json()).encryptedData
}

export async function apiBurn(id: string): Promise<void> {
  const res = await fetch(`${BASE}/secrets/${id}`, { method: 'DELETE' })
  if (!res.ok) throw await errorFrom(res, 'Failed to burn secret')
}
