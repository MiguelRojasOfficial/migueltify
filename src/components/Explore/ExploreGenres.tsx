'use client'

import { GenreCard, Genre } from './GenreCard'
import { useTranslation } from '@/context/TranslationContext'

type ExploreGenresProps = {
  genres: Genre[]
  onGenreClick?: (genre: Genre) => void
}

export function ExploreGenres({ genres, onGenreClick }: ExploreGenresProps) {
  const { t } = useTranslation()
  if (!genres || genres.length === 0) return <p className="text-white text-center">{t('noGenres')}</p>

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8 justify-center">
      {genres.map((genre) => (
        <GenreCard key={genre.id} genre={genre} onClick={() => onGenreClick?.(genre)} />
      ))}
    </div>
  )
}