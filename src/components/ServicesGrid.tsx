import type { CSSProperties } from 'react'
import { MagnetStraight, Timer, Trophy, CheckCircle } from '@/components/slab'
import type { Icon } from '@/components/slab'
import Autopilot, { TOOLS } from '@/components/Autopilot'

/**
 * ServicesGrid - the Services view on one glass sheet.
 *
 * Three bands, top to bottom: the three-step method (on a dark plate so it
 * is the first thing the eye lands on), the five services as cards that carry
 * the marks of what each one is built with, and the live automation demo
 * scaled into whatever height is left. Same object language as Home and
 * Projects: the glass, the bento card, plated marks, orange for the index
 * and the accent.
 */

/* ---------- The method ---------- */

type Stage = {
  index: string
  label: string
  body: string
  Icon: Icon
  chips: string[]
}

const STAGES: Stage[] = [
  {
    index: '01',
    label: 'Map the process',
    body: 'I map how leads move through your business today and find where leads and hours leak.',
    Icon: MagnetStraight,
    chips: ['Lead sources', 'Follow-up', 'Bookings', 'Handoffs'],
  },
  {
    index: '02',
    label: 'Build & automate',
    body: 'I build the workflows, AI agents and integrations that close those gaps.',
    Icon: Timer,
    chips: ['Workflows', 'AI agents', 'Integrations'],
  },
  {
    index: '03',
    label: 'Test & hand off',
    body: 'You get a system that is tested end to end, documented, and yours to run.',
    Icon: Trophy,
    chips: ['Tested', 'Documented', 'Yours'],
  },
]

/* ---------- The services ---------- */

// Tool marks from /public/icons, for the tools each service is built with.
const GHL = '/icons/gohighlevel.png'
const N8N = '/icons/ai/n8n.svg'
const ZAPIER = '/icons/ai/zapier.svg'
const OPENAI = '/icons/openai.svg'
const GWS = '/icons/googleworkspace.svg'
const SLACK = '/icons/slack.svg'
const CLAUDE_CODE = '/icons/claude-code-logo.png'

type Service = {
  index: string
  title: string
  description: string
  chip: string
  logos: string[]
  bullets: string[]
}

const SERVICES: Service[] = [
  {
    index: '01',
    title: 'GoHighLevel CRM automation',
    description: 'Lead-to-booking systems built inside GoHighLevel, so every lead is followed up and tracked.',
    chip: 'GoHighLevel',
    logos: [GHL, GWS, SLACK],
    bullets: ['Lead capture to booked call', 'Pipeline stages that update themselves', 'Team alerts when a lead comes in'],
  },
  {
    index: '02',
    title: 'AI agents & chatbots',
    description: 'Chat, SMS and voice agents that answer questions, qualify leads and book appointments.',
    chip: 'Chat, SMS, voice',
    logos: [GHL, OPENAI, CLAUDE_CODE],
    bullets: ['Replies to new leads right away', 'Qualifies before the call', 'Books straight into your calendar'],
  },
  {
    index: '03',
    title: 'Workflow automation',
    description: 'Follow-ups, reminders, lead routing and pipelines that run without anyone touching them.',
    chip: 'Hands-off',
    logos: [GHL, N8N, ZAPIER],
    bullets: ['Email and SMS follow-up sequences', 'Appointment reminders', 'Leads routed to the right person'],
  },
  {
    index: '04',
    title: 'Funnels & landing pages',
    description: 'Pages wired to your forms, calendars and tracking, so every visit has somewhere to go.',
    chip: 'Capture',
    logos: [GHL, GWS, OPENAI],
    bullets: ['Opt-in and booking pages', 'Forms and calendars connected', 'Tracking set up from day one'],
  },
  {
    index: '05',
    title: 'CRM setup & integrations',
    description: 'Pipelines, tags and custom fields set up properly, and your other tools connected to the CRM.',
    chip: 'Connected',
    logos: [GHL, ZAPIER, N8N],
    bullets: ['Pipelines, tags and custom fields', 'Connected with Zapier, n8n or Make.com', 'No more copying data by hand'],
  },
]

