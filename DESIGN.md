---
name: Hemmelig
description: Share a secret once. Encrypted in the browser, destroyed after the last view.
colors:
  bg: "#f6f7f9"
  surface: "#ffffff"
  subtle: "#f2f4f7"
  border: "#e2e5eb"
  ink: "#101623"
  muted: "#586173"
  accent: "#2559eb"
  on-accent: "#ffffff"
  accent-soft: "#e9effe"
  success: "#158052"
  success-soft: "#e6f6ee"
  danger: "#be2424"
  danger-soft: "#feeded"
  bg-dark: "#0b0d12"
  surface-dark: "#14171e"
  subtle-dark: "#1b1f28"
  border-dark: "#292e3a"
  ink-dark: "#eceef3"
  muted-dark: "#9ba3b4"
  accent-dark: "#5c8aff"
  on-accent-dark: "#060c20"
  accent-soft-dark: "#1b2546"
  success-dark: "#4ed096"
  success-soft-dark: "#102a20"
  danger-dark: "#f87676"
  danger-soft-dark: "#381518"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "52px"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  wordmark:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  control-label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
  secret:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "tnum"
  link:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  key: "3px"
  segment: "7px"
  option: "9px"
  control: "10px"
  card: "14px"
  pill: "9999px"
spacing:
  hair: "6px"
  xs: "12px"
  sm: "16px"
  md: "20px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-primary-hero:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    height: "48px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "#2559ebe6"
  button-primary-disabled:
    backgroundColor: "{colors.subtle}"
    textColor: "{colors.muted}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.subtle}"
  button-danger-quiet:
    textColor: "{colors.danger}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-danger-quiet-hover:
    backgroundColor: "{colors.danger-soft}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.bg}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "20px 24px"
  expiry-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.option}"
    height: "40px"
  expiry-option-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
  stepper:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.secret}"
    rounded: "{rounded.option}"
    height: "40px"
  switch-off:
    backgroundColor: "{colors.border}"
    rounded: "{rounded.pill}"
    width: "44px"
    height: "26px"
  switch-on:
    backgroundColor: "{colors.accent}"
  banner-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  banner-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  banner-views:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    padding: "16px 24px"
  key-mark:
    textColor: "{colors.accent}"
    typography: "{typography.link}"
    rounded: "{rounded.key}"
  medallion:
    rounded: "{rounded.pill}"
    size: "56px"
  trust-chip:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    size: "28px"
---

# Design System: Hemmelig

## Overview

**Creative North Star: "The Category Standard, Played Straight"**

Hemmelig looks like the tool you already trust for this job: a calm, exact utility in the lineage of 1Password, Bitwarden Send, Stripe and Apple settings. Every route is one focused card on a cool-grey ground, with a short sentence-case headline above it and nothing competing beside it. The craft lives in proportion, hairlines, type spacing and state handling, not in decoration.

Density is moderate and even: 44px controls, 20 to 24px card padding, a single column capped at 720px. One confident blue does all the work of "act here": the primary button, focus, the selected option, and the key segment of the link. Green appears only when something succeeded; red only when something is destroyed or failed. The dark theme mirrors the light one on near-black slate rather than reinterpreting it.

The user tried and rejected a themed "security envelope" world. Nothing from it survives: no envelope, seal, stamp, postal label or "Rekommandert" framing anywhere in the visual system or copy.

**Key Characteristics:**
- One card per route, centred, on a cool-grey ground.
- Hairline 1px borders plus a soft, low ambient shadow; 14px card corners, 10px control corners.
- A single blue accent; green and red are strictly semantic.
- Schibsted Grotesk for everything readable; Azeret Mono only for the secret, the link and numbers.
- Light and dark themes are token-for-token mirrors.
- Motion is one short entrance per route, plus two moments on the link page (the check draws, the key glows).

## Colors

A neutral, slightly cool palette carrying one saturated blue and two strictly semantic hues. All colors are defined once as RGB channel triplets (`--c-*` custom properties in `frontend/src/index.css`) and swapped wholesale by the `.dark` class on `<html>`; the hex values in the frontmatter are the same colors.

### Primary
- **Confident Blue** (accent; dark: accent-dark): primary buttons, focus outlines and rings, the text caret, the selected expiry option, the on-state of the passphrase switch, the wordmark tile, the `#key=` segment of the link, and inline links ("Create your own secret"). Nothing decorative is ever blue.
- **Blue Wash** (accent-soft): the tint behind the selected expiry option, the locked-page lock medallion, the 28px icon chips in the create page's trust row, and the "can be viewed N more times" banner. Always paired with Confident Blue text.
- **On Blue** (on-accent): label color on the primary button and the wordmark tile. White in light, deep navy in dark (the dark accent is light enough to need dark text).

