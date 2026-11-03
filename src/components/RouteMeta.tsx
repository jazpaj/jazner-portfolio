import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { profile } from '@/data/profile'

const ORIGIN = 'https://jazner-portfolio.vercel.app'
const INDEX = 'index, follow, max-image-preview:large'
const NO_INDEX = 'noindex, follow'

type Meta = { title: string; description: string; robots?: string }

/** Home's title and description are also the static ones in index.html. */
const HOME: Meta = {
  title: `${profile.name} - ${profile.role}`,
  description: `${profile.name} builds CRM automations, AI agents and workflows that turn every lead into a booked call, on autopilot.`,
}

const ROUTES: Record<string, Meta> = {
  '/': HOME,
  '/projects': {
    title: `Projects - ${profile.name}`,
    description: 'CRM automations, AI agents, workflows and pages for coaches, agencies and small businesses.',
  },
  '/services': {
    title: `Services - ${profile.name}`,
    description: 'Systems that follow up, qualify and book for you: CRM automations, AI agents and workflows for coaches, agencies and small businesses.',
  },
  '/about': {
    title: `About - ${profile.name}`,
    description: `${profile.name} builds CRM automations, AI agents and workflows that turn leads into booked calls.`,
  },
  '/contact': {
    title: `FAQs / Contact - ${profile.name}`,
    description: 'Tell me about your business and where leads slip through. I will reply by email with the next step.',
  },
  '/privacy': {
    title: `Privacy Policy - ${profile.name}`,
    description: `What this site collects and how it is used: the privacy policy for ${profile.name}'s portfolio.`,
  },
  '/terms': {
    title: `Terms of Service - ${profile.name}`,
    description: `The terms of service for ${profile.name}'s portfolio site.`,
  },
  '/thank-you': { title: `Thank you - ${profile.name}`, description: HOME.description, robots: NO_INDEX },
}

const NOT_FOUND: Meta = { title: `Page not found - ${profile.name}`, description: HOME.description, robots: NO_INDEX }

function setAttr(selector: string, attr: string, value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

/**
 * Keeps the head in step with the route: title, description, canonical, robots
 * and the Open Graph copy of each. It edits the tags index.html ships rather
 * than rendering new ones, which would sit beside them as duplicates.
 */
export default function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/'
    const { title, description, robots = INDEX } = ROUTES[path] ?? NOT_FOUND
    const url = `${ORIGIN}${path === '/' ? '/' : path}`

    document.title = title
    setAttr('meta[name="description"]', 'content', description)
    setAttr('meta[name="robots"]', 'content', robots)
    setAttr('link[rel="canonical"]', 'href', url)
    setAttr('meta[property="og:title"]', 'content', title)
    setAttr('meta[property="og:description"]', 'content', description)
    setAttr('meta[property="og:url"]', 'content', url)
  }, [pathname])

  return null
}
