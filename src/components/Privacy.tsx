import { ArrowLeft } from '@/components/slab'
import { useNavigate } from 'react-router-dom'
import { profile } from '@/data/profile'

/**
 * Privacy Policy. Describes what this site collects: the contact form opens
 * the visitor's own email app, no analytics are installed, and the site is
 * hosted on Vercel.
 */
export default function Privacy() {
  const navigate = useNavigate()

  return (
    <main className="legal-page" aria-label="Privacy Policy">
      <div className="legal-page__card">
        <button
          className="legal-page__back"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <ArrowLeft weight="bold" size={15} aria-hidden="true" />
          Back to home
        </button>

        <h1 className="legal-page__title">Privacy Policy</h1>
        <p className="legal-page__updated">Last updated: 27 October 2026</p>

        <div className="legal-page__body">
          <h2>Who this covers</h2>
          <p>This site is run by {profile.name}, Automation &amp; AI Specialist. This policy covers this portfolio site and any message you send me through it.</p>

          <h2>What is collected</h2>
          <p>The contact form does not store anything on this site. When you press send, it opens your own email app with your name, email address and message filled in, and nothing is sent until you send that email yourself. No analytics or tracking tools are installed. The site is hosted on Vercel, which may keep standard server logs (such as IP address and browser type) to run and protect the service.</p>

          <h2>How it is used</h2>
          <p>I only use the details in your email to reply to you and to discuss the work you asked about. I do not sell your information or share it with anyone else, unless the law requires it.</p>

          <h2>How long it is kept</h2>
          <p>Emails are kept in my inbox for as long as they are useful for our conversation or project. You can ask me at any time to delete your messages and I will do so.</p>

          <h2>Contact</h2>
          <p>
            Questions about this policy: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        </div>
      </div>
    </main>
  )
}
