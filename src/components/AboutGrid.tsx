import type { CSSProperties } from 'react'
import { ArrowUpRight, MapPin } from '@/components/slab'
import { profile } from '@/data/profile'

/**
 * AboutGrid - the About view as a fixed viewport.
 *
 * One glass sheet, two columns: who you are on the left, the illustration
 * on the right. Sized to the panel, so nothing here scrolls.
 *
 * The left column is a ladder, not a paragraph block: one display statement,
 * one line of context, then the four things you do - each carrying the marks
 * of the tools it is built with. The tools are the proof, so they are the
 * visual.
 */

const GHL = { src: '/icons/gohighlevel.png', name: 'GoHighLevel' }
const N8N = { src: '/icons/ai/n8n.svg', name: 'n8n' }
const ZAPIER = { src: '/icons/ai/zapier.svg', name: 'Zapier' }
const CLAUDE = { src: '/icons/ai/claude-color.svg', name: 'Claude' }
const OPENAI = { src: '/icons/openai.svg', name: 'ChatGPT' }
const CLAUDE_CODE = { src: '/icons/claude-code-logo.png', name: 'Claude Code' }
const VSCODE = { src: '/icons/vscode.svg', name: 'VS Code' }
const GWS = { src: '/icons/googleworkspace.svg', name: 'Google Workspace' }
const SLACK = { src: '/icons/ai/slack-color.svg', name: 'Slack' }

const LINKEDIN = profile.socials.find((s) => s.href.includes('linkedin'))?.href ?? '#'

type Capability = {
  index: string
  title: string
  marks: { src: string; name: string }[]
}

const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'Workflow automation',
    marks: [GHL, N8N, ZAPIER],
  },
  {
    index: '02',
    title: 'AI agents & chatbots',
    marks: [GHL, CLAUDE, OPENAI],
  },
  {
    index: '03',
    title: 'CRM setup & integrations',
    marks: [GHL, GWS, SLACK],
  },
  {
    index: '04',
    title: 'Funnels & landing pages',
    marks: [GHL, CLAUDE_CODE, VSCODE],
  },
]

export default function AboutGrid() {
  return (
    <section className="pgrid agrid" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          {`Hi, I’m ${profile.firstName}.`}
        </h1>
        <p className="pgrid__lede">
          I build CRM automations, AI agents and workflows that turn leads into booked calls.
        </p>
      </header>

      <div className="home__glass agrid__glass">
        <div className="agrid__copy">
          <p className="agrid__lead">
            Your quiet operator behind the scenes.
            <span> I build the systems that keep your leads moving, so you can get on with the work.</span>
          </p>

          <p className="agrid__note">
            <strong>{profile.role}</strong> for coaches, agencies and small businesses. I map
            your process, build the automations and AI agents that close the gaps, and hand
            over a system that is tested, documented and yours. Say hello on{' '}
            <a className="agrid__link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            .
          </p>

          <ul className="agrid__caps" role="list">
            {CAPABILITIES.map((c) => (
              <li key={c.index} className="agrid__cap">
                <span className="agrid__cap-marks">
                  {c.marks.map((m, i) => (
                    <span
                      key={m.name}
                      className="agrid__mark"
                      style={{ '--i': c.marks.length - i } as CSSProperties}
                    >
                      <img src={m.src} alt={m.name} loading="lazy" decoding="async" />
                    </span>
                  ))}
                </span>
                <span className="agrid__cap-title">{c.title}</span>
                <span className="agrid__cap-index" aria-hidden="true">
                  {c.index}
                </span>
              </li>
            ))}
          </ul>

          {/* One plate, two cells sharing a mark / title / meta anatomy. */}
          <div className="agrid__bar">
            <span className="agrid__cell">
              <span className="agrid__cell-mark agrid__cell-mark--img">
                <img src="/icons/gohighlevel.png" alt="" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">GoHighLevel</span>
                <span className="agrid__cell-meta">CRM, workflows, AI agents</span>
              </span>
            </span>

            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <MapPin size={16} weight="fill" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">{profile.location}</span>
                <span className="agrid__cell-meta">Working with clients worldwide</span>
              </span>
            </span>

            <a className="agrid__cell agrid__cell--wide" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              <span className="agrid__cell-mark agrid__cell-mark--plain">
                <img src="/icons/linkedin.svg" alt="" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">LinkedIn</span>
                <span className="agrid__cell-meta">Connect with {profile.firstName}</span>
              </span>
              <ArrowUpRight className="agrid__cell-go" size={15} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="agrid__portrait">
          <img
            src={profile.hero.portraitSrc}
            alt={profile.hero.portraitAlt}
            loading="eager"
            decoding="async"
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  )
}
