import { useEffect, type RefObject } from 'react'

const TABBABLE = 'a[href], button, input, select, textarea, iframe, [tabindex]'

/** Open dialogs, oldest first. Dialogs stack (a preview over the Projects
 *  dialog) and only the top one may act on Tab. */
const open: HTMLElement[] = []

function tabStops(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) => el.tabIndex >= 0 && !el.matches(':disabled') && el.getClientRects().length > 0,
  )
}

/**
 * Keeps Tab and Shift+Tab inside the dialog in `rootRef` while `active`.
 * Stops are read on every key press because panels mount their content late.
 *
 * The caller still owns returning focus to its opener. This only covers the
 * opener that cannot take focus, the barrel's canvas: focus then lands in the
 * dialog underneath, so it is not left outside the trap.
 */
export function useFocusTrap(rootRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const root = rootRef.current
    if (!active || !root) return
    open.push(root)

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || open[open.length - 1] !== root) return
      const stops = tabStops(root)
      const focused = document.activeElement
      const first = stops[0]
      const last = stops[stops.length - 1]
      if (!first) {
        e.preventDefault()
      } else if (!root.contains(focused)) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      } else if (e.shiftKey ? focused === first : focused === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      }
    }
    document.addEventListener('keydown', onKey, true)

    return () => {
      document.removeEventListener('keydown', onKey, true)
      open.splice(open.indexOf(root), 1)
      // Runs after the caller's own focus return, which is queued on close.
      requestAnimationFrame(() => {
        const below = open[open.length - 1]
        if (below && !below.contains(document.activeElement)) tabStops(below)[0]?.focus()
      })
    }
  }, [rootRef, active])
}
