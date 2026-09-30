# Hemmelig

Share passwords, API keys and private notes through a link that works once and then self-destructs. The secret is encrypted in your browser before it leaves, so the server only ever stores ciphertext.

*Hemmelig* is Norwegian for "secret". The interface is available in English and Norwegian (bokmål), with light and dark themes.

## How it works

1. You paste a secret and choose how long it lives (1 hour to 30 days) and how many times it can be opened (1–100).
2. Your browser generates a fresh 256-bit key and encrypts the secret with **AES-256-GCM** (Web Crypto API).
3. Only the ciphertext is uploaded. The key is placed in the link **after the `#`**, and browsers never send that part to the server.
4. The recipient opens the link, sees how many views are left, and unlocks it. Decryption happens in their browser.
5. After the last view, or when time runs out, the secret is deleted. The sender can also burn it right away.

Optionally, you can add a **passphrase**. It is hashed with bcrypt on the server and must be entered before the ciphertext is released. Send it through a different channel than the link.

## Run with Docker

A prebuilt image is published to the GitHub Container Registry on every push to `main`:

```bash
docker run -d --name hemmelig -p 3000:3000 -v hemmelig_data:/data ghcr.io/janfredrik/hemmelig:latest
```

Or build it yourself with Docker Compose:

```bash
docker compose up -d
```

Then open <http://localhost:3000>.

The image is about 15 MB and uses very little memory. Data is stored in SQLite at `/data/hemmelig.db`, so mount `/data` as a volume to keep secrets across restarts.

### Unraid

Add a container using `ghcr.io/janfredrik/hemmelig:latest`, map port `3000`, and map a path such as `/mnt/user/appdata/hemmelig` to `/data`.

### Configuration

| Variable  | Default             | Description                 |
|-----------|---------------------|-----------------------------|
| `PORT`    | `3000`              | Port the server listens on  |
| `DB_PATH` | `/data/hemmelig.db` | Location of the SQLite file |
| `TZ`      | —                   | Optional timezone for logs  |

### HTTPS is required outside localhost

Browsers only allow encryption (Web Crypto) on secure pages. Serve Hemmelig over **HTTPS**, for example behind a reverse proxy such as Nginx Proxy Manager, Caddy or Traefik, or open it on `localhost`. Over plain HTTP on a LAN address, the app shows a message explaining this instead of creating secrets.

## Development

Requirements: Node 20+ and Go 1.23+.

```bash
# Backend (API on :3000)
cd backend
DB_PATH=./hemmelig.db go run .
```

```bash
# Frontend (Vite dev server, proxies /api to :3000)
cd frontend
npm install
npm run dev
```

## Tech stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS. The fonts (Schibsted Grotesk, Azeret Mono) are self-hosted, so the app makes no third-party requests.
- **Backend:** Go (chi router) with SQLite (`modernc.org/sqlite`, pure Go, no CGO). The built frontend is embedded in the binary.
- **Image:** multi-stage Docker build on Alpine.

## API

| Method   | Endpoint                      | Description                                             |
|----------|-------------------------------|---------------------------------------------------------|
| `POST`   | `/api/v1/secrets`             | Store ciphertext; returns an `id`                       |
| `GET`    | `/api/v1/secrets/:id`         | Metadata: views left, expiry, whether a passphrase is required |
| `POST`   | `/api/v1/secrets/:id/reveal`  | Returns the ciphertext and consumes one view            |
| `DELETE` | `/api/v1/secrets/:id`         | Burn a secret immediately                               |

## Project docs

- [PRODUCT.md](PRODUCT.md): who Hemmelig is for, its principles and constraints.
- [DESIGN.md](DESIGN.md): the design system (colors, type, components, motion).
