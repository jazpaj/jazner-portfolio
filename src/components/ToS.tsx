import { ArrowLeft } from '@/components/slab'
import { useNavigate } from 'react-router-dom'
import { profile } from '@/data/profile'

/**
 * Terms of Service. Simple, general terms for visiting this site and working
 * together; each project's specific terms are agreed in writing.
 */
export default function ToS() {
  const navigate = useNavigate()

  return (
    <main className="legal-page" aria-label="Terms of Service">
      <div className="legal-page__card">
        <button
          className="legal-page__back"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <ArrowLeft weight="bold" size={15} aria-hidden="true" />
          Back to home
        </button>

        <h1 className="legal-page__title">Terms of Service</h1>
        <p className="legal-page__updated">Last updated: 27 October 2026</p>

        <div className="legal-page__body">
          <h2>Using this site</h2>
          <p>This site is a portfolio of my work. You are welcome to browse it and contact me through it. Please do not copy its content or use the site for anything unlawful.</p>

          <h2>Work and payment</h2>
          <p>Every project starts with a short discovery call. After that I send a written scope and quote, and work begins once you approve it. Payment terms, timelines and deliverables are agreed in writing for each project before any work starts.</p>

          <h2>Ownership</h2>
          <p>The content on this site belongs to me. Once a project is paid in full, the systems I build for you are yours to use and run. Third-party tools and platforms, such as your CRM, stay under their own terms and your own accounts.</p>

          <h2>Liability</h2>
          <p>I test every build before handoff, but I cannot guarantee that third-party tools will always work without interruption. This site and its content are provided as is, and I am not liable for indirect losses that come from using it or the tools my work connects to.</p>

          <h2>Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        </div>
      </div>
    </main>
  )
}
