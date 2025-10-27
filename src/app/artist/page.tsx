'use client';

import { Play } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const playlistsData = {
  'top-50-global': {
    name: 'Top 50 - Global',
    image: '/playlist/top50.jpeg',
    tracks: [
      { id: 1, name: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20' },
      { id: 2, name: 'Watermelon Sugar', artist: 'Harry Styles', duration: '2:54' },
    ]
  },
  'mix-del-dia': {
    name: 'Mix del Día',
    image: '/playlist/mix.jpg',
    tracks: [
      { id: 4, name: 'Heat Waves', artist: 'Glass Animals', duration: '3:58' },
      { id: 5, name: 'Drivers License', artist: 'Olivia Rodrigo', duration: '4:02' },
      { id: 6, name: 'Good 4 u', artist: 'Olivia Rodrigo', duration: '2:58' },
    ]
  },
};

export default function PlaylistPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const playlist = id ? playlistsData[id as keyof typeof playlistsData] : null;

  if (!playlist) {
    return (
      <div className="bg-zinc-900 text-zinc-50 h-screen flex flex-col">
        <main className="flex-1 p-6">
          <h1 className="font-bold text-3xl">Playlist no encontrada</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 text-zinc-50 h-screen flex flex-col">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="flex items-end gap-6 mb-8">
            <img src={playlist.image} alt={playlist.name} className="w-48 h-48 rounded" />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-zinc-400">PLAYLIST</span>
              <h1 className="text-5xl font-bold">{playlist.name}</h1>
              <span className="text-sm text-zinc-400">{playlist.tracks.length} canciones</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <button className="w-12 h-12 rounded-full bg-green-400 text-black flex items-center justify-center hover:scale-105">
              <Play fill="black" />
            </button>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700 text-zinc-400 text-sm">
                <th className="py-2 w-12">#</th>
                <th className="py-2">Título</th>
                <th className="py-2">Artista</th>
                <th className="py-2 text-right">Duración</th>
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.map((track, index) => (
                <tr key={track.id} className="border-b border-zinc-800 text-sm text-zinc-200 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{track.name}</td>
                  <td className="py-2 text-zinc-400">{track.artist}</td>
                  <td className="py-2 text-zinc-400 text-right">{track.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}