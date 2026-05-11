const BASE = '/api/v1'

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
  if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to create secret')
  return (await res.json()).id
}

export async function apiGetMeta(id: string): Promise<SecretMeta> {
  const res = await fetch(`${BASE}/secrets/${id}`)
  if (!res.ok) throw new Error((await res.json()).error ?? 'Secret not found')
  return res.json()
}

export async function apiReveal(id: string, password?: string): Promise<string> {
  const res = await fetch(`${BASE}/secrets/${id}/reveal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password ?? '' }),
  })
  if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to reveal secret')
  return (await res.json()).encryptedData
}

export async function apiBurn(id: string): Promise<void> {
  await fetch(`${BASE}/secrets/${id}`, { method: 'DELETE' })
}
