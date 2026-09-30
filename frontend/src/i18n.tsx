import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'en' | 'nb'

const en = {
  'meta.title': 'Hemmelig — share secrets once',
  'nav.home': 'Hemmelig, create a new secret',
  'theme.toLight': 'Switch to light theme',
  'theme.toDark': 'Switch to dark theme',
  'lang.label': 'Language',

  'home.title.a': 'Passwords don’t belong',
  'home.title.b': 'in chat history.',
  'home.secret': 'Your secret',
  'home.placeholder': 'Paste a password, an API key, a private note…',
  'home.chars.one': 'character',
  'home.chars.other': 'characters',
  'home.expires': 'Expires after',
  'home.views': 'Max views',
  'home.viewsHint': 'Deleted after the last view',
  'home.fewer': 'Fewer views',
  'home.more': 'More views',
  'home.passphrase': 'Passphrase',
  'home.passphrasePlaceholder': 'Choose a passphrase',
  'home.passphraseHint': 'Send it separately from the link.',
  'home.submit': 'Encrypt & create link',
  'home.submitting': 'Encrypting…',
  'home.err.empty': 'Write or paste the secret you want to share.',
  'home.err.passphrase': 'Choose a passphrase, or turn passphrase protection off.',
  'home.err.generic': 'Something went wrong.',
  'home.burned': 'The secret was destroyed. The link no longer works.',
  'home.fine.1.t': 'Encrypted in your browser',
  'home.fine.1.b': 'AES-256-GCM via the Web Crypto API.',
  'home.fine.2.t': 'The key stays in the link',
  'home.fine.2.b': 'It sits after the #, so it is never sent to the server.',
  'home.fine.3.t': 'Burns after reading',
  'home.fine.3.b': 'Gone after the last view or when time runs out.',

  'expiry.3600': '1 hour',
  'expiry.21600': '6 hours',
  'expiry.86400': '1 day',
  'expiry.259200': '3 days',
  'expiry.604800': '7 days',
  'expiry.2592000': '30 days',

  'created.title': 'Your link is ready.',
  'created.lede.a': 'Share it through a channel you trust. The decryption key is the part after',
  'created.lede.b': '— it can’t be recovered if lost.',
  'created.link': 'Secret link',
  'created.copy': 'Copy link',
  'created.copied': 'Copied',
  'created.copyFailed': 'Couldn’t copy automatically. Select the link above and copy it by hand.',
  'created.expires': 'Expires',
  'created.in': 'In {x}',
  'created.views': 'Views',
  'created.view.one': '1 view',
  'created.view.other': '{n} views',
  'created.passphrase': 'Passphrase',
  'created.required': 'Required',
  'created.none': 'None',
  'created.missing': 'The link is no longer available on this page — please create a new secret.',
  'created.new': 'New secret',
  'created.burn': 'Burn now',
  'created.burning': 'Burning…',
  'created.burnAsk': 'Destroy this secret for good? The link stops working immediately.',
  'created.burnYes': 'Burn it',
  'created.cancel': 'Cancel',
  'created.burnFailed': 'Could not reach the server — the secret was not burned. Try again.',

  'view.loading': 'Loading secret…',
  'view.locked.title.one': 'Open it once.',
  'view.locked.title.other': 'You’ve received a secret.',
  'view.locked.uses': 'Opening it now uses one view.',
  'view.locked.body.a': 'Someone sent you a secret. It can be viewed',
  'view.locked.body.b': '. After that it’s destroyed for good.',
  'view.moreTimes.one': '1 more time',
  'view.moreTimes.other': '{n} more times',
  'view.passphrase': 'Passphrase',
  'view.passphrasePlaceholder': 'Enter the passphrase you were given',
  'view.open': 'Unlock secret',
  'view.opening': 'Decrypting…',
  'view.viewsLeft.one': '1 view left',
  'view.viewsLeft.other': '{n} views left',
  'view.wrongPass': 'Incorrect passphrase. Please try again.',
  'view.unlocked.title': 'Here’s your secret.',
  'view.unlocked.sub': 'Decrypted in your browser.',
  'view.copy': 'Copy',
  'view.copied': 'Copied',
  'view.remaining.one': 'This secret can be viewed 1 more time.',
  'view.remaining.other': 'This secret can be viewed {n} more times.',
  'view.destroyed': 'That was the last view — this secret is now destroyed. Save what you need before closing the tab.',
  'view.createOwn': 'Create your own secret',
  'view.gone.title': 'Already gone.',
  'view.gone.body': 'This secret has been viewed or has expired, and no longer exists.',
  'view.gone.action': 'Create a new secret',
  'view.error.title': 'Something went wrong.',
  'view.error.action': 'Go home',
  'view.err.invalid': 'Invalid secret URL.',
  'view.err.noKey': 'Decryption key missing from URL. Make sure you copied the full link.',
  'view.err.badKey': 'The decryption key in this link is damaged. Ask the sender for the full link again.',
  'view.err.mismatch': 'This link’s key doesn’t match the secret, so it couldn’t be decrypted. Ask the sender to check they shared the full link.',

  'expiresIn.minute': 'Expires in a minute',
  'expiresIn.minutes': 'Expires in {n} minutes',
  'expiresIn.hour': 'Expires in 1 hour',
  'expiresIn.hours': 'Expires in {n} hours',
  'expiresIn.days': 'Expires in {n} days',

  'err.insecure': 'Encryption needs a secure connection. Open Hemmelig over HTTPS (or on localhost) and try again.',
}

