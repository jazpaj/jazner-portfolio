import { Fragment, useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, X, Ticket, Robot, FlowArrow, CursorClick } from '@/components/slab'
import { FlowIcon, PlanIcon, GlobeIcon, SparkIcon, DeviceIcon } from './ProjectIcons'
import { AutomationsPanel, PlanPanel, TicketingPanel, FrameworkPanel, WorkflowPanel, BarrelPanel, AIWindow, AppsWindow } from './ProjectPanels'
import { liveSites, smallThumbSrc } from '@/data/funnels'
import { SAMPLES as WF_SAMPLES, thumbOf as wfThumb } from '@/data/workflows'
import { mobileApps } from '@/data/projects'
import { aiStack, type StackNode } from '@/data/ai-stack'
import { useIsPhone } from '@/hooks/useMediaQuery'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrollLock } from '@/hooks/useScrollLock'

/**
 * Projects, as one viewport in Home's bento language: a glass panel of six
 * cards, each previewing its own body of work with a live inner track, each
 * opening the work itself in a near-fullscreen dialog (see ProjectPanels for
 * the first three; the rest are the sections the long page used to stack).
 *
 * The dialog is a portal at z 8000, under the funnel preview (9000) so the
 * barrel's own "open this page" dialog can still stack on top of it.
 */

/**
 * Cards marked `draft` still show template content (a sample document, images
 * that read PLACEHOLDER), so they stay out of the grid. Set this to true, or
 * drop `draft` from a card, once it has real content.
 */
const SHOW_DRAFTS: boolean = false

type Project = {
  id: string
  index: string
  title: string
  desc: string
  Icon: ComponentType<{ size?: number }>
  eyebrow: string
  Section: ComponentType
  span?: 2
  /** Open Builds style: a small orange kicker above the title. */
  kicker?: string
  /** Real marks of what the work was built in; replaces the icon tile. */
  logos?: string[]
  Preview: ComponentType
  /** Phone filter bucket. */
  cat: Cat
  /** Template content: hidden unless SHOW_DRAFTS is on. */
  draft?: true
}

type Cat = 'work' | 'sites' | 'apps' | 'ai'
const FILTERS: { key: Cat | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'work', label: 'Work' },
  { key: 'sites', label: 'Sites' },
  { key: 'apps', label: 'Apps' },
  { key: 'ai', label: 'AI' },
]

/** Tool marks, from public/icons, for what each body of work is built with. */
const GHL = '/icons/gohighlevel.png'
const CLAUDE_CODE = '/icons/claude-code-logo.png'
const OPENAI = '/icons/openai.svg'
const N8N = '/icons/ai/n8n.svg'
const ZAPIER = '/icons/ai/zapier.svg'

const WF_SHOTS = WF_SAMPLES.map(wfThumb)

const FUNNEL_SHOTS = [liveSites[0], liveSites[7], liveSites[4]].filter(Boolean)

const APP_SHOTS = [
  ...mobileApps.map((a) => a.imageSrc).filter((s): s is string => !!s),
  '/placeholders/extension-1.jpg',
  '/placeholders/extension-2.jpg',
]

/** The three featured builds: each its own card in the stack, each its own
 *  pop-up. */
const BUILDS: Project[] = [
  { id: 'ticketing', draft: true, cat: 'work', index: '03', kicker: 'CRM automation', title: 'Lead-to-booking automation', desc: 'A GoHighLevel system that captures a lead, follows up by email and SMS, and gets them booked onto the calendar.', Icon: () => <Ticket size={20} weight="duotone" />, logos: [GHL], eyebrow: 'Featured build', Section: TicketingPanel, Preview: () => null },
  { id: 'framework', draft: true, cat: 'ai', index: '04', kicker: 'AI agent', title: 'Lead qualifying chat agent', desc: 'An AI agent that answers questions, asks the qualifying questions, and books the call when the lead is a fit.', Icon: () => <Robot size={20} weight="duotone" />, logos: [OPENAI], eyebrow: 'Featured build', Section: FrameworkPanel, Preview: () => null },
  { id: 'workflow', draft: true, cat: 'ai', index: '05', kicker: 'Workflow automation', title: 'Reminder and follow-up workflows', desc: 'Appointment reminders, no-show follow-ups and lead routing that run in the background, tested end to end.', Icon: () => <FlowArrow size={20} weight="duotone" />, logos: [N8N, ZAPIER], eyebrow: 'Featured build', Section: WorkflowPanel, Preview: () => null },
]

