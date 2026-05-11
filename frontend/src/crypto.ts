const ALGO = { name: 'AES-GCM', length: 256 } as const
const IV_LEN = 12

export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(ALGO, true, ['encrypt', 'decrypt'])
}

export async function keyToBase64url(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key)
  return btoa(String.fromCharCode(...new Uint8Array(raw)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function base64urlToKey(b64: string): Promise<CryptoKey> {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    b64.length + (4 - b64.length % 4) % 4, '='
  )
  const raw = Uint8Array.from(atob(padded), c => c.charCodeAt(0))
  return crypto.subtle.importKey('raw', raw, ALGO, false, ['decrypt'])
}

export async function encrypt(plaintext: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN))
  const encoded = new TextEncoder().encode(plaintext)
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  const out = new Uint8Array(IV_LEN + cipher.byteLength)
  out.set(iv)
  out.set(new Uint8Array(cipher), IV_LEN)
  return btoa(String.fromCharCode(...out))
}

export async function decrypt(b64: string, key: CryptoKey): Promise<string> {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: bytes.slice(0, IV_LEN) },
    key,
    bytes.slice(IV_LEN),
  )
  return new TextDecoder().decode(plain)
}
