'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Track {
    id: string | number;
    title: string;
    artist: string;
    album: {
        title: string;
        cover_medium: string;
        id: number;
    };
    preview: string;
    duration: number;
}

interface MusicPlayerContextType {
    currentSong: Track | null;
    playlist: Track[];
    isPlaying: boolean;
    volume: number;
    isShuffle: boolean;
    likedSongs: Track[]
    likedAlbums: Set<number>
    myLibrary: Track[]
    setCurrentSong: (song: Track | null) => void;
    setPlaylist: (list: Track[]) => void;
    play: () => void;
    pause: () => void;
    setVolume: (vol: number) => void;
    toggleShuffle: () => void;
    nextSong: () => void;
    prevSong: () => void;
    playPlaylist: (tracks: Track[], startIndex?: number) => void
    addToLibrary: (track: Track) => void
    removeFromLibrary: (id: string | number) => void
    toggleLikeSong: (track: Track) => void
    toggleLikeAlbum: (albumId: number) => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentSong, setCurrentSong] = useState<Track | null>(null);
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isShuffle, setIsShuffle] = useState(false);
    const [likedSongs, setLikedSongs] = useState<Track[]>([])
    const [likedAlbums, setLikedAlbums] = useState<Set<number>>(new Set())
    const [myLibrary, setMyLibrary] = useState<Track[]>([])
    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);
    const toggleShuffle = () => setIsShuffle(!isShuffle);

    const nextSong = () => {
        if (!currentSong || playlist.length === 0) return;
        const index = playlist.findIndex(t => t.id === currentSong.id);
        let nextIndex = index;

        if (isShuffle) {
            do {
                nextIndex = Math.floor(Math.random() * playlist.length);
            } while (playlist.length > 1 && nextIndex === index);
        } else {
            nextIndex = (index + 1) % playlist.length;
        }

        setCurrentSong(playlist[nextIndex]);
    };

    const prevSong = () => {
        if (!currentSong || playlist.length === 0) return;
        const index = playlist.findIndex(t => t.id === currentSong.id);
        let prevIndex = index;

        if (isShuffle) {
            do {
                prevIndex = Math.floor(Math.random() * playlist.length);
            } while (playlist.length > 1 && prevIndex === index);
        } else {
            prevIndex = (index - 1 + playlist.length) % playlist.length;
        }

        setCurrentSong(playlist[prevIndex]);
    }

    const playPlaylist = (tracks: Track[], startIndex = 0) => {
    if (!tracks || tracks.length === 0) return;
    setPlaylist(tracks);
    setCurrentSong(tracks[startIndex]);
    setIsPlaying(true);
}

const addToLibrary = (track: Track) => {
    setMyLibrary(prev => {
      if (prev.some(t => t.id === track.id)) return prev
      return [...prev, track]
    })
  }

  const removeFromLibrary = (id: string | number) => {
    setMyLibrary(prev => prev.filter(t => t.id !== id))
  }

  const toggleLikeSong = (track: Track) => {
    setLikedSongs(prev => {
      const exists = prev.some(t => t.id === track.id)
      return exists ? prev.filter(t => t.id !== track.id) : [...prev, track]
    })
  }

  const toggleLikeAlbum = (albumId: number) => {
    setLikedAlbums(prev => {
      const newSet = new Set(prev)
      if (newSet.has(albumId)) newSet.delete(albumId)
      else newSet.add(albumId)
      return newSet
    })
  }

    const value = {
        currentSong,
        playlist,
        isPlaying,
        volume,
        isShuffle,
        likedSongs,
        likedAlbums,
        myLibrary,
        setCurrentSong,
        setPlaylist,
        play,
        pause,
        setVolume,
        toggleShuffle,
        nextSong,
        prevSong,
        playPlaylist,
        addToLibrary,
        removeFromLibrary,
        toggleLikeSong,
        toggleLikeAlbum
    };

    return (
        <MusicPlayerContext.Provider value={value}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayer = () => {
    const context = useContext(MusicPlayerContext);
    if (context === undefined) {
        throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
    }
    return context;
};