### Tertiary
- **Done Green** (success / success-soft): the drawn check medallion on the link page and the "secret was destroyed" confirmation banner on the create page. Used for completed outcomes only.
- **Destroy Red** (danger / danger-soft): burn actions, the burn confirmation panel, validation and error text, error medallions, the last-view banner, and invalid field borders.

### Neutral
- **Cool Grey Ground** (bg): the page behind every card.
- **Paper White** (surface): cards, the header bar, fields, secondary buttons, unselected expiry options.
- **Recessed Grey** (subtle): recessed wells (the link box, the language and theme controls), hover fill for secondary controls, the disabled primary button, the "gone" medallion.
- **Hairline** (border): every 1px border and divider, and the switch's off track.
- **Ink** (ink): primary text.
- **Slate Muted** (muted): labels, hints, counters, the second line of the home headline, the URL base before the key, the trust-row explanations.

### Named Rules
**The One Blue Rule.** The accent means "act here" or "this is the key". It never tints decoration, illustration or backgrounds beyond the soft wash behind a selected or informational element.

**The Semantic Pair Rule.** Green only for a completed outcome, red only for destruction or failure. Neither is used for emphasis or branding.

**The Mirror Rule.** Every color is a `--c-*` token with a light and a dark value; components reference tokens, never raw colors, so both themes stay in lockstep.

## Typography

**Display Font:** Schibsted Grotesk (with system-ui, sans-serif), self-hosted variable woff2, weights 400 to 900
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** Azeret Mono (with ui-monospace, monospace), self-hosted, weights 400 to 600

**Character:** A clear, slightly condensed grotesk set tight and semibold for headings, relaxed for reading, with a crisp monospace reserved for the material being protected. Both fonts are preloaded in `index.html` and use `font-display: swap`.

### Hierarchy
- **Display** (600, 52px desktop / 36px mobile, 1.05, -0.025em, balanced): the create-page headline only, set on two lines with the second line in Slate Muted.
- **Headline** (600, 40px / 32px): the link page ("Your link is ready.").
- **Title** (600, 32px / 28px; 30px / 26px on the unlocked card): locked, gone and error states, and the unlocked card header. Same tight tracking as Display.
- **Wordmark** (600, 19px, -0.02em): "Hemmelig" in the header beside the blue lock tile.
- **Body** (400, 15px, 1.625): ledes and state explanations, capped near 48ch where they sit under a headline.
- **Control label** (600, 14 to 15px): the "Your secret" label, "Max views", "Passphrase", trust-row titles, summary values.
- **Label** (500, 13px, Slate Muted): field labels, hints, the character counter, summary terms. Trust-row explanations use the same 13px Slate Muted at weight 400 and line height 1.5.
- **Button** (500, 15px; 600, 16px on the 48px hero buttons).
- **Secret** (Azeret Mono 400, 15px, 1.7 to 1.75): the textarea, the revealed secret, the passphrase input on the create page.
- **Link** (Azeret Mono, 13.5px): the shareable URL; numbers (character count, stepper value) are mono with tabular figures.

### Named Rules
**The Mono Means Material Rule.** Azeret Mono is used only for the secret itself, the link, the passphrase being chosen, and numbers. Never for headings, labels or decoration.

**The Sentence Rule.** Headlines are plain sentence-case statements ending in a period ("Already gone.", "Open it once."). Buttons are verb-first with no period ("Copy link", "Unlock secret").

## Layout

A single centred column. The header is a 64px bar on Paper White with a hairline bottom border, 16px side padding on phones and 40px from 640px up: wordmark left, language segment and theme toggle right. Main content has 32px vertical padding on phones, 48px from 640px.

Column widths are fixed by task: 720px for the create card and the unlocked secret, 640px for the link page, 460px for the compact locked, gone and error cards. The create route stacks from the top; the other routes centre vertically in the viewport.

Spacing moves on a 4px grid with a small set of recurring steps: 6px between expiry options, 12px inside tight stacks, 16px for control gaps, 20px mobile / 24px desktop card padding, 24px on phones and 32px from 640px up between the headline, the card and the trust row. Settings inside the create card are separated by hairline dividers rather than extra space.

The only breakpoint is 640px. Below it: expiry options go from six columns to a 3 by 2 grid, the trust row goes from three columns to one, the Max views and Passphrase controls each take a full row, the link-page summary goes from three columns to stacked rows, and headline sizes step down. Everything on the create page fits above the fold at 1440 by 900.

## Elevation & Depth

A hybrid of hairlines and one soft ambient shadow. Cards are the only lifted surface; everything inside a card is flat and separated by 1px Hairline dividers or a Recessed Grey well. There are no hard or offset shadows.

