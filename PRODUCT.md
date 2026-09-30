# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Senders:** anyone on the public internet who needs to hand over a password, API key, recovery code, or private note without leaving it in chat or email history. They arrive, paste, set limits, copy a link, and leave — usually in under a minute.
- **Recipients:** a mix of non-technical people (family, clients, colleagues who have never heard of Hemmelig) and technical peers who understand end-to-end encryption and the `#key` fragment. For the non-technical recipient, the open page must read as trustworthy rather than as phishing.

## Product Purpose

Hemmelig lets someone share a secret once, safely. The message is encrypted in the sender's browser, the server stores only ciphertext, and the secret destroys itself after its last permitted view or when time runs out. Success is a secret that reaches exactly the intended person and then no longer exists anywhere.

## Positioning

Zero-knowledge by construction: AES-256-GCM encryption happens in the browser via the Web Crypto API, and the decryption key lives only in the URL fragment after `#`, which browsers never send to the server. The server cannot read what it stores. It is also self-hostable as a single small Docker image (Go + SQLite).

## Operating Context

- Deployed publicly as a self-hosted instance (Docker; originally built for Unraid).
- Senders often come from a chat, ticket, or email thread where they were about to paste a credential.
- Recipients arrive cold from a link in a message, frequently on a phone.
- May be served over plain HTTP on a LAN, where Web Crypto and the async clipboard are unavailable; the UI must explain this rather than fail silently.

## Capabilities and Constraints

- Create: secret text, expiry (1 hour, 6 hours, 1 day, 3 days, 7 days, 30 days; default 3 days), max views (1–100), optional passphrase (bcrypt-hashed server-side, sent separately from the link).
- Created: shareable link, summary of limits, manual "burn now".
- Open: metadata preview (views left, expiry, passphrase required) before an explicit unlock; each unlock consumes a view; last view destroys the secret.
- States: loading, locked, wrong passphrase, unlocked, last-view destroyed, already gone (expired/burned/not found), error (missing/damaged key, insecure context).
- No accounts, no titles, no file attachments, no analytics.
- Interface language: English and Norwegian (bokmål), switchable by the visitor.

## Brand Commitments

- Name: **Hemmelig** (Norwegian for "secret").
- Voice: plain, calm, precise about what is and isn't protected. No fear-mongering, no unverifiable security claims.
- Visual standing preference (chosen 2026-09-30 after trying a themed "security envelope" world): the category standard, executed at the craft level of 1Password / Bitwarden Send and Stripe / Apple. No themed metaphors, no postal/"Rekommandert" labelling.

## Evidence on Hand

No testimonials, user counts, audits, or certifications exist. Do not fabricate any. The only security claims that may be made are the ones the code implements (client-side AES-256-GCM, key in URL fragment, bcrypt passphrase, deletion after last view or expiry).

## Product Principles

1. **Say only what is true.** Every security statement maps to something the code does.
2. **Trust at first glance for strangers.** The recipient's page must feel legitimate to someone who has never seen the product.
3. **One minute, one task.** Sending is paste → limits → copy. Nothing competes with that path.
4. **Irreversibility is explicit.** Anything that consumes a view or destroys a secret is announced before it happens.

## Accessibility & Inclusion

WCAG 2.2 AA. Recipients are frequently on phones and may be non-technical; all states must be reachable by keyboard and announced to screen readers. Both languages must fit without layout breakage.
