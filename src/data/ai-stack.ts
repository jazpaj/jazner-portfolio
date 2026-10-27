/**
 * The systems tree shown in the Projects "systems" pop-up (and as chips on
 * Home and in the Projects bento card).
 *
 * This file is the ONLY place node copy lives. AIStack.tsx and AIStackGrid.tsx
 * render whatever shape they find here, so swapping in content is a data edit
 * and never a JSX edit. Keep the exported names and types stable.
 *
 * Shape rules:
 * - The root is you. Its children are the categories (branches).
 * - A branch with `status` is itself a system; a branch without one is a
 *   group whose children are the systems.
 * - Status is what the thing actually does today: "Live" (in use by others),
 *   "Internal" (works, you use it), "Beta".
 * - Logo marks in AIStackGrid.tsx are keyed by the node `id` below.
 */

import {
  Sparkle,
  CalendarCheck,
  Robot,
  ChatCircleDots,
  ChatText,
  PhoneCall,
  FlowArrow,
  SlackLogo,
  BellRinging,
  Plug,
  Database,
  ArrowsLeftRight,
  Browser,
  Code,
  FileText,
} from '@/components/slab'
import type { Icon } from '@/components/slab'
import { profile } from '@/data/profile'

export type StackStatus = 'Live' | 'Internal' | 'Beta'

/** A vendor mark, masked to a single ink colour so the row reads as one set
 *  rather than a rainbow of brand palettes. Only marks that already exist in
 *  public/icons are listed. */
export type StackLogo = { src: string; name: string }

export type StackNode = {
  id: string
  name: string
  /** One plain sentence a non-technical client understands. */
  what: string
  /** Real stack / model / where it runs. Rendered small and muted. */
  stack?: string
  status?: StackStatus
  /** Phosphor glyph for the card's mark tile. Every node has one. */
  Icon: Icon
  logos?: StackLogo[]
  children?: StackNode[]
}

const ANTHROPIC: StackLogo = { src: '/icons/anthropic.svg', name: 'Anthropic' }
const OPENAI: StackLogo = { src: '/icons/openai.svg', name: 'OpenAI' }
const SLACK: StackLogo = { src: '/icons/slack.svg', name: 'Slack' }

/** Single root: you. Branches are the categories. */
export const aiStack: StackNode = {
  id: 'root',
  Icon: Sparkle,
  name: profile.name,
  what: 'The CRM automations, AI agents and workflows I build for coaches, agencies and small businesses.',
  stack: 'Automation & AI Specialist',
  children: [
    {
      id: 'project-a',
      Icon: CalendarCheck,
      name: 'Lead-to-booking system',
      what: 'Takes a new lead from form fill to booked call, with follow-ups, reminders and pipeline updates along the way.',
      stack: 'GoHighLevel workflows, forms, calendars',
      status: 'Live',
    },
    {
      id: 'category-one',
      Icon: Robot,
      name: 'AI agents',
      what: 'Agents that answer, qualify and book, across chat, SMS and voice.',
      children: [
        {
          id: 'project-b',
          Icon: ChatCircleDots,
          logos: [ANTHROPIC, OPENAI],
          name: 'Website chat agent',
          what: 'Answers questions on the site, qualifies the lead and offers a time to book.',
          stack: 'GoHighLevel Conversation AI, Claude, ChatGPT',
          status: 'Live',
        },
        {
          id: 'project-c',
          Icon: ChatText,
          logos: [OPENAI],
          name: 'SMS follow-up agent',
          what: 'Texts new and cold leads, handles the replies and moves them toward a booking.',
          stack: 'GoHighLevel, SMS',
          status: 'Live',
        },
        {
          id: 'project-d',
          Icon: PhoneCall,
          name: 'Voice agent',
          what: 'Picks up calls, answers common questions and books appointments.',
          stack: 'GoHighLevel Voice AI',
          status: 'Beta',
        },
      ],
    },
    {
      id: 'category-two',
      Icon: FlowArrow,
      name: 'Workflow automation',
      what: 'The follow-ups, reminders and routing that run without anyone touching them.',
      children: [
        {
          id: 'project-e',
          Icon: SlackLogo,
          logos: [SLACK],
          name: 'Lead routing and alerts',
          what: 'Sends each new lead to the right person or pipeline and lets the team know in Slack.',
          stack: 'GoHighLevel, Zapier, Slack',
          status: 'Live',
        },
        {
          id: 'project-f',
          Icon: BellRinging,
          name: 'Reminders and no-show follow-up',
          what: 'Email and SMS reminders before every appointment, and a follow-up when someone misses one.',
          stack: 'GoHighLevel workflows',
          status: 'Live',
        },
      ],
    },
    {
      id: 'category-three',
      Icon: Plug,
      name: 'CRM and integrations',
      what: 'The CRM set up properly and connected to the tools a business already uses.',
      children: [
        {
          id: 'project-g',
          Icon: Database,
          name: 'CRM setup',
          what: 'Pipelines, tags and custom fields set up so every lead lands in the right place.',
          stack: 'GoHighLevel',
          status: 'Live',
        },
        {
          id: 'project-h',
          Icon: ArrowsLeftRight,
          name: 'Tool connections',
          what: 'Moves data between the CRM, forms, sheets and apps so nothing gets copied by hand.',
          stack: 'Zapier, n8n, Make.com, Google Workspace',
          status: 'Live',
        },
        {
          id: 'project-i',
          Icon: Browser,
          name: 'Funnels and landing pages',
          what: 'Pages wired to forms, calendars and tracking so every visit is captured.',
          stack: 'GoHighLevel funnels',
          status: 'Live',
        },
      ],
    },
    {
      id: 'project-j',
      Icon: Code,
      logos: [ANTHROPIC, OPENAI],
      name: 'How I build',
      what: 'AI tools that help me plan, build and test each system faster.',
      stack: 'Claude Code, ChatGPT, VS Code',
      status: 'Internal',
      children: [
        {
          id: 'project-k',
          Icon: FileText,
          name: 'Docs and handoff',
          what: 'Every build comes with written docs, so the system is yours to run.',
          stack: 'Google Workspace, Notion',
          status: 'Internal',
        },
      ],
    },
  ],
}