### Shadow Vocabulary
- **Card, light** (`box-shadow: 0 1px 2px rgb(16 22 35 / 0.04), 0 8px 24px -12px rgb(16 22 35 / 0.12)`): every card.
- **Card, dark** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.3), 0 12px 32px -16px rgb(0 0 0 / 0.6)`): the same cards in the dark theme.
- **Nudge** (Tailwind `shadow-sm`): the active language segment and the switch thumb, so they read as a raised part of a recessed control.
- **Focus ring** (`0 0 0 3px` accent at 20%): fields and the stepper on focus, with the border turning Confident Blue.
- **Focus outline** (2px solid accent, 2px offset): every other keyboard-focused element, including expiry options.
- **Editor focus** (inset 2px accent): the textarea region of the create card, which has no border of its own.

### Named Rules
**The One Lift Rule.** Only the route's card casts a shadow. Controls inside it stay flat; depth inside the card is made with hairlines and recessed wells.

## Shapes

Softly rounded rectangles in a nested scale: 14px on cards and the burn confirmation panel, 10px on buttons, fields, the link well and banners, 9px on the smaller 40px controls (expiry options, stepper) and the wordmark tile, 7px on segments inside a recessed control, 3px on the highlighted key. Full circles only for the 56px state medallions, the 28px trust-row chips and the switch. All borders are 1px Hairline; there are no heavier strokes, dashed outlines or clipped corners. Icons are 24-unit line icons with a 2px round-capped stroke (2.25 for the check), drawn inline at 14 to 24px.

## Components

### Buttons
Quiet, solid and exact.
- **Shape:** gently rounded (10px), 44px tall, 16px horizontal padding, 8px icon gap.
- **Primary:** Confident Blue fill with On Blue label, weight 600. The create, copy-link and unlock actions use the hero size: 48px, 16px label, full card width.
- **Hover / Focus:** fill drops to 90% opacity over 150ms; keyboard focus shows the 2px accent outline. Disabled primary turns into a Recessed Grey button with a Hairline border and muted label instead of fading.
- **Secondary:** Paper White with Hairline border and Ink label; hover fills Recessed Grey. Used for "New secret", "Cancel" and state-card exits.
- **Danger quiet:** no fill, Destroy Red label, Red Wash on hover. Used for "Burn now" before confirmation.
- **Danger:** solid Destroy Red with a label in the page-ground color (near-white in light, near-black on the lighter dark-theme red), weight 600. Only inside the burn confirmation.
- **Busy:** a 16px spinning ring in the current color, with an "-ing…" label ("Encrypting…", "Decrypting…").

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Paper White; Recessed Grey at 60% for the link-page summary strip.
- **Shadow Strategy:** the Card shadow (see Elevation & Depth).
- **Border:** 1px Hairline.
- **Internal Padding:** 20px mobile, 24px desktop; 32 to 40px on the centred state cards. Sections within a card are split by full-bleed hairlines.

### Inputs / Fields
- **Style:** 44px tall (48px on the recipient's passphrase), 10px radius, Paper White with Hairline border, 14px horizontal padding, 15px text; the caret is Confident Blue.
- **Focus:** border turns Confident Blue with a 3px accent ring at 20%.
- **Error:** border turns Destroy Red (`aria-invalid`); the message sits below in red or in the danger banner.
- **Secret editor:** the textarea is borderless mono text inside the card's top section (150px mobile, 170px desktop minimum, vertically resizable) with the label left and a mono character count right; focus draws an inset 2px accent line around the section.

### Expiry options
Six small radio boxes in one row (3 by 2 on phones): 40px tall, 9px radius, Hairline border, 14px text. The selected box takes the Blue Wash fill, a Confident Blue border and a semibold blue label. Real radio inputs are visually hidden; focus shows the 2px accent outline on the box. Default selection is 3 days.

### Max views stepper
A compact 40px bordered group: minus button, a 36px mono number input with tabular figures, plus button. The ends are 40px square hit areas with muted icons that darken on hover and fade to 40% at the 1 and 100 limits. Its label and a muted one-line hint ("Deleted after the last view") sit to its left. It shares one row with the Passphrase switch, separated from the expiry options by a hairline.

### Passphrase switch
A 44 by 26px pill track, Hairline grey when off and Confident Blue when on, with a 20px white thumb that slides 18px over 200ms. It is a `role="switch"` button labelled "Passphrase". The passphrase field and its hint ("Send it separately from the link.") appear only while the switch is on, entering with the rise motion and taking focus.

### Status banners
Soft-tinted rows with icon and text, 14px medium weight:
- **Success** (Done Green on Green Wash, 10px radius): after a burn, on the create page.
- **Error** (Destroy Red on Red Wash, 10px radius, alert icon): validation and network errors directly above the primary button; it collapses when empty.
- **Views remaining** (Confident Blue on Blue Wash, eye icon) and **Last view** (Destroy Red on Red Wash, flame icon): full-bleed across the foot of the unlocked card.

### Burn confirmation
Burning is two steps. "Burn now" (danger quiet) swaps in place for an inline `alertdialog` panel: 14px radius, Red Wash fill, 1px Destroy Red border at 30%, the question in red medium text, and a secondary "Cancel" (focused by default) beside a solid danger "Burn it". It enters with the rise motion. There is no modal.

### Link display
The link sits in a Recessed Grey well with a Hairline border and 10px radius, mono 13.5px, select-all on click. The base URL is Slate Muted; the `#key=…` fragment is Confident Blue, medium weight, on a 3px-radius blue highlight. Below it, a summary strip lists Expires, Views and Passphrase with 15px line icons.