/** The tool marks, stacked horizontally on white tiles (same as Projects). */
function Marks({ logos }: { logos: string[] }) {
  return (
    <span className="bento__logos" aria-hidden="true">
      {logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/* ---------- The page ---------- */

export default function ServicesGrid() {
  return (
    <section className="pgrid sgrid" aria-labelledby="services-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Services</span>
        <h1 className="pgrid__title" id="services-title">
          Systems that follow up, qualify and book for you.
        </h1>
        <p className="pgrid__lede">
          CRM automations, AI agents and workflows for coaches, agencies and small businesses.
        </p>
      </header>

      <div className="home__glass sgrid__glass">
        {/* One dark plate, the headline on the left, the three stages wired
            in order on the right with a signal running them. */}
        <div className="sgrid__method" aria-labelledby="method-title">
          <div className="sgrid__method-copy">
            <span className="sgrid__method-eyebrow">My Method</span>
            <h2 className="sgrid__method-title" id="method-title">
              One. Two. Three.
              <br />
              <span>How I build, in three steps.</span>
            </h2>
            <p className="sgrid__method-sub">
              Every build starts from your real process, so the automation fixes the gaps that actually cost you leads.
            </p>
          </div>

          <ol className="sgrid__stages" role="list">
            {STAGES.map((s, i) => {
              const StageIcon = s.Icon
              return (
                <li key={s.index} className="sgrid__stage" style={{ '--i': i } as CSSProperties}>
                  <span className="sgrid__stage-ghost" aria-hidden="true">{s.index}</span>
                  <span className="sgrid__stage-icon" aria-hidden="true">
                    <StageIcon size={22} weight="duotone" />
                  </span>
                  <h3 className="sgrid__stage-label">{s.label}.</h3>
                  <p className="sgrid__stage-body">{s.body}</p>
                  <ul className="sgrid__stage-chips" role="list" aria-label={`${s.label} touches`}>
                    {s.chips.map((c) => (
                      <li key={c} className="sgrid__stage-chip">{c}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Five cards, each carrying the marks of what it is built with. */}
        <div className="sgrid__offers">
          <div className="sgrid__offers-head">
            <h2 className="sgrid__offers-title">What I build.</h2>
            <p className="sgrid__offers-sub">Pick one, or combine them into one system.</p>
          </div>
          <ul className="bento sgrid__services" role="list">
            {SERVICES.map((s) => (
              <li key={s.title} className="bento__card sgrid__service">
                <span className="bento__head">
                  <span className="sgrid__service-top">
                    <Marks logos={s.logos} />
                    <span className="sgrid__service-index" aria-hidden="true">{s.index} / 05</span>
                  </span>
                  <span className="bento__title">{s.title}</span>
                  <span className="bento__desc">{s.description}</span>
                </span>
                <span className="sgrid__chip" aria-hidden="true">{s.chip}</span>
                <ul className="sgrid__bullets" role="list">
                  {s.bullets.map((b) => (
                    <li key={b} className="sgrid__bullet">
                      <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* The live workflow. Its caption and the tool chips sit in a header
            above the window, so the canvas gets the whole glass width. */}
        <div className="sgrid__flow">
          <header className="sgrid__flow-head">
            <div className="sgrid__flow-copy">
              <span className="sgrid__flow-eyebrow">Live automation</span>
              <h2 className="sgrid__flow-title">From form fill to booked call.</h2>
              <p className="sgrid__flow-sub">
                A new lead gets an instant email, lands in the CRM, gets reminders, and is routed by outcome, with an AI step following up anyone who is not ready yet.
              </p>
            </div>
            <ul className="sgrid__flow-tools" role="list" aria-label="Tools that power this flow">
              {TOOLS.map(({ Icon: ToolIcon, label }) => (
                <li key={label} className="sgrid__flow-tool">
                  <ToolIcon size={14} weight="duotone" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </header>
          <div className="sgrid__flow-main">
            <Autopilot compact maxScale={1.08} />
          </div>
        </div>
      </div>
    </section>
  )
}
