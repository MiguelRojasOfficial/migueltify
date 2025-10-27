'use client'

import Image from 'next/image'

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
  return (
    <div
      onClick={() => onClick?.(genre)}
      className="cursor-pointer flex flex-col items-center text-center rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform bg-zinc-900"
    >
      <Image
        src={genre.image}
        alt={genre.name}
        width={160}
        height={160}
        className="object-cover w-full h-40"
      />
      <p className="mt-2 font-bold text-white">{genre.name}</p>
    </div>
  )
}
