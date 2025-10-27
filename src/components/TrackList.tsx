import { FaPlayCircle, FaPauseCircle, FaMinusCircle, FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import { Track } from '@/context/MusicPlayerContext';
import React from 'react';

interface TrackListProps {
  tracks: Track[];
  currentSong: Track | null;
  isPlaying: boolean;
  onPlayPause: (track: Track) => void;
  onRemove?: (trackId: number) => void;
  onToggleLike?: (track: Track) => void;
  isLikedSongsView: boolean;
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${minutes}:${formattedSeconds}`;
};

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentSong,
  isPlaying,
  onPlayPause,
  onRemove,
  onToggleLike,
  isLikedSongsView,
}) => {
  if (tracks.length === 0) {
    return (
      <p className="text-center text-zinc-400 mt-20">
        {isLikedSongsView ? "No tienes canciones favoritas." : "No hay canciones en tu biblioteca."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="grid grid-cols-12 items-center hover:bg-zinc-800/50 rounded-lg p-2 transition-colors group"
        >
          <div className="col-span-1 flex items-center justify-center relative">
            <span className="opacity-100 group-hover:opacity-0 transition-opacity">{index + 1}</span>
            <button
              onClick={() => onPlayPause(track)}
              className="absolute opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {currentSong?.id === track.id && isPlaying ? (
                <FaPauseCircle size={20} className="text-white" />
              ) : (
                <FaPlayCircle size={20} className="text-white" />
              )}
            </button>
          </div>
          <div className="col-span-4 flex items-center gap-4">
            {track.album?.cover_medium && (
              <img src={track.album.cover_medium} alt={track.title} className="w-12 h-12 object-cover rounded" />
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-white">{track.title}</span>
              <span className="text-zinc-400 text-sm">{track.artist}</span>
            </div>
          </div>
          <div className="col-span-3 text-zinc-400">{track.artist}</div>
          <div className="col-span-3 text-zinc-400">
            <Link href={`/album/${track.album?.id}`} className="hover:underline">
              {track.album?.title}
            </Link>
          </div>
          <div className="col-span-1 text-zinc-400 text-right">{formatDuration(track.duration)}</div>
          <div className="col-span-1 flex justify-end">
            {isLikedSongsView ? (
              <button
                onClick={() => onToggleLike && onToggleLike(track)}
                className="text-green-500 hover:text-red-500 transition-colors"
              >
                <FaHeart size={20} />
              </button>
            ) : (
              <button
                onClick={() => onRemove && onRemove(track.id)}
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <FaMinusCircle size={20} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};