import { useEffect } from 'react'

/** Open dialogs holding the page still. Dialogs stack and unmount in whatever
 *  order React chooses, so none of them may save or clear the lock alone. */
let holders = 0

/**
 * Stops the page scrolling behind a dialog while `active`. The first holder
 * takes the lock and the last one out releases it. It always releases to the
 * default rather than a saved value, which could be another dialog's lock.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    holders += 1
    document.body.style.overflow = 'hidden'
    return () => {
      holders -= 1
      if (holders === 0) document.body.style.overflow = ''
    }
  }, [active])
}
