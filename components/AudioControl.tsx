import React, { useState, useEffect } from 'react';
import VolumeUpIcon from './icons/VolumeUpIcon';
import VolumeOffIcon from './icons/VolumeOffIcon';

interface AudioControlProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioControl: React.FC<AudioControlProps> = ({ audioRef }) => {
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
  }, [volume, isMuted, audioRef]);
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div className="fixed top-4 right-4 z-50 group flex items-center space-x-2 bg-brand-surface/50 backdrop-blur-sm p-2 rounded-full">
      <button
        onClick={toggleMute}
        className="text-brand-text/80 hover:text-brand-text transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {effectiveVolume === 0 ? <VolumeOffIcon className="w-7 h-7" /> : <VolumeUpIcon className="w-7 h-7" />}
      </button>
      <div className="w-0 group-hover:w-24 overflow-hidden transition-all duration-300">
         <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={effectiveVolume}
          onChange={handleVolumeChange}
          className="w-24 h-2 accent-brand-secondary cursor-pointer"
          aria-label="Volume"
        />
      </div>
    </div>
  );
};

export default AudioControl;
