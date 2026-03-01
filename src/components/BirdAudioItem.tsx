import React, { forwardRef } from 'react';
import ReactPlayer from 'react-player';
import { BirdSound } from 'types/bird';
import { useAudioUrl } from 'hooks/useQueries';
import AudioPlayer from './AudioPlayer';

type Props = {
  item: BirdSound;
};

const BirdAudioItem = forwardRef<HTMLDivElement, Props>(({ item }, ref) => {
  const { data: audioUrl } = useAudioUrl(item);
  return (
    <AudioPlayer src={audioUrl || ''} title={item.filename} />
  );
});

BirdAudioItem.displayName = 'BirdAudioItem';

export default BirdAudioItem;
