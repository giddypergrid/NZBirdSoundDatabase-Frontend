import React from 'react'
import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'

const linkClasses =
  'text-sm text-white/40 hover:text-white/70 transition-colors underline'

const GITHUB_URL =
  'https://github.com/giddypergrid/NZBirdSoundDatabase-Frontend'

const Footer = () => {
  return (
    <footer className="mt-auto sticky bottom-0 z-30 border-t border-white/10 bg-forest-950/95 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} New Zealand Bird Sound Database. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link to="/legal#privacy" className={linkClasses}>
            Privacy policy
          </Link>
          <Link to="/legal#terms" className={linkClasses}>
            Terms of service
          </Link>
          <Link to="/legal#cookies" className={linkClasses}>
            Cookie settings
          </Link>
          <Link to="/legal#data" className={linkClasses}>
            Data source
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
            aria-label="GitHub repository"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <Link
            to="/legal#contact"
            className="text-sm px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
