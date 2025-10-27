'use client'

import React from 'react'
import Image from 'next/image'

export type Artist = {
  id: number | string
  name: string
  photo?: string
}

type ArtistCardProps = {
  artist: Artist
  onClick?: (artist: Artist) => void
  size?: number
}

export function ArtistCard({ artist, onClick, size = 208 }: ArtistCardProps) {
  const src = artist.photo ?? '/placeholder.png'

  return (
    <div
      onClick={() => onClick?.(artist)}
      className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? onClick?.(artist) : undefined)}
    >
      <div className={`w-[${size}px] h-[${size}px] sm:w-[${size + 32}px] sm:h-[${size + 32}px] rounded-full overflow-hidden shadow-lg`}>
        <Image
          src={src}
          alt={artist.name}
          width={size}
          height={size}
          className="rounded-full object-cover"
        />
      </div>

      <p className="mt-2 font-semibold text-white text-sm md:text-base truncate w-32">
        {artist.name}
      </p>
    </div>
  )
}

export default ArtistCard
