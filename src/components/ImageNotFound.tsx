import React from 'react'
import { Frown } from 'lucide-react'

type Props = {
  className?: string
  message?: string
}

const ImageNotFound: React.FC<Props> = ({ className = '', message = 'No image available' }) => {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-card-2 ${className}`}>
      <Frown className="w-10 h-10 text-faint mb-2" strokeWidth={1.5} />
      <span className="text-xs text-faint font-medium">{message}</span>
    </div>
  )
}

export default ImageNotFound
