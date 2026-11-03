import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowUpRight } from '@/components/slab'
import type { Funnel } from '@/data/funnels'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrollLock } from '@/hooks/useScrollLock'

/**
 * The in-page funnel preview: a browser-chrome dialog that iframes the real
 * page so a visitor never leaves the portfolio.
 *
 * It lives here rather than inside Funnels because two surfaces open it now -
 * the Projects view's full section and the reel on Home. One dialog, one focus
 * contract, one scroll lock.
 */
export function fullSrc(funnel: Funnel) {
  return `/${funnel.dir ?? 'funnels'}/${funnel.file}`
}

export function useFunnelModal() {
  const [funnel, setFunnel] = useState<Funnel | null>(null)
  // Track what opened the dialog so focus goes back there on close, instead of
  // dumping keyboard users at the top of the document.
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  useFocusTrap(dialogRef, !!funnel)
  useScrollLock(!!funnel)

  const openFull = useCallback((next: Funnel, trigger?: HTMLElement | null) => {
    lastTriggerRef.current = trigger ?? (document.activeElement as HTMLElement | null)
    setFunnel(next)
  }, [])

  const close = useCallback(() => {
    setFunnel(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  // Escape to dismiss, focus moved into the dialog.
  useEffect(() => {
    if (!funnel) return
    // Capture + stop: Escape closes this preview, not the Projects dialog under it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      close()
    }
    document.addEventListener('keydown', onKey, true)
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey, true)
    }
  }, [funnel, close])

  const modal =
    funnel &&
    createPortal(
      <div
        ref={dialogRef}
        className="funnels__modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${funnel.label} preview`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div className="funnels__modal-shell">
          <div className="funnels__modal-bar">
            <div className="funnels__modal-lights" aria-hidden="true">
              <span className="funnels__modal-light funnels__modal-light--red" />
              <span className="funnels__modal-light funnels__modal-light--amber" />
              <span className="funnels__modal-light funnels__modal-light--green" />
            </div>
            <div className="funnels__modal-url" aria-hidden="true">
              {funnel.url ? (
                <span className="funnels__modal-url-scheme">{new URL(funnel.url).host}</span>
              ) : (
                <>
                  <span className="funnels__modal-url-scheme">jazner-portfolio.vercel.app</span>
                  <span className="funnels__modal-url-path">{fullSrc(funnel)}</span>
                </>
              )}
            </div>
            <div className="funnels__modal-actions">
              {funnel.url && (
                <a className="funnels__modal-visit" href={funnel.url} target="_blank" rel="noopener noreferrer">
                  Visit site
                  <ArrowUpRight weight="bold" size={14} aria-hidden="true" />
                </a>
              )}
              <button
                ref={closeRef}
                type="button"
                className="funnels__modal-close"
                onClick={close}
                aria-label="Close preview"
              >
                <X weight="bold" size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          {funnel.url ? (
            // Live client sites often refuse to be framed, so the preview is
            // a full-page screenshot with a link out to the real thing.
            <div className="funnels__modal-shot" tabIndex={0}>
              <img src={`/sites/full/${funnel.file.replace('.html', '.jpeg')}`} alt={`${funnel.label} website, full page`} />
            </div>
          ) : (
            <iframe
              className="funnels__modal-iframe"
              src={fullSrc(funnel)}
              title={funnel.label}
              sandbox="allow-same-origin allow-forms allow-scripts allow-popups"
            />
          )}
        </div>
      </div>,
      document.body,
    )

  return { openFull, modal }
}