### State medallions
56px circles with a 24px line icon on a soft tint: Blue Wash and lock for the locked state, Green Wash with the drawn check for a created link, Recessed Grey and flame for "Already gone", Red Wash and alert for errors. They sit centred above the state's headline.

### Trust row
Three plain facts below the create card, a binding user choice that replaced an earlier one-line trust line. It is a list: one column on phones and three from 640px up, with a 16px gap (24px from 640px). Each item has a 28px round Blue Wash chip holding a 16px Confident Blue line icon (lock, shield, flame), then a 14px semibold title over a 13px muted explanation. The copy covers only what the code does: encryption in the browser, the key after the `#`, and deletion after the last view or when time runs out. The items have no border, fill or shadow; they are not cards.

### Navigation
The header only. Wordmark: a 32px Confident Blue tile (9px radius) with a white 16px lock, then "Hemmelig" in the wordmark style; it links home. Right side: a 44px recessed EN/NO segmented control (the active segment is a raised Paper White chip with a subtle shadow; `aria-pressed`) and a 44px square theme toggle showing the sun or the moon.

### Motion
- **Rise:** each route's content (and the burn panel and passphrase field) fades in from 6px below over 280ms on `cubic-bezier(0.16, 1, 0.3, 1)`. Content is visible by default; there is one entrance per route.
- **Check draw:** the link page's check stroke draws over 420ms after a 180ms delay, same curve.
- **Key highlight:** the link's key fragment starts at 22% accent tint and settles to 8% over 1200ms after a 400ms delay.
- **State transitions:** colors and borders over 150ms; the switch over 200ms.
- **Reduced motion:** rise and key glow are removed, and the check shows fully drawn.

### Bilingual copy
English and Norwegian bokmål share one typed dictionary, so every key must exist in both. The toggle reads "EN / NO", the choice is saved, first visit follows the browser language, and `<html lang>` and the document title update with it. Plurals use `.one` / `.other` variants. Layouts must hold the longer Norwegian strings: the six expiry labels stay on one line from 640px up, and each trust-row title and explanation wraps inside its own column.

## Do's and Don'ts

### Do:
- **Do** give each route one centred card (720, 640 or 460px wide) on the Cool Grey Ground, with at most a headline above it and, below it, either the create page's three-column trust row or an action row.
- **Do** reference colors only through the `--c-*` tokens so light and dark stay mirrored.
- **Do** keep Confident Blue for primary actions, focus, selection and the link key; keep green for success and red for destruction.
- **Do** set the secret, the link and numbers in Azeret Mono with tabular figures, and everything else in Schibsted Grotesk.
- **Do** keep controls at 44px minimum height (40px for in-card option boxes and the stepper) with 10px radii, and cards at 14px.
- **Do** make destruction two-step and inline: a quiet danger button, then a red confirmation panel with Cancel focused first.
- **Do** write sentence-case headlines ending in a period, verb-first button labels, and state what the code actually does.
- **Do** add every new string to both the English and the Norwegian dictionaries and check the Norwegian layout at 375px and 1440px.
- **Do** limit motion to the rise entrance and state feedback, on the `cubic-bezier(0.16, 1, 0.3, 1)` curve, and honor reduced motion.

### Don't:
- **Don't** use themed metaphors: no envelopes, seals, stamps, postal labels, "Rekommandert" markings, vault doors or other staged props. Lock, unlock, shield, flame and check icons are functional signals and stay.
- **Don't** add marketing chrome: no gradient heroes, feature-card grids, blobs, testimonials or badge rows. The trust row stays three unboxed items, never cards.
- **Don't** collapse the trust row back into a one-line trust line; the user chose the three-column row.
- **Don't** add a lede, kicker or eyebrow above or below the create headline.
- **Don't** put shadows on controls inside a card, or use hard, offset or colored shadows.
- **Don't** use blue, green or red decoratively, or add a second accent hue.
- **Don't** use mono for headings or labels, or a display face other than Schibsted Grotesk.
- **Don't** turn the expiry options back into a dropdown or split Max views and Passphrase onto separate sections.
- **Don't** show the passphrase field or its hint while the passphrase switch is off.
