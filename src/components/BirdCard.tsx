import React, { forwardRef } from 'react'
import { Bird } from 'types/bird'
import { PLACEHOLDER_IMAGE } from 'settings'
import { useBirdImage } from 'hooks/useQueries'

type Props = {
  item: Bird
}

const BirdCard = forwardRef<HTMLDivElement, Props>(({ item }: Props, ref) => {
  const { data: imgUrl } = useBirdImage(item)
  
  return (
    <div ref={ref} className='flex gap-2 border border-gray-200 rounded-lg overflow-hidden h-52'>
      <div className='w-[40%] bg-gray-100'>
        <img 
          src={imgUrl || PLACEHOLDER_IMAGE} 
          alt={item.common_name}
          className='w-full h-full object-cover'
          onError={(e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <div className='p-4'>
        <h2 className='text-lg font-semibold text-gray-800'>{item.common_name}</h2>
        <p className='text-sm text-gray-600 italic'>{item.scientific_name}</p>
        <p className='text-xs text-gray-500 mt-1'>Code: {item.eBird}</p>
        {item.extra_name && (
          <p className='text-xs text-gray-500 mt-1'>{item.extra_name}</p>
        )}
      </div>
    </div>
  )
});

BirdCard.displayName = 'BirdCard';

export default BirdCard;