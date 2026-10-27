/**
 * YOUR IDENTITY - start here.
 *
 * Everything that says who you are lives in this file: name, handle, photo,
 * socials, email and the Home headline.
 *
 * Page-specific copy (projects, services, testimonials, FAQs) lives in the
 * other files in src/data/ and at the top of each view component.
 */

import { Briefcase, SealCheck, Clock, type Icon } from '@/components/slab'

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

/** A proof fact on the phone's Home: a glyph, a short value, a caption. */
export type Stat = { value: string; label: string; Icon: Icon }

export type Profile = {
  name: string
  /** First name, used in "Hi, I'm ___." on About. */
  firstName: string
  handle: string
  /** Short role line under the handle on phones. */
  role: string
  /** Square image. An SVG, WebP or PNG with a transparent background looks best. */
  avatarSrc: string
  /** Tooltip / screen-reader label on the verified tick next to your name. */
  verifiedLabel: string
  email: string
  location: string
  /** Three short proof facts shown on phones under the Home lede. */
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'Jazner Pajarin',
  firstName: 'Jazner',
  handle: '@jaznerpajarin',
  role: 'Automation & AI Specialist',
  avatarSrc: '/images/jazner.jpg',
  verifiedLabel: 'Automation & AI Specialist',
  email: 'jazpajarin08@gmail.com',
  location: 'Remote, worldwide',
  // Pick any icon from https://phosphoricons.com and import it above.
  stats: [
    { value: '24/7', label: 'Systems running', Icon: Clock },
    { value: 'AI-first', label: 'Agents & LLMs', Icon: SealCheck },
    { value: 'Remote', label: 'Clients worldwide', Icon: Briefcase },
  ],
  // The intro types this line, then flies it into the Home headline.
  // Keep it short: two halves, 5-8 words total.
  displayName: { line1: 'Your quiet operator', line2: 'behind the scenes.' },
  hero: {
    body: 'I build CRM automations, AI agents and workflows that turn every lead into a booked call, on autopilot.',
    portraitSrc: '/images/jazner.jpg',
    portraitAlt: 'Jazner Pajarin',
  },
  socials: [
    { label: 'LinkedIn profile', href: 'https://www.linkedin.com/in/jaznerpajarin/', iconPath: '/icons/linkedin.svg' },
  ],
}
