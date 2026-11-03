import { Component, type ReactNode } from 'react'
import { ArrowLeft } from '@/components/slab'
import { canReloadForStaleChunk, isChunkLoadError, reloadForStaleChunk } from '@/lib/staleChunk'

type Props = {
  children: ReactNode
  /** Clears a caught error when this changes, so the visitor can navigate away. */
  resetKey?: string
  /** For decoration: on failure render nothing and never reload the page. */
  quiet?: boolean
}

type State = { failed: boolean; reloading: boolean; resetKey?: string }

/**
 * Without a boundary, one thrown render or a chunk that will not load unmounts
 * the whole React root and leaves an empty page. A stale chunk gets one reload
 * (lib/staleChunk.ts); anything else gets a message and a button.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, reloading: false, resetKey: this.props.resetKey }

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { failed: true, reloading: isChunkLoadError(error) && canReloadForStaleChunk() }
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey === state.resetKey) return null
    return { failed: false, reloading: false, resetKey: props.resetKey }
  }

  componentDidCatch() {
    if (this.props.quiet || !this.state.reloading) return
    if (!reloadForStaleChunk()) this.setState({ reloading: false })
  }

  render() {
    if (!this.state.failed) return this.props.children
    if (this.props.quiet || this.state.reloading) return null

    return (
      <div className="legal-page error-fallback" role="alert">
        <div className="legal-page__card">
          <a className="legal-page__back" href="/">
            <ArrowLeft weight="bold" size={15} aria-hidden="true" />
            Back to home
          </a>
          <h1 className="legal-page__title">This page did not load.</h1>
          <div className="legal-page__body">
            <p>Something went wrong on my side. Reloading usually fixes it.</p>
            <p>
              <button
                type="button"
                className="legal-page__back"
                onClick={() => window.location.reload()}
              >
                Reload the page
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }
}
