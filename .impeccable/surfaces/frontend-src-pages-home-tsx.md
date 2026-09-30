---
version: 1
slug: "frontend-src-pages-home-tsx"
primary_target: "frontend/src/pages/Home.tsx"
related_targets: ["frontend/src/pages/SecretCreated.tsx","frontend/src/pages/ViewSecret.tsx"]
---

# Surface: Hemmelig app (create, link ready, open secret)

Scope: the whole three-route app — create (`/`), created (`/created/:id`), open (`/secret/:id`) and its locked / unlocked / gone / error states. Visitor mode: **Operate**.

Audience and job: public senders sharing a credential in under a minute; recipients (technical and not) opening it once, often on a phone. Must keep: light + dark themes, single-page create form, English/Norwegian switch. Must avoid: generic SaaS clutter (gradient blobs, card grids), bank-sterile coldness. The security-envelope world was tried and rejected; no postal labels.

Memorable moment: the sender getting their link.

## Direction contract

THESIS: The category standard played straight — a calm, precise secret-sharing tool at 1Password / Bitwarden Send and Stripe / Apple craft. One focused card per route; nothing competes with the task. Refuses: marketing chrome, feature-card grids, gradient heroes.

OWN-WORLD: Neutral cool-grey ground, white surfaces with 1px hairline borders and a soft offset shadow, 14px radius; one confident blue accent for primary actions, focus and the link key; green only for success, red only for destruction. Schibsted Grotesk at 600 for headings (tight but not heavy), 400–500 for UI; Azeret Mono only for the secret, the link and numbers. Dark theme mirrors it on near-black slate.

STORY: Sender pastes, picks limits, gets a link with the key visibly marked, copies it. Recipient sees who/what/how-many-views before anything is spent, unlocks, copies, and is told plainly when it is gone.

FIRST VIEWPORT: Header (wordmark left; EN/NO + theme right). Centred headline "Passwords don't belong in chat history." (~52px, 600) with the one-line lede under it. Below, a single 720px card: secret textarea on top, a settings row (Expires select, Max views stepper, Passphrase switch) under a hairline, and the full-width primary button at the card's foot. A quiet three-point trust line under the card. Everything above the fold at 1440×900; on phones the settings stack.

SIGNATURE: On success the link page's check mark draws itself and the link field arrives with the key segment highlighted; copy confirms inline. Motion grammar: short (150–300ms) exponential ease-out, one entrance per route, reduced-motion shows end states.

FORM: Category standard (canon), chosen by the user over the rolled hand; seed key 1b48fe81.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
