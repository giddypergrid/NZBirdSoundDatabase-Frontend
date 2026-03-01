import React from 'react';
import { Bird, BirdSound } from 'types/bird'
import { useBirdSoundList } from 'hooks/useQueries'
import { soundApi } from 'services/api'
import InfiniteScrollArea from './InfiniteScrollArea';
import BirdAudioItem from './BirdAudioItem';
import { DEFAULT_BIRD_BATCH_SIZE } from 'settings';

type Props = {
  bird: Bird
}

const BirdAudio = ({bird}: Props) => {
  const { data: birdSounds = [], isLoading } = useBirdSoundList(bird);
  return (
    <div className="w-full h-[calc(100vh-200px)] bg-gray-50 rounded-xl overflow-hidden shadow-inner flex flex-col border border-gray-200">
      <div className="px-4 py-3 bg-white border-b border-gray-200 font-semibold text-lg text-gray-800 sticky top-0 z-10 shadow-sm shrink-0">
        Audio Materials for {bird.common_name}
      </div>
      <div className="p-3 flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500">Loading audio files...</span>
          </div>
        ) : (
          <InfiniteScrollArea<BirdSound, 'id'>
            ItemComponent={BirdAudioItem}
            BatchSize={DEFAULT_BIRD_BATCH_SIZE}
            ItemIndexType="id"
            items={birdSounds}
            className="w-full h-full overflow-y-auto scroll-bar-thin"
          />
        )}
      </div>
    </div>
  )
}

export default BirdAudio;