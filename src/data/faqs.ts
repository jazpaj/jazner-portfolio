export type QA = { q: string; a: string }

/**
 * The questions people ask before they email. One list, used by the FAQ
 * accordion on the Contact view (and the legacy long-scroll FAQ section).
 * Five questions, two or three sentences each: the accordion sits in a
 * fixed panel and more than that pushes the email row off the plate.
 */
export const FAQS: QA[] = [
  {
    q: 'What do you do?',
    a: 'I build CRM automations in GoHighLevel, AI agents for chat, SMS and voice, follow-up workflows, funnels and integrations. Most of my clients are coaches, agencies and small businesses that want leads followed up and booked without doing it by hand.',
  },
  {
    q: 'How fast can you start?',
    a: 'It depends on the size of the job and what I have on. Small fixes can usually start sooner than a full build. Send me a note and I will give you a realistic start date.',
  },
  {
    q: 'How much do you charge?',
    a: 'Pricing depends on scope. Most projects are quoted per project after a short discovery call, once I know what the system needs to do and which tools it has to connect.',
  },
  {
    q: 'Where are you based?',
    a: 'I work remotely with clients worldwide. We agree on a way of working and check-in times that suit both sides at the start of the project.',
  },
  {
    q: 'What happens after I write?',
    a: 'I read your message and reply by email. If it looks like a fit, the next step is a short call to map your process and find where leads and hours are leaking.',
  },
]
