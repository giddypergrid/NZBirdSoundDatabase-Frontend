import React from 'react'

import { images } from '../resources/images'



type Props = {}



const DefaultHeader = (props: Props) => {

  return (

    <header className="relative z-10 min-w-[320px] w-full h-[160px] overflow-hidden flex justify-center">

        <img src={images.homeHeaderBg} alt="New Zealand Birds Header" className="w-[80%] h-full object-fill rounded-lg" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent">

          <h1 className="absolute top-[5%] w-full text-[calc(12px_+_2.5vw)] font-extrabold text-white text-center tracking-tighter drop-shadow-2xl whitespace-nowrap">

            New Zealand Bird Sound Database

          </h1>

          <p className="absolute top-[42%] w-full text-[calc(10px_+_0.5vw)] text-white/90 font-medium text-center drop-shadow-xl whitespace-nowrap">

            Explore and listen to bird calls from across Aotearoa

          </p>

        </div>

    </header>

  )

}



export default DefaultHeader