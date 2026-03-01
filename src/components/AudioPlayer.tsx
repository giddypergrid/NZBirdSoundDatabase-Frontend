import { useRef, useState, useEffect } from "react";

type Props = {
  src: string;
  title?: string;
};

export default function SimpleAudioPlayer({ src, title }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  // Update progress while playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const value = Number(e.target.value);
    audio.currentTime = value;
    setProgress(value);
  };

  const changeSpeed = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = value;
    setSpeed(value);
  };

  return (
    <div className="w-full max-w-md p-4 rounded-lg border shadow-sm space-y-3">
      {title && <div className="font-semibold text-gray-800">{title}</div>}

      <audio ref={audioRef} src={src} />

      {/* Play Button */}
      <button
        onClick={togglePlay}
        className="px-4 py-2 bg-black text-white rounded-md text-sm"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      {/* Progress Bar */}
      <input
        type="range"
        min={0}
        max={duration}
        value={progress}
        onChange={handleSeek}
        className="w-full"
      />

      {/* Speed Control */}
      <div className="flex gap-2 text-sm">
        {[1, 1.5, 2].map((s) => (
          <button
            key={s}
            onClick={() => changeSpeed(s)}
            className={`px-2 py-1 rounded border ${
              speed === s ? "bg-black text-white" : ""
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}