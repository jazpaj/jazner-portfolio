import { useEffect, useState, type ReactNode } from 'react'
import { Ticket, Robot, FlowArrow, ArrowUpRight, Eye, type Icon } from '@/components/slab'
import { lazy, Suspense } from 'react'
import WorkflowSamples from './WorkflowSamples'
import AIStackGrid from './AIStackGrid'
import { AppsSection } from './Projects'
import { useFunnelModal } from './FunnelModal'
import { ghlSites, vibeSites, liveSites, type Funnel } from '@/data/funnels'

const FunnelBarrel = lazy(() => import('./FunnelBarrel'))

/**
 * What the Projects dialogs show. Each panel is the work itself, on screen
 * the moment the dialog opens - no section chrome to read past and no second
 * dialog to click into.
 */

/** Only the strip of macOS windows, drifting on the backdrop. No window. */
export function AutomationsPanel() {
  return (
    <div className="ppanel ppanel--strip">
      <WorkflowSamples />
    </div>
  )
}

/** A plain mac window with a scrolling body, for the sections that are
 *  pages rather than frames. */
function SectionWindow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ppanel ppanel--window">
      <div className="ppanel__bar">
        <span className="ppanel__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ppanel__url">
          <span className="ppanel__url-host">{label}</span>
        </span>
      </div>
      <div className="ppanel__scroll">{children}</div>
    </div>
  )
}

const SITE_GROUPS = [
  { title: 'GoHighLevel websites & landing pages', sub: 'Built and launched inside GoHighLevel, wired to forms, calendars and the CRM.', sites: ghlSites },
  { title: 'Vibe-coded websites', sub: 'Custom sites I coded with AI tools, from first commit to launch.', sites: vibeSites },
]

function SiteCard({ site, onOpen }: { site: Funnel; onOpen: (f: Funnel, t?: HTMLElement | null) => void }) {
  return (
    <li className="sitecard">
      <button type="button" className="sitecard__shot" onClick={(e) => onOpen(site, e.currentTarget)} aria-label={`Preview ${site.label}`}>
        <img src={`/sites/thumbs/${site.file.replace('.html', '.jpeg')}`} alt="" loading="lazy" decoding="async" />
        <span className="sitecard__peek" aria-hidden="true">
          <Eye size={16} weight="bold" />
          Preview
        </span>
      </button>
      <div className="sitecard__body">
        <span className="sitecard__tag" data-tag={site.tag}>{site.tag}</span>
        <h4 className="sitecard__title">{site.label}</h4>
        <p className="sitecard__kind">{site.kind}</p>
        {site.url && (
          <a className="sitecard__visit" href={site.url} target="_blank" rel="noopener noreferrer">
            {new URL(site.url).host.replace(/^www\./, '')}
            <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
          </a>
        )}
      </div>
    </li>
  )
}

/** The live client sites: the barrel to spin, then every site as a card,
 *  grouped by how it was built. */
export function BarrelPanel() {
  const { openFull, modal } = useFunnelModal()
  return (
    <SectionWindow label="Websites I've built">
      <div className="sites">
        <div className="sites__barrel">
          <Suspense fallback={<div className="funnels__barrel-skeleton" aria-hidden="true" />}>
            <FunnelBarrel funnels={liveSites} onOpen={openFull} />
          </Suspense>
        </div>
        {SITE_GROUPS.map((g) => (
          <section key={g.title} className="sites__group">
            <header className="sites__head">
              <h3 className="sites__title">{g.title}</h3>
              <p className="sites__sub">{g.sub}</p>
            </header>
            <ul className="sites__grid" role="list">
              {g.sites.map((site) => (
                <SiteCard key={site.file} site={site} onOpen={openFull} />
              ))}
            </ul>
          </section>
        ))}
      </div>
      {modal}
    </SectionWindow>
  )
}

/** The systems as a logo-first grid, in a scrolling window. */
export function AIWindow() {
  return (
    <SectionWindow label="AI systems">
      <AIStackGrid />
    </SectionWindow>
  )
}
export function AppsWindow() {
  return (
    <SectionWindow label="Apps and tools">
      <AppsSection />
    </SectionWindow>
  )
}

/** The plan document, full height, straight away. */
export function PlanPanel() {
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar
        host="jazner-portfolio.vercel.app"
        path="/sample-plan"
      />
      <LiveFrame src="/placeholders/sample-plan.html" title="Sample document" />
    </div>
  )
}

/** `src` is a local page framed in the panel; `path` is what the fake
 *  address bar shows. Point these at your own pages. */
type Build = { id: string; label: string; src: string; path: string; Icon: Icon }

const BUILDS: Build[] = [
  { id: 'ticketing', label: 'Lead-to-booking automation', src: '/placeholders/sample-plan.html?doc=1', path: '/lead-to-booking', Icon: Ticket },
  { id: 'framework', label: 'Lead qualifying chat agent', src: '/placeholders/sample-plan.html?doc=2', path: '/chat-agent', Icon: Robot },
  { id: 'workflow', label: 'Reminder and follow-up workflows', src: '/placeholders/sample-plan.html?doc=3', path: '/follow-up-workflows', Icon: FlowArrow },
]

/** One build, framed, open on arrival. */
function BuildPanel({ build }: { build: Build }) {
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar host="jazner-portfolio.vercel.app" path={build.path} />
      <LiveFrame src={build.src} title={build.label} />
    </div>
  )
}
export const TicketingPanel = () => <BuildPanel build={BUILDS[0]} />
export const FrameworkPanel = () => <BuildPanel build={BUILDS[1]} />
export const WorkflowPanel = () => <BuildPanel build={BUILDS[2]} />

function FrameBar({ host, path }: { host: string; path: string }) {
  return (
    <div className="ppanel__bar">
      <span className="ppanel__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="ppanel__url">
        <span className="ppanel__url-host">{host}</span>
        <span className="ppanel__url-path">{path}</span>
      </span>
    </div>
  )
}

/** Matches `pmodal-panel` (420ms). Same-site frames share the portfolio's
 *  main thread, so loading one mid-animation stalled the open by 100ms+. */
const FRAME_DELAY_MS = 440

function LiveFrame({ src, title }: { src: string; title: string }) {
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), FRAME_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [])
  return (
    <div className="ppanel__stage">
      {!ready && <div className="ppanel__skeleton" aria-hidden="true" />}
      {mounted && <iframe
        className="ppanel__iframe"
        src={src}
        title={title}
        loading="eager"
        onLoad={() => setReady(true)}
        data-ready={ready ? 'true' : 'false'}
      />}
    </div>
  )
}
