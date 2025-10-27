'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export interface Album {
  id: number;
  title: string;
  artist: string;
  cover?: string;
  cover_medium?: string;
  cover_big?: string;
}

interface AlbumCardProps {
  album: Album;
  onClick: (album: Album) => void;
  disableLink?: boolean;
}

export function AlbumCard({ album, onClick, disableLink }: AlbumCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const handleLike = () => setIsLiked(!isLiked);

  const cover =
    album.imageSrc && album.imageSrc.trim() !== ''
      ? album.imageSrc
      : '/placeholder.png';

  return (
    <div className="bg-zinc-800/50 hover:bg-zinc-800 rounded-md p-4 flex flex-col gap-2 group transition-colors relative">
      {disableLink ? (
        <Image
          src={cover}
          width={200}
          height={200}
          alt={`Portada de ${album.title}`}
          className="w-full h-auto rounded"
        />
      ) : (
        <Link href={`/album/${album.id}`} className="block">
          <Image
            src={cover}
            width={200}
            height={200}
            alt={`Portada de ${album.title}`}
            className="w-full h-auto rounded"
            unoptimized
          />
        </Link>
      )}

      <button
        onClick={() => onClick(album)}
        className="w-10 h-10 flex items-center justify-center pl-1 rounded-full bg-green-400 text-black md:invisible md:group-hover:visible transition-all duration-300 ease-in-out hover:scale-110 absolute bottom-3 right-3 md:bottom-8 md:right-8"
      >
        <Play />
      </button>

      <button
        onClick={handleLike}
        className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 invisible group-hover:visible transition-all duration-300 ease-in-out absolute top-4 right-4"
      >
      </button>

      <strong className="font-semibold">{album.title}</strong>
      <Link
        href={`/artist/${encodeURIComponent(album.artist)}?name=${encodeURIComponent(album.artist)}`}
        className="text-sm text-zinc-400 hover:text-white"
      >
        {album.artist}
      </Link>
    </div>
  );
}
