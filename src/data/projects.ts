export type AppStat = { value: string; label: string }

export type AppProject = {
  name: string
  tagline: string
  description: string
  /** Optional - omit for gradient placeholder cards */
  imageSrc?: string
  /** CSS object-position override. Defaults to 'top center'. */
  imagePosition?: string
  /** External brand color - not a site token. Passed via --app-color inline prop. */
  accentColor: string
  stats: AppStat[]
  badge: string
}

/** @deprecated use AppProject */
export type MobileApp = AppProject

/**
 * The kinds of systems shown on the Projects cards. Screenshots still live in
 * public/placeholders/ - swap in real ones (960x514 works well).
 */
const STATS: AppStat[] = [
  { value: 'Mapped', label: 'Process' },
  { value: 'Built', label: 'Automation' },
  { value: 'Tested', label: 'Handoff' },
]

export const mobileApps: MobileApp[] = [
  {
    name: 'Lead-to-booking system',
    tagline: 'From form fill to booked call.',
    description: 'Captures the lead, follows up by email and SMS, and books them onto the calendar. Project details coming soon.',
    imageSrc: '/placeholders/app-1.jpg',
    imagePosition: '50% 30%',
    accentColor: '#2563EB',
    stats: STATS,
    badge: 'CRM',
  },
  {
    name: 'AI chat agent',
    tagline: 'Answers, qualifies and books.',
    description: 'Replies to new leads on chat or SMS, asks the qualifying questions and offers a time to book. Project details coming soon.',
    imageSrc: '/placeholders/app-2.jpg',
    accentColor: '#7C3AED',
    stats: STATS,
    badge: 'AI agent',
  },
  {
    name: 'Follow-up workflows',
    tagline: 'Reminders that run themselves.',
    description: 'Email and SMS reminders, no-show follow-ups and lead routing, all running in the background. Project details coming soon.',
    imageSrc: '/placeholders/app-3.jpg',
    accentColor: '#16A34A',
    stats: STATS,
    badge: 'Automation',
  },
]

export const webApps: AppProject[] = [
  {
    name: 'Funnels and landing pages',
    tagline: 'Every visit has somewhere to go.',
    description: 'Pages wired to forms, calendars and tracking, feeding straight into the CRM. Project details coming soon.',
    accentColor: '#0EA5E9',
    stats: STATS,
    badge: 'Funnels',
  },
  {
    name: 'CRM setup',
    tagline: 'Pipelines, tags and fields done right.',
    description: 'A clean GoHighLevel setup so every lead lands in the right pipeline with the right tags. Project details coming soon.',
    accentColor: '#EF4444',
    stats: STATS,
    badge: 'CRM',
  },
  {
    name: 'Tool integrations',
    tagline: 'Your tools, talking to each other.',
    description: 'The CRM connected to forms, sheets and apps with Zapier, n8n or Make.com. Project details coming soon.',
    imageSrc: '/placeholders/project-3.jpg',
    accentColor: '#0891B2',
    stats: STATS,
    badge: 'Integrations',
  },
  {
    name: 'Voice agent',
    tagline: 'Picks up when you cannot.',
    description: 'An AI voice agent that answers calls, handles common questions and books appointments. Project details coming soon.',
    imageSrc: '/placeholders/project-4.jpg',
    accentColor: '#F59E0B',
    stats: STATS,
    badge: 'AI agent',
  },
]