const leaves = (n: StackNode): StackNode[] => (n.children?.length ? n.children.flatMap(leaves) : [n])
const AI_LEAVES = leaves(aiStack)

/* ---------- Previews ---------- */

function WorkflowsPreview() {
  return (
    <div className="bento__media bento__reel" aria-hidden="true">
      <div className="bento__reel-track">
        {[...WF_SHOTS, ...WF_SHOTS].map((src, i) => (
          <span key={i} className="bento__shot">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

/** A paper mock of the plan document, the way SamplePlan previews it. */
function PlanPreview() {
  return (
    <div className="bento__media bento__doc" aria-hidden="true">
      <span className="bento__doc-eyebrow">Sample build plan</span>
      <span className="bento__doc-title">Map, build, test, hand off.</span>
      <span className="bento__doc-flow">
        <i>Map</i>
        <i>Build</i>
        <i>Tested?</i>
        <i className="is-on">Yours</i>
      </span>
      <span className="bento__doc-line" />
      <span className="bento__doc-line bento__doc-line--short" />
    </div>
  )
}

/** The three builds as Open Builds rows: plate, eyebrow, title, arrow. */
function FunnelsPreview() {
  return (
    <div className="bento__media bento__fan" aria-hidden="true">
      {FUNNEL_SHOTS.map((f, i) => (
        <span key={f.file} className="bento__photo bento__photo--page" style={{ ['--i' as string]: i }}>
          <img src={smallThumbSrc(f)} alt="" loading="lazy" decoding="async" />
        </span>
      ))}
    </div>
  )
}

function AIPreview() {
  const half = Math.ceil(AI_LEAVES.length / 2)
  const rows = [AI_LEAVES.slice(0, half), AI_LEAVES.slice(half)]
  return (
    <div className="bento__media bento__chips" aria-hidden="true">
      {rows.map((row, r) => (
        <div key={r} className="bento__chip-row" data-dir={r ? 'right' : 'left'}>
          <div className="bento__chip-track">
            {[...row, ...row].map((n, i) => (
              <span key={`${n.id}-${i}`} className="bento__chip" data-status={n.status}>
                <n.Icon size={15} weight="duotone" />
                {n.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AppsPreview() {
  return (
    <div className="bento__media bento__reel bento__reel--row" aria-hidden="true">
      <div className="bento__reel-track">
        {[...APP_SHOTS, ...APP_SHOTS].map((src, i) => (
          <span key={i} className="bento__shot bento__shot--app">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

const PROJECTS: Project[] = [
  { id: 'workflows', cat: 'work', index: '01', title: 'Automation workflows', desc: '5 real GoHighLevel workflows: Voice AI call routing, missed-call text-back and pipeline syncs.', Icon: FlowIcon, logos: [GHL], eyebrow: 'GoHighLevel workflows', Section: AutomationsPanel, span: 2, Preview: WorkflowsPreview },
  { id: 'plan', draft: true, cat: 'work', index: '02', title: 'Sample build plan', desc: 'The kind of plan I write before a build: the process mapped, the gaps found, the fix laid out.', Icon: PlanIcon, logos: [GHL], eyebrow: 'Sample document', Section: PlanPanel, Preview: PlanPreview },
  { id: 'funnels', cat: 'sites', index: '06', title: "Websites I've built", desc: '9 live client sites: 6 built in GoHighLevel, 3 vibe-coded. Open to browse them.', Icon: GlobeIcon, logos: [GHL], eyebrow: 'Live websites', Section: BarrelPanel, Preview: FunnelsPreview },
  { id: 'ai', cat: 'ai', index: '07', title: 'Systems I build', desc: 'AI agents, workflows and integrations, grouped by what they do.', Icon: SparkIcon, logos: [CLAUDE_CODE, OPENAI, GHL], eyebrow: 'Systems', Section: AIWindow, Preview: AIPreview },
  { id: 'apps', draft: true, cat: 'apps', index: '08', title: 'Systems and integrations', desc: 'Lead systems, AI agents and the integrations that connect them. Project details coming soon.', Icon: DeviceIcon, logos: [GHL, ZAPIER, N8N], eyebrow: 'Systems and integrations', Section: AppsWindow, span: 2, Preview: AppsPreview },
]

const isShown = (p: Project) => SHOW_DRAFTS || !p.draft
const SHOWN_PROJECTS = PROJECTS.filter(isShown)
const SHOWN_BUILDS = BUILDS.filter(isShown)
// A filter with nothing behind it would open on an empty grid.
const SHOWN_FILTERS = FILTERS.filter((f) => f.key === 'all' || [...SHOWN_PROJECTS, ...SHOWN_BUILDS].some((p) => p.cat === f.key))

/** The icon tile, or the real marks stacked horizontally in its place. */
function Marks({ p, size = 22 }: { p: Project; size?: number }) {
  if (!p.logos?.length) {
    return (
      <span className="bento__icon">
        <p.Icon size={size} />
      </span>
    )
  }
  return (
    <span className="bento__logos" aria-hidden="true">
      {p.logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/* ---------- Dialog ----------
   A backdrop, a close button in the corner, and the work. No panel, no
   header: each Section brings its own window (or, for the strip, none). */
function ProjectModal({ project, onClose, children }: { project: Project; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef, true)
  useScrollLock(true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div
      ref={dialogRef}
      className="pmodal"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button ref={closeRef} type="button" className="pmodal__close" onClick={onClose} aria-label="Close">
        <X size={18} weight="bold" />
      </button>
      <div className="pmodal__stage">{children}</div>
    </div>,
    document.body,
  )
}

/* ---------- The page ---------- */

export default function ProjectsGrid() {
  const [open, setOpen] = useState<Project | null>(null)
  const phone = useIsPhone()
  const [cat, setCat] = useState<Cat | 'all'>('all')
  const keep = (p: Project) => !phone || cat === 'all' || p.cat === cat
  const projects = SHOWN_PROJECTS.filter(keep)
  const builds = SHOWN_BUILDS.filter(keep)
  const triggerRef = useRef<HTMLElement | null>(null)

  const show = useCallback((p: Project, el: HTMLElement) => {
    triggerRef.current = el
    setOpen(p)
  }, [])
  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  const stack = builds.length > 0 ? (
    <div className="bento__stack">

        {builds.map((b) => (

          <button

            key={b.id}

            type="button"

            className="bento__card bento__card--btn bento__card--build"

            onClick={(e) => show(b, e.currentTarget)}

            aria-haspopup="dialog"

          >

            <span className="bento__build-plate">

              {b.logos?.length ? <img src={b.logos[0]} alt="" width={22} height={22} /> : <b.Icon />}

            </span>

            <span className="bento__build-text">

              <span className="bento__kicker">{b.kicker}</span>

              <span className="bento__build-title">{b.title}</span>

              <span className="bento__build-desc">{b.desc}</span>

            </span>

            <span className="bento__build-arrow">

              <ArrowUpRight size={13} weight="bold" aria-hidden="true" />

            </span>

          </button>

        ))}

      </div>
  ) : null

  return (
    <section className="pgrid" aria-labelledby="projects-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Projects</span>
        <h1 className="pgrid__title" id="projects-title">
          The kind of systems I build.
        </h1>
        <p className="pgrid__lede">CRM automations, AI agents, workflows and pages for coaches, agencies and small businesses. Open a card to see it full size.</p>
      </header>

      {phone && (
        <div className="pfilter" role="group" aria-label="Filter projects">
          {SHOWN_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className="pfilter__btn"
              aria-pressed={cat === f.key}
              onClick={() => setCat(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="home__glass pgrid__glass">
        {/* Hung on the sheet's top edge so it reads as a tag on the container,
            not a seventh card. aria-hidden: the lede already says it. */}
        <span className="pgrid__hint" aria-hidden="true">
          <CursorClick size={14} weight="duotone" />
          Click a card to open it
        </span>
        <div className={`bento bento--projects${SHOW_DRAFTS ? '' : ' bento--projects-trim'}`}>
          {projects.map((p) => (
            <Fragment key={p.id}>
            <button
              type="button"
              className={`bento__card bento__card--btn${p.span === 2 ? ' bento__card--wide' : ''}`}
              data-id={p.id}
              onClick={(e) => show(p, e.currentTarget)}
              aria-haspopup="dialog"
            >
              <span className="bento__head">
                <Marks p={p} />
                <span className="bento__title">{p.title}</span>
                <span className="bento__desc">{p.desc}</span>
                <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
              </span>
              <p.Preview />
            </button>
            {p.id === 'plan' && stack}
            </Fragment>
          ))}
          {!projects.some((p) => p.id === 'plan') && stack}
        </div>
      </div>

      {open && (
        <ProjectModal project={open} onClose={close}>
          <open.Section />
        </ProjectModal>
      )}
    </section>
  )
}
