'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react';
import { useMusicPlayer, Track } from '@/context/MusicPlayerContext';

interface Props {
  isLoop: boolean;
  isShuffle: boolean;
  toggleLoop: () => void;
  toggleShuffle: () => void;
}

export function PlaybackControls({ isLoop, isShuffle, toggleLoop, toggleShuffle }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentSong, setCurrentSong, playlist } = useMusicPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [repeatOne, setRepeatOne] = useState(false);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = currentSong.preview;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    setDuration(currentSong.duration || 30);
    setCurrentTime(0);
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const endedHandler = () => {
      if (repeatOne) {
        audio.currentTime = 0;
        audio.play();
      } else if (isLoop) {
        audio.currentTime = 0;
        audio.play();
      } else {
        skip('next');
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', endedHandler);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', endedHandler);
    };
  }, [repeatOne, isLoop, playlist, currentSong]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (t: number) => {
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume <= 0.33) return <Volume size={20} />;
    if (volume <= 0.66) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  const skip = (direction: 'next' | 'prev') => {
    if (!playlist || playlist.length === 0 || !currentSong) return;

    const index = playlist.findIndex((t) => t.id === currentSong.id);
    if (index === -1) return;

    let newIndex = index;

    if (isShuffle) {
      let randomIndex = index;
      while (randomIndex === index && playlist.length > 1) {
        randomIndex = Math.floor(Math.random() * playlist.length);
      }
      newIndex = randomIndex;
    } else {
      if (direction === 'next') newIndex = (index + 1) % playlist.length;
      if (direction === 'prev') newIndex = (index - 1 + playlist.length) % playlist.length;
    }

    const nextSong = playlist[newIndex];
    const songWithAlbum = {
      ...nextSong,
      album: nextSong.album || { cover_medium: '/placeholder.png', id: 0, title: '' }
    };

    setCurrentSong(songWithAlbum);
  };

  const toggleRepeatOne = () => {
    setRepeatOne(!repeatOne);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full p-4 bg-zinc-800 text-zinc-50 rounded-lg shadow-lg">
      <audio ref={audioRef} preload="auto" />

      <div className="flex items-center gap-4 w-full md:w-1/4 mb-4 md:mb-0">
        {currentSong ? (
          <>
            <img
              src={currentSong.album?.cover_medium || '/placeholder.png'}
              alt={currentSong.title || 'Canción'}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm text-white truncate">{currentSong.title}</span>
              <span className="text-zinc-400 text-xs truncate">{currentSong.artist}</span>
            </div>
          </>
        ) : (
          <span className="text-red-400 text-sm">No hay canción seleccionada</span>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 w-full md:w-1/2">
        <div className="flex items-center gap-4">
          <button onClick={() => skip('prev')}>
            <SkipBack size={24} className="text-zinc-400 hover:text-white transition-colors" />
          </button>

          <button onClick={handlePlayPause}>
            {isPlaying ? <Pause size={48} className="text-white" /> : <Play size={48} className="text-white" />}
          </button>

          <button onClick={() => skip('next')}>
            <SkipForward size={24} className="text-zinc-400 hover:text-white transition-colors" />
          </button>

          <button onClick={toggleShuffle} className={`${isShuffle ? 'text-green-400' : 'text-zinc-400'}`}>
            <Shuffle size={24} />
          </button>

          <button onClick={toggleRepeatOne} className={`${repeatOne ? 'text-green-400' : 'text-zinc-400'}`}>
            <Repeat size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full mt-2">
          <span className="text-zinc-400 text-xs">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={handleProgressChange}
            className="flex-1 h-1 bg-zinc-700 rounded-lg accent-green-400"
          />
          <span className="text-zinc-400 text-xs">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-end gap-2 w-1/4">
        {getVolumeIcon()}
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolumeChange} className="w-24" />
      </div>
    </div>
  );
}
