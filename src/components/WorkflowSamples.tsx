import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@/components/slab'
import { SAMPLES, thumbOf, type Sample } from '@/data/workflows'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrollLock } from '@/hooks/useScrollLock'

/**
 * WorkflowSamples
 *
 * A still grid of project screenshots, each a button in a faux macOS frame
 * tagged with the platform it runs on. Clicking any frame opens the full image
 * in a faux macOS window over the page. Add more workflows to SAMPLES.
 *
 * Modal: createPortal to body (escapes any transformed ancestor), Escape +
 * backdrop close, body scroll lock, focus moved into the dialog and returned to
 * the trigger on close - the same pattern as the other in-page previews.
 */

const srcOf = (s: Sample) => `/workflows/full/${s.file}.webp`

export default function WorkflowSamples() {
  const [active, setActive] = useState<Sample | null>(null)
  // Big workflows are unreadable fitted to the window; a click shows them 1:1.
  const [zoomed, setZoomed] = useState(false)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  useFocusTrap(dialogRef, !!active)
  useScrollLock(!!active)

  const open = useCallback((s: Sample, trigger: HTMLElement | null) => {
    lastTriggerRef.current = trigger ?? (document.activeElement as HTMLElement | null)
    setZoomed(false)
    setActive(s)
  }, [])

  const close = useCallback(() => {
    setActive(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!active) return
    // Capture + stop: Escape closes this popup, not the Projects dialog under it.
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
  }, [active, close])

  return (
    <section className="wfs" id="workflow-samples" aria-labelledby="wfs-heading" data-reveal>
      <p className="wfs__caption" id="wfs-heading">
        Real GoHighLevel workflows and Zapier zaps I have built. Click any one to see it full size.
      </p>

      <ul className="wfs__grid">
        {SAMPLES.map((s) => (
          <li key={s.file} className="wfs__cell">
            <button
              type="button"
              className="wfs__frame"
              onClick={(e) => open(s, e.currentTarget)}
              aria-haspopup="dialog"
              aria-label={`Open ${s.label} screenshot (${s.platform})`}
            >
              <span className="wfs__frame-bar" aria-hidden="true">
                <span className="wfs__dot wfs__dot--r" />
                <span className="wfs__dot wfs__dot--y" />
                <span className="wfs__dot wfs__dot--g" />
                <span className="wfs__frame-title">{s.label}</span>
                <PlatformTag platform={s.platform} />
              </span>
              <img className="wfs__img" src={thumbOf(s)} alt="" loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>

      {active &&
        createPortal(
          <div
            ref={dialogRef}
            className="wfs__modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${active.label} screenshot`}
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <div className="wfs__window">
              <div className="wfs__bar">
                <span className="wfs__bar-dots" aria-hidden="true">
                  <span className="wfs__dot wfs__dot--r" />
                  <span className="wfs__dot wfs__dot--y" />
                  <span className="wfs__dot wfs__dot--g" />
                </span>
                <span className="wfs__bar-title">{active.label}</span>
                <button
                  ref={closeRef}
                  type="button"
                  className="wfs__close"
                  onClick={close}
                  aria-label="Close image"
                >
                  <X weight="bold" size={18} aria-hidden="true" />
                </button>
              </div>
              <p className="wfs__desc">
                <PlatformTag platform={active.platform} />
                {active.desc}
              </p>
              <div className={`wfs__imgwrap${zoomed ? ' is-zoomed' : ''}`}>
                <button
                  type="button"
                  className="wfs__zoom"
                  onClick={() => setZoomed((z) => !z)}
                  aria-pressed={zoomed}
                  aria-label={zoomed ? 'Fit to window' : 'Zoom to full size'}
                >
                  <img className="wfs__full" src={srcOf(active)} alt={`${active.label} workflow`} />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}

function PlatformTag({ platform }: { platform: Sample['platform'] }) {
  return (
    <span className="wfs__tag" data-platform={platform}>
      {platform}
    </span>
  )
}
