'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/TranslationContext';
import Link from 'next/link';

interface Artist {
  id: number;
  name: string;
  picture_medium: string;
}

export default function GenrePage() {
  const params = useParams();
  const genreId = params?.genreId as string;
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (!genreId) return;

    const fetchArtists = async () => {
      try {
        const res = await fetch(`/api/deezer/genre/${genreId}/artists`);
        const data = await res.json();
        setArtists(data.data || []);
      } catch (err) {
        console.error('Error fetching artists:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, [genreId]);

  if (isLoading) return <p className="text-white text-center mt-10">{t('loadingArtists')}</p>;

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('artistsTitle')}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {artists.map((artist) => (
            <Link
              href={`/artist/${artist.id}/albums`}
              key={artist.id}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            >
              <img
                src={artist.picture_medium}
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
              <span className="text-center font-semibold">{artist.name}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}