'use client'

import { useState, useEffect } from 'react'
import { ExploreGenres } from '@/components/Explore/ExploreGenres'
import { Genre } from '@/components/GenreCard'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/context/TranslationContext'

export default function ExplorePage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch('/api/deezer/genre')
        const data = await res.json()

        console.log(data)
        if (!data.data) {
          console.error('Formato inesperado:', data)
          setIsLoading(false)
          return
        }

        const filtered = data.data
          .map((g: any) => ({
            id: g.id,
            name: g.name,
            image: g.picture_xl || g.picture_big || g.picture_medium || g.picture_small || g.picture,
          }))

        setGenres(filtered)
        setIsLoading(false)
      } catch (err) {
        console.error(err)
        setIsLoading(false)
      }
    }

    fetchGenres()
  }, [])

  const handleGenreClick = (genre: Genre) => {
    router.push(`/explore/${genre.id}`)
  }

  if (isLoading) return <p className="text-white text-center mt-10">{t('loadingGenres')}</p>

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('exploreGenres')}</h1>
        <ExploreGenres genres={genres} onGenreClick={handleGenreClick} />
      </main>
    </div>
  )
}