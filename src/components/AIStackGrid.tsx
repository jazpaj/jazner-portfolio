import { aiStack, type StackNode } from '@/data/ai-stack'

/**
 * The AI systems as a logo-first grid, for the Projects pop-up.
 *
 * The tree (AIStack.tsx) explains the hierarchy; this view answers the
 * question a hiring reader actually has: what is each thing built ON. Every
 * card leads with the marks of the model, the harness and the services
 * behind it, then the plain-English line, then the stack string from the
 * data file. Names, copy and status come straight from ai-stack.ts; only the
 * logo mapping lives here, and only marks that exist in public/icons.
 */

type Tool = { name: string; src: string }

const T = {
  claude: { name: 'Claude', src: '/icons/ai/claude-color.svg' },
  claudeCode: { name: 'Claude Code', src: '/icons/claude-code-logo.png' },
  openai: { name: 'ChatGPT', src: '/icons/openai.svg' },
  slack: { name: 'Slack', src: '/icons/slack.svg' },
  ghl: { name: 'GoHighLevel', src: '/icons/gohighlevel.png' },
  zapier: { name: 'Zapier', src: '/icons/ai/zapier.svg' },
  n8n: { name: 'n8n', src: '/icons/ai/n8n.svg' },
  google: { name: 'Google Workspace', src: '/icons/googleworkspace.svg' },
  vscode: { name: 'VS Code', src: '/icons/vscode.svg' },
} satisfies Record<string, Tool>

/** What each system runs on. Keyed by the node id in ai-stack.ts. */
const TOOLS: Record<string, Tool[]> = {
  'project-a': [T.ghl, T.openai],
  'project-b': [T.ghl, T.openai],
  'project-c': [T.ghl, T.openai],
  'project-d': [T.ghl, T.openai],
  'project-e': [T.ghl, T.slack],
  'project-f': [T.ghl],
  'project-g': [T.ghl],
  'project-h': [T.zapier, T.n8n, T.google],
  'project-i': [T.ghl],
  'project-j': [T.claudeCode, T.vscode],
  'project-k': [T.claude, T.google],
}

/** The harnesses everything above is built with. */
const HARNESS: Tool[] = [
  { name: 'Claude Code', src: '/icons/claude-code-logo.png' },
  { name: 'ChatGPT', src: '/icons/openai.svg' },
  { name: 'VS Code', src: '/icons/vscode.svg' },
]

type Group = { title: string; what: string; systems: StackNode[] }

/** Flatten the tree into groups: a branch with children is a group, a leaf
 *  branch (one with a status) is a group of itself plus any children. */
function groups(root: StackNode): Group[] {
  return (root.children ?? []).map((branch) => ({
    title: branch.name,
    what: branch.what,
    systems: branch.status ? [branch, ...(branch.children ?? [])] : (branch.children ?? []),
  }))
}

function Card({ n }: { n: StackNode }) {
  const tools = TOOLS[n.id] ?? []
  return (
    <li className="aig__card">
      <div className="aig__marks" aria-label={`Built with ${tools.map((t) => t.name).join(', ')}`}>
        {tools.map((t) => (
          <span key={t.name} className="aig__mark" title={t.name}>
            <img src={t.src} alt="" width={22} height={22} loading="lazy" decoding="async" />
          </span>
        ))}
        {n.status && (
          <span className="aig__status" data-status={n.status}>
            {n.status}
          </span>
        )}
      </div>
      <h4 className="aig__name">
        <n.Icon size={16} weight="duotone" aria-hidden="true" />
        {n.name}
      </h4>
      <p className="aig__what">{n.what}</p>
      {n.stack && <p className="aig__stack">{n.stack}</p>}
      {tools.length > 0 && (
        <ul className="aig__tools" role="list">
          {tools.map((t) => (
            <li key={t.name}>{t.name}</li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default function AIStackGrid() {
  return (
    <div className="aig">
      <header className="aig__head">
        <div className="aig__head-text">
          <h3 className="aig__title">{aiStack.what}</h3>
        </div>
        <div className="aig__harness" aria-label="Built with">
          <span className="aig__harness-label">Built with</span>
          {HARNESS.map((t) => (
            <span key={t.name} className="aig__harness-item">
              <img src={t.src} alt="" width={20} height={20} />
              {t.name}
            </span>
          ))}
        </div>
      </header>

      {groups(aiStack).map((g) => (
        <section key={g.title} className="aig__group" aria-label={g.title}>
          <div className="aig__group-head">
            <h3 className="aig__group-title">{g.title}</h3>
            <p className="aig__group-what">{g.what}</p>
          </div>
          <ul className="aig__cards" role="list">
            {g.systems.map((n) => (
              <Card key={n.id} n={n} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