type Key = keyof typeof en

const nb: Record<Key, string> = {
  'meta.title': 'Hemmelig — del hemmeligheter én gang',
  'nav.home': 'Hemmelig, lag en ny hemmelighet',
  'theme.toLight': 'Bytt til lyst tema',
  'theme.toDark': 'Bytt til mørkt tema',
  'lang.label': 'Språk',

  'home.title.a': 'Passord hører ikke hjemme',
  'home.title.b': 'i chatloggen.',
  'home.secret': 'Din hemmelighet',
  'home.placeholder': 'Lim inn et passord, en API-nøkkel, en privat beskjed…',
  'home.chars.one': 'tegn',
  'home.chars.other': 'tegn',
  'home.expires': 'Utløper etter',
  'home.views': 'Maks visninger',
  'home.viewsHint': 'Slettes etter siste visning',
  'home.fewer': 'Færre visninger',
  'home.more': 'Flere visninger',
  'home.passphrase': 'Passordfrase',
  'home.passphrasePlaceholder': 'Velg en passordfrase',
  'home.passphraseHint': 'Send den separat fra lenken.',
  'home.submit': 'Krypter og lag lenke',
  'home.submitting': 'Krypterer…',
  'home.err.empty': 'Skriv eller lim inn hemmeligheten du vil dele.',
  'home.err.passphrase': 'Velg en passordfrase, eller slå av passordbeskyttelse.',
  'home.err.generic': 'Noe gikk galt.',
  'home.burned': 'Hemmeligheten ble slettet. Lenken virker ikke lenger.',
  'home.fine.1.t': 'Kryptert i nettleseren din',
  'home.fine.1.b': 'AES-256-GCM via Web Crypto API.',
  'home.fine.2.t': 'Nøkkelen blir i lenken',
  'home.fine.2.b': 'Den står etter #, så den sendes aldri til serveren.',
  'home.fine.3.t': 'Brennes etter lesing',
  'home.fine.3.b': 'Borte etter siste visning eller når tiden er ute.',

  'expiry.3600': '1 time',
  'expiry.21600': '6 timer',
  'expiry.86400': '1 dag',
  'expiry.259200': '3 dager',
  'expiry.604800': '7 dager',
  'expiry.2592000': '30 dager',

  'created.title': 'Lenken er klar.',
  'created.lede.a': 'Del den i en kanal du stoler på. Dekrypteringsnøkkelen er delen etter',
  'created.lede.b': '— den kan ikke gjenopprettes hvis den mistes.',
  'created.link': 'Hemmelig lenke',
  'created.copy': 'Kopier lenke',
  'created.copied': 'Kopiert',
  'created.copyFailed': 'Klarte ikke å kopiere automatisk. Marker lenken over og kopier den selv.',
  'created.expires': 'Utløper',
  'created.in': 'Om {x}',
  'created.views': 'Visninger',
  'created.view.one': '1 visning',
  'created.view.other': '{n} visninger',
  'created.passphrase': 'Passordfrase',
  'created.required': 'Påkrevd',
  'created.none': 'Ingen',
  'created.missing': 'Lenken er ikke lenger tilgjengelig på denne siden — lag en ny hemmelighet.',
  'created.new': 'Ny hemmelighet',
  'created.burn': 'Brenn nå',
  'created.burning': 'Brenner…',
  'created.burnAsk': 'Slette hemmeligheten for godt? Lenken slutter å virke med en gang.',
  'created.burnYes': 'Brenn den',
  'created.cancel': 'Avbryt',
  'created.burnFailed': 'Fikk ikke kontakt med serveren — hemmeligheten ble ikke brent. Prøv igjen.',

  'view.loading': 'Henter hemmelighet…',
  'view.locked.title.one': 'Åpnes én gang.',
  'view.locked.title.other': 'Du har fått en hemmelighet.',
  'view.locked.uses': 'Å åpne den nå bruker én visning.',
  'view.locked.body.a': 'Noen har sendt deg en hemmelighet. Den kan vises',
  'view.locked.body.b': '. Deretter slettes den for godt.',
  'view.moreTimes.one': '1 gang til',
  'view.moreTimes.other': '{n} ganger til',
  'view.passphrase': 'Passordfrase',
  'view.passphrasePlaceholder': 'Skriv inn passordfrasen du fikk',
  'view.open': 'Lås opp hemmeligheten',
  'view.opening': 'Dekrypterer…',
  'view.viewsLeft.one': '1 visning igjen',
  'view.viewsLeft.other': '{n} visninger igjen',
  'view.wrongPass': 'Feil passordfrase. Prøv igjen.',
  'view.unlocked.title': 'Her er hemmeligheten.',
  'view.unlocked.sub': 'Dekryptert i nettleseren din.',
  'view.copy': 'Kopier',
  'view.copied': 'Kopiert',
  'view.remaining.one': 'Hemmeligheten kan vises 1 gang til.',
  'view.remaining.other': 'Hemmeligheten kan vises {n} ganger til.',
  'view.destroyed': 'Det var siste visning — hemmeligheten er nå slettet. Ta vare på det du trenger før du lukker fanen.',
  'view.createOwn': 'Lag din egen hemmelighet',
  'view.gone.title': 'Allerede borte.',
  'view.gone.body': 'Denne hemmeligheten er vist eller utløpt, og finnes ikke lenger.',
  'view.gone.action': 'Lag en ny hemmelighet',
  'view.error.title': 'Noe gikk galt.',
  'view.error.action': 'Til forsiden',
  'view.err.invalid': 'Ugyldig lenke.',
  'view.err.noKey': 'Dekrypteringsnøkkelen mangler i lenken. Sjekk at du kopierte hele lenken.',
  'view.err.badKey': 'Dekrypteringsnøkkelen i lenken er skadet. Be avsenderen om hele lenken på nytt.',
  'view.err.mismatch': 'Nøkkelen i lenken passer ikke til hemmeligheten, så den kunne ikke dekrypteres. Be avsenderen sjekke at hele lenken ble delt.',

  'expiresIn.minute': 'Utløper om et minutt',
  'expiresIn.minutes': 'Utløper om {n} minutter',
  'expiresIn.hour': 'Utløper om 1 time',
  'expiresIn.hours': 'Utløper om {n} timer',
  'expiresIn.days': 'Utløper om {n} dager',

  'err.insecure': 'Kryptering krever en sikker tilkobling. Åpne Hemmelig over HTTPS (eller på localhost) og prøv igjen.',
}

const dicts: Record<Lang, Record<Key, string>> = { en, nb }

export type T = (key: Key, vars?: Record<string, string | number>) => string

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'nb') return stored
  } catch { /* storage unavailable */ }
  return /^(nb|nn|no)\b/i.test(navigator.language) ? 'nb' : 'en'
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: T }>(null!)

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('lang', l) } catch { /* storage unavailable */ }
  }

  useEffect(() => {
    document.documentElement.lang = lang === 'nb' ? 'nb' : 'en'
    document.title = dicts[lang]['meta.title']
  }, [lang])

  const t: T = (key, vars) => {
    let s = dicts[lang][key]
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
    return s
  }

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

/** Picks the `.one` / `.other` variant of a key by count. */
export function plural(t: T, base: string, n: number): string {
  return t(`${base}.${n === 1 ? 'one' : 'other'}` as Key, { n })
}
