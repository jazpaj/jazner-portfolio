export type Sample = { file: string; label: string; desc: string }

/** Real GoHighLevel workflows. Images live in public/workflows/thumbs (16:10
 *  cards) and public/workflows/full (the modal); originals in assets-src/. */
export const SAMPLES: Sample[] = [
  { file: 'voice-ai-post-call-router', label: 'Voice AI post-call router', desc: 'After every Voice AI call, sorts the caller (silent, spam, existing customer, not qualified, real lead), books or creates the deal, and alerts the team on hot leads.' },
  { file: 'missed-call-textback', label: 'Missed-call text-back', desc: 'Texts back every missed caller within seconds, skips spam and repeat callers, alerts the owner, creates a call-back task and opens a deal if none exists.' },
  { file: 'stage-moves-by-tag', label: 'Stage moves by tag', desc: 'Moves the right pipeline card when a stage tag is added (estimate sent, paid, lost and more), then cleans the tag up. Flags it if no card is found.' },
  { file: 'pipeline-stage-sync', label: 'Pipeline stage sync', desc: 'When a deal changes stage, writes the new stage back to the contact so reports, filters and follow-ups always match the pipeline.' },
  { file: 'disposition-sync', label: 'Opportunity disposition sync', desc: 'The reverse direction: when a rep sets a disposition on the contact, the matching opportunity is created or moved to that stage.' },
]

export const thumbOf = (s: Pick<Sample, 'file'>) => `/workflows/thumbs/${s.file}.webp`
