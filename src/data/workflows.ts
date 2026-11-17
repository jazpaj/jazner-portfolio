export type Platform = 'GoHighLevel' | 'Zapier'
export type Sample = { file: string; label: string; desc: string; platform: Platform }

/** Real automations: GoHighLevel workflows and Zapier zaps. Images live in
 *  public/workflows/thumbs (16:10 cards) and public/workflows/full (the
 *  modal); originals in assets-src/. */
export const SAMPLES: Sample[] = [
  { file: 'voice-ai-post-call-router', label: 'Voice AI post-call router', desc: 'After every Voice AI call, sorts the caller (silent, spam, existing customer, not qualified, real lead), books or creates the deal, and alerts the team on hot leads.', platform: 'GoHighLevel' },
  { file: 'missed-call-textback', label: 'Missed-call text-back', desc: 'Texts back every missed caller within seconds, skips spam and repeat callers, alerts the owner, creates a call-back task and opens a deal if none exists.', platform: 'GoHighLevel' },
  { file: 'stage-moves-by-tag', label: 'Stage moves by tag', desc: 'Moves the right pipeline card when a stage tag is added (estimate sent, paid, lost and more), then cleans the tag up. Flags it if no card is found.', platform: 'GoHighLevel' },
  { file: 'pipeline-stage-sync', label: 'Pipeline stage sync', desc: 'When a deal changes stage, writes the new stage back to the contact so reports, filters and follow-ups always match the pipeline.', platform: 'GoHighLevel' },
  { file: 'disposition-sync', label: 'Opportunity disposition sync', desc: 'The reverse direction: when a rep sets a disposition on the contact, the matching opportunity is created or moved to that stage.', platform: 'GoHighLevel' },
  { file: 'invite-to-courses', label: 'Course access on onboarding', desc: 'When a deal or contact changes, grants the client their courses, revokes the old training, tags them as active and marks them as a client unless they are an admin.', platform: 'GoHighLevel' },
  { file: 'onboarding-form-router', label: 'Onboarding form router', desc: 'When the onboarding form comes in, sends a postcard, updates the records, emails the team about extra users, tags the loan system the client uses, then moves their deal and alerts Slack.', platform: 'GoHighLevel' },
  { file: 'hiring-intake-sorter', label: 'Applicant intake sorter', desc: 'When an applicant submits the intake form, sends a thank-you email and text, opens a deal, then tags them by availability and by primary skill.', platform: 'GoHighLevel' },
  { file: 'arive-loan-status-zap', label: 'Arive loan status to GoHighLevel', desc: 'When a loan status is updated in the Arive mortgage system, two filter steps check it, then LeadConnector adds the lead to a GoHighLevel workflow.', platform: 'Zapier' },
  { file: 'drive-ai-content-zap', label: 'Drive upload to AI blog and social posts', desc: 'When a file lands in a Google Drive folder, AI transcribes it and writes blog posts, then a loop sends each post down two paths that publish to Facebook, LinkedIn and Instagram.', platform: 'Zapier' },
]

export const thumbOf = (s: Pick<Sample, 'file'>) => `/workflows/thumbs/${s.file}.webp`
