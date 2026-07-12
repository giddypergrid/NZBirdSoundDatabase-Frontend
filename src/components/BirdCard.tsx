import React, { forwardRef, useState } from 'react'
import { ChevronRight, Bird as BirdIcon } from 'lucide-react'
import { Bird } from 'types/bird'
import { useBirdImage } from 'hooks/useQueries'
import ImageNotFound from 'components/ImageNotFound'

type Props = {
  item: Bird
}

const BirdCard = forwardRef<HTMLDivElement, Props>(({ item }: Props, ref) => {
  const { data: imgUrl, isError } = useBirdImage(item)
  const [imgFailed, setImgFailed] = useState(false)
  const showFallback = isError || imgFailed || !imgUrl

  return (
    <div ref={ref} className='bg-card border border-hair shadow-sm rounded-2xl overflow-hidden group hover:border-hair-strong hover:shadow-lg transition-all duration-300 pt-3 px-3 pb-3'>
      <div className='flex items-center gap-2 px-2 py-2'>
        <BirdIcon className='w-5 h-5 text-brand shrink-0' strokeWidth={1.5} />
        <h2 className='text-lg font-bold text-ink leading-snug'>
          {item.common_name}
        </h2>
      </div>
      {/* Image */}
      <div className='w-full aspect-[3/2] bg-card-2 overflow-hidden rounded-xl'>
        {showFallback ? (
          <ImageNotFound />
        ) : (
          <img
            src={imgUrl}
            alt={item.common_name}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      {/* Content */}
      <div className='px-2 py-4'>
        {/* Title + scientific name on one line */}
        <div className='flex items-baseline gap-2 flex-wrap'>
          <label className='text-sm text-subtle'>Scientific name:</label>
          <p className='text-sm text-faint italic'>{item.scientific_name}</p>
        </div>

        {/* Naughty tagline */}
        {item.naughty_description && (
          <p className='text-[13px] text-ink/75 italic mt-2 line-clamp-2 leading-snug border-l-2 border-gold pl-2.5'>
            &ldquo;{item.naughty_description}&rdquo;
          </p>
        )}

        {/* View link */}
        <div className='mt-3 flex items-center gap-1 text-sm text-brand group-hover:text-brand-600 transition-colors'>
          <span className='font-medium'>View bird</span>
          <ChevronRight className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
        </div>
      </div>
    </div>
  )
});

BirdCard.displayName = 'BirdCard';

export default BirdCard;