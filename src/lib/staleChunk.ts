/**
 * A tab left open across a deploy still asks for the old build's hashed chunks.
 * They are gone, and the host's SPA rewrite answers with index.html, so the
 * failure reads as a fetch error, a wrong MIME type or a syntax error on `<`.
 */
const STALE_CHUNK = /dynamically imported module|importing a module script failed|unable to preload css|valid javascript mime|expected a javascript/i

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  if (STALE_CHUNK.test(error.message)) return true
  return error.name === 'SyntaxError' && /unexpected token\s*['"]?</i.test(error.message)
}

const KEY = 'stale-chunk-reloaded-builds'

/** The hashed entry script names the build this page is running. */
function currentBuild(): string {
  return document.querySelector<HTMLScriptElement>('script[type="module"][src]')?.src ?? ''
}

function triedBuilds(): string[] {
  return sessionStorage.getItem(KEY)?.split(' ') ?? []
}

/**
 * A reload only helps if it lands on a build this tab has not already reloaded
 * from, so each build gets one attempt. That list only ever grows, which is what
 * makes a reload loop impossible. No storage means no way to remember the
 * attempt, and offline a reload would swap the page for the browser's error
 * screen: neither reloads.
 */
export function canReloadForStaleChunk(): boolean {
  if (navigator.onLine === false) return false
  try {
    return !triedBuilds().includes(currentBuild())
  } catch {
    return false
  }
}

/** Records the attempt, then reloads. Returns false if it could not record it. */
export function reloadForStaleChunk(): boolean {
  try {
    sessionStorage.setItem(KEY, [...triedBuilds(), currentBuild()].join(' '))
  } catch {
    return false
  }
  window.location.reload()
  return true
}
