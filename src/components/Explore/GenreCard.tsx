'use client'

import Image from 'next/image'
import { useTranslation } from '@/context/TranslationContext'

export type Genre = {
  id: number
  name: string
  image: string
}

type GenreCardProps = {
  genre: Genre
  onClick?: (genre: Genre) => void
}

export function GenreCard({ genre, onClick }: GenreCardProps) {
  const { tGenre } = useTranslation()

  if (!genre.image) return null

  return (
    <div
      onClick={() => onClick?.(genre)}
      className="cursor-pointer flex flex-col items-center text-center rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform bg-zinc-900"
    >
      <div className="relative w-40 h-40">
        <Image
          src={genre.image}
          alt={tGenre(genre.name)}
          fill
          className="object-cover rounded"
          unoptimized
        />
      </div>
      <p className="mt-2 font-bold text-white">{tGenre(genre.name)}</p>
    </div>
  )
}