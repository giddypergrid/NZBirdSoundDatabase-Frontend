import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { Bird } from 'types/bird'
import { useBirdImage } from 'hooks/useQueries'
import ImageNotFound from 'components/ImageNotFound'

type Props = {
  birds: Bird[]
}

const FeaturedImage: React.FC<{ bird: Bird }> = ({ bird }) => {
  const { data: imgUrl, isError } = useBirdImage(bird)
  const [failed, setFailed] = useState(false)
  const showFallback = isError || failed || !imgUrl

  return (
    <div className="aspect-[16/10] bg-card-2 overflow-hidden">
      {showFallback ? (
        <ImageNotFound />
      ) : (
        <img
          src={imgUrl}
          alt={bird.common_name}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

const HeroSection: React.FC<Props> = ({ birds }) => {
  const featured = birds[0]
  const scrollToSearch = () =>
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="w-full bg-paper border-b border-hair">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: copy */}
        <div>
          <h1 className="animate-rise text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.05]" style={{ animationDelay: '0s' }}>
            Listen to every bird in New Zealand.
          </h1>
          <p className="animate-rise mt-5 text-lg text-subtle max-w-xl leading-relaxed" style={{ animationDelay: '0.15s' }}>
            Identify birds by their calls. Search a curated database of native species, or upload a recording and let the model tell you what's singing in your backyard.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '0.23s' }}>
            <button onClick={scrollToSearch} className="inline-flex items-center px-5 py-3 rounded-lg bg-brand hover:bg-brand-600 text-white font-medium text-sm transition-colors">
              Search the database
            </button>
            <Link to="/match" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-hair-strong hover:border-ink text-ink font-medium text-sm transition-colors">
              Match a sound <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Right: featured bird panel */}
        {featured && (
          <div className="animate-rise bg-card border border-hair rounded-2xl shadow-sm overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="p-4 flex items-center justify-between border-b border-hair">
              <div className="min-w-0">
                <div className="font-semibold text-ink truncate">{featured.common_name}</div>
                <div className="text-sm italic text-subtle truncate">{featured.scientific_name}</div>
              </div>
              <span className="font-mono text-[11px] text-brand bg-brand-tint px-2.5 py-1 rounded-full shrink-0 ml-3">
                {featured.eBird}
              </span>
            </div>
            <FeaturedImage bird={featured} />
            <div className="p-4 flex items-center justify-between">
              <Link to={`/bird/${encodeURIComponent(featured.eBird)}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-600 text-white text-sm font-medium transition-colors">
                <Play className="w-3.5 h-3.5 fill-current" /> Listen
              </Link>
              <span className="text-xs text-faint">Featured bird</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroSection
