'use client';

import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';

interface CreatePlaylistFormProps {
  onPlaylistCreated: (name: string) => void;
  onClose: () => void;
}

export function CreatePlaylistForm({ onPlaylistCreated, onClose }: CreatePlaylistFormProps) {
  const [playlistName, setPlaylistName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (playlistName.trim()) {
      onPlaylistCreated(playlistName.trim());
      onClose();
      setPlaylistName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Crear nueva Playlist</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="playlistName" className="block text-sm font-medium text-zinc-400 mb-2">
            Nombre de la Playlist
          </label>
          <input
            type="text"
            id="playlistName"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="w-full p-2 rounded-md bg-zinc-800 text-zinc-50 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-md text-zinc-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-green-500 text-black font-semibold hover:bg-green-600 transition-colors"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}