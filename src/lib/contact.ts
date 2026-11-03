import { profile } from '@/data/profile'

/**
 * Contact submission.
 *
 * Out of the box there is no backend: submitLead() opens the visitor's mail
 * client with a message addressed to profile.email (src/data/profile.ts).
 *
 * To wire a real backend (Formspree, a serverless function, a webhook...):
 *   1. Set VITE_CONTACT_ENDPOINT in .env.production to the URL that accepts
 *      a JSON POST of the Lead type below.
 *   2. Have it answer 2xx on success, or a non-2xx with { "error": "..." }
 *      and that sentence is shown to the visitor as-is.
 * With the variable unset the mail client path below is used instead.
 */

export const ENDPOINT: string = import.meta.env.VITE_CONTACT_ENDPOINT ?? ''
export const RECIPIENT = profile.email

export const MAX_NAME = 80
export const MAX_EMAIL = 254
export const MAX_MESSAGE = 5000

// Built from \u escapes so the source stays pure ASCII.
// Control chars U+0000-U+001F and U+007F; when newlines are allowed, tab,
// LF and CR survive. Zero-width and bidi marks always go.
const CTRL_NO_NL = new RegExp('[\\u0000-\\u001F\\u007F]', 'g')
const CTRL_KEEP_NL = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g')
const ZERO_WIDTH = new RegExp('[\\u200B-\\u200F\\u202A-\\u202E\\u2060\\uFEFF]', 'g')

export function sanitize(input: string, allowNewlines = false): string {
  const controls = allowNewlines ? CTRL_KEEP_NL : CTRL_NO_NL
  return input.replace(controls, '').replace(ZERO_WIDTH, '')
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type Lead = {
  firstName: string
  lastName: string
  email: string
  message: string
  /** Honeypot. Empty for a person; your backend should drop anything else. */
  website: string
}

export type SubmitResult = { via: 'webhook' } | { via: 'mailto' }

export type LeadField = 'firstName' | 'lastName' | 'email' | 'message'

function cleanFields(data: FormData): Record<LeadField, string> {
  return {
    firstName: sanitize(String(data.get('firstName') ?? '').trim()).slice(0, MAX_NAME),
    lastName: sanitize(String(data.get('lastName') ?? '').trim()).slice(0, MAX_NAME),
    email: sanitize(String(data.get('email') ?? '').trim()).slice(0, MAX_EMAIL),
    message: sanitize(String(data.get('message') ?? '').trim(), true).slice(0, MAX_MESSAGE),
  }
}

/** The fields readLead would reject, in form order. */
export function invalidFields(data: FormData): LeadField[] {
  const f = cleanFields(data)
  const bad: LeadField[] = []
  if (!f.firstName) bad.push('firstName')
  if (!f.lastName) bad.push('lastName')
  if (!f.email || !EMAIL_RE.test(f.email)) bad.push('email')
  if (!f.message) bad.push('message')
  return bad
}

/** Read, trim, cap and sanitise the four fields. Returns null if a required
 *  field is missing or the email does not look like one. */
export function readLead(data: FormData): Lead | null {
  if (invalidFields(data).length > 0) return null
  const { firstName, lastName, email, message } = cleanFields(data)
  const website = String(data.get('website') ?? '')
  return { firstName, lastName, email, message, website }
}

export class SubmitError extends Error {}

export async function submitLead(lead: Lead): Promise<SubmitResult> {
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new SubmitError(body?.error || `The server answered ${res.status}.`)
    }
    return { via: 'webhook' }
  }

  const subject = `Project inquiry from ${lead.firstName} ${lead.lastName}`
  const body = [`Name: ${lead.firstName} ${lead.lastName}`, `Email: ${lead.email}`, '', lead.message].join('\n')
  // encodeURIComponent on every value blocks header injection (CR/LF) and
  // parameter smuggling via & or ?.
  window.location.href = `mailto:${encodeURIComponent(RECIPIENT)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  return { via: 'mailto' }
}
