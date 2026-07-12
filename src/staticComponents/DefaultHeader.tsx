import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const DefaultHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const btnClass = 'text-sm text-subtle hover:text-ink transition-colors cursor-pointer';

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-paper/80 backdrop-blur-md border-b border-hair">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/site-logo.png" alt="NZ Bird Sound logo" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              NZ Bird Database
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('search-section')} className={btnClass}>Search birds</button>
            <button onClick={() => scrollToSection('database-section')} className={btnClass}>Bird database</button>
          </nav>
        </div>

        {/* Right: primary action (its own page) */}
        <Link
          to="/match"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-600 text-white text-sm font-medium transition-colors"
        >
          Match a sound <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </header>
  )
}

export default DefaultHeader
