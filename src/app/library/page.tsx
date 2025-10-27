'use client';

import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/TranslationContext';
import Link from 'next/link';
import { TrackList } from '@/components/TrackList';

type ViewMode = 'all' | 'likedSongs' | 'likedAlbums';

interface Album {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  cover_medium: string;
}

export default function LibraryPage() {
  const {
    myLibrary,
    likedSongs,
    likedAlbums,
    setCurrentSong,
    currentSong,
    isPlaying,
    play,
    pause,
    removeFromLibrary,
    toggleLikeSong,
  } = useMusicPlayer();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [likedAlbumsData, setLikedAlbumsData] = useState<Album[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  useEffect(() => {
    const fetchLikedAlbums = async () => {
      setLoadingAlbums(true);
      const albums = await Promise.all(
        Array.from(likedAlbums).map(async (albumId) => {
          const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://api.deezer.com/album/${albumId}`)}`);
          return response.json();
        })
      );
      setLikedAlbumsData(albums);
      setLoadingAlbums(false);
    };
    fetchLikedAlbums();
  }, [likedAlbums]);

  const filteredLibrary = myLibrary.filter((track) => {
    const title = track.title || '';
    const artist = track.artist || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || artist.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredLikedSongs = likedSongs.filter((track) => {
    const title = track.title || '';
    const artist = track.artist || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || artist.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredLikedAlbums = likedAlbumsData.filter((album) => {
    const title = album.title || '';
    const artist = album.artist?.name || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || artist.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePlayPause = (track: any) => {
    if (currentSong?.id === track.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      setCurrentSong(track);
      play();
    }
  };

  const renderContent = () => {
    if (viewMode === 'all') {
      return (
        <TrackList
          tracks={filteredLibrary}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onRemove={removeFromLibrary}
          isLikedSongsView={false}
        />
      );
    } else if (viewMode === 'likedSongs') {
      return (
        <TrackList
          tracks={filteredLikedSongs}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onToggleLike={toggleLikeSong}
          isLikedSongsView={true}
        />
      );
    } else if (viewMode === 'likedAlbums') {
      if (loadingAlbums) {
        return <p className="text-center text-zinc-400 mt-20">{t('loadingAlbums')}</p>;
      }
      return filteredLikedAlbums.length === 0 ? (
        <p className="text-center text-zinc-400 mt-20">{t('noFavoriteAlbums')}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredLikedAlbums.map((album) => (
            <Link key={album.id} href={`/album/${album.id}`} className="flex flex-col items-center text-center">
              <img src={album.cover_medium} alt={album.title} className="w-full rounded shadow-lg mb-2" />
              <p className="text-sm font-semibold">{album.title}</p>
              <p className="text-xs text-zinc-400">{album.artist?.name || 'Unknown Artist'}</p>
            </Link>
          ))}
        </div>
      );
    }
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold mb-8 md:mb-3">{t('yourLibrary')}</h1>
            <input
              type="text"
              placeholder={t('searchLibrary')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`p-2 mb-3 rounded-full w-full md:w-64 ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-gray-200 text-black'}`}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${viewMode === 'all' ? 'bg-green-500 text-black' : 'bg-zinc-800 text-white'}`}
            >
              {t('allSongs')}
            </button>
            <button
              onClick={() => setViewMode('likedSongs')}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${viewMode === 'likedSongs' ? 'bg-green-500 text-black' : 'bg-zinc-800 text-white'}`}
            >
              {t('likedSongsTitle')}
            </button>
            <button
              onClick={() => setViewMode('likedAlbums')}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${viewMode === 'likedAlbums' ? 'bg-green-500 text-black' : 'bg-zinc-800 text-white'}`}
            >
              {t('likedAlbumsTitle')}
            </button>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}