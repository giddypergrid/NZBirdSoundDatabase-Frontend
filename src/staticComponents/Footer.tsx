import React from 'react'
import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'

const linkClasses =
  'text-sm text-subtle hover:text-ink transition-colors underline'

const GITHUB_URL =
  'https://github.com/giddypergrid/NZBirdSoundDatabase-Backend'

const Footer = () => {
  return (
    <footer className="mt-auto sticky bottom-0 z-30 border-t border-hair bg-card/95 backdrop-blur-2xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-subtle">
          &copy; {new Date().getFullYear()} New Zealand Bird Sound Database. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link to="/legal" className={`${linkClasses} md:hidden`}>
            Legal
          </Link>

          <Link to="/legal#privacy" className={`${linkClasses} hidden md:inline`}>
            Privacy policy
          </Link>
          <Link to="/legal#terms" className={`${linkClasses} hidden md:inline`}>
            Terms of service
          </Link>
          <Link to="/legal#cookies" className={`${linkClasses} hidden lg:inline`}>
            Cookie settings
          </Link>
          <Link to="/legal#data" className={`${linkClasses} hidden lg:inline`}>
            Data source
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1.5 text-sm text-subtle hover:text-ink transition-colors"
            aria-label="GitHub repository"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <Link
            to="/legal#contact"
            className="text-sm px-3 py-1.5 rounded-md bg-brand hover:bg-brand-600 text-white transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
