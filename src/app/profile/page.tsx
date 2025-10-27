'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [username, setUsername] = useState('...');
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="bg-zinc-900 text-zinc-50 h-screen flex flex-col">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="flex items-center gap-6 mb-8">
            <img src="/placeholder-user.png" alt="Foto de perfil" className="w-24 h-24 rounded-full"/>
            <div>
              <span className="text-sm font-semibold text-zinc-400">Perfil</span>
              <h1 className="text-4xl font-bold">{username}</h1>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Mis Playlists</h2>
            <p className="text-zinc-400">
              Aquí podrías mostrar las listas de reproducción creadas por el usuario.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}