'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArtistCard } from '@/components/ArtistCard'
import { AlbumCard, Album } from '@/components/AlbumCard'
import { HorizontalSection } from '@/components/HorizontalSection'
import { Search } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTheme } from '@/context/ThemeContext'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { useTranslation } from '@/context/TranslationContext'

type Artist = {
  id: number
  name: string
  photo: string
}

const eliminarDuplicados = (array: any[]) => {
  const idsVistos = new Set();
  return array.filter(item => {
    const id = typeof item.id === 'string' ? item.id : item.id.toString();
    if (idsVistos.has(id)) {
      return false;
    } else {
      idsVistos.add(id);
      return true;
    }
  });
};

export default function Home() {
  const { currentSong, setCurrentSong, playlist, setPlaylist } = useMusicPlayer()
  const [recentlyPlayed, setRecentlyPlayed] = useLocalStorage<Album[]>('recentlyPlayed', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [popularAlbums, setPopularAlbums] = useState<Album[]>([])
  const [gospelArtists, setGospelArtists] = useState<Artist[]>([])
  const [artistPage, setArtistPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus !== 'true') router.push('/login')
    else setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  useEffect(() => {
    async function fetchData() {
      try {
        const resAlbums = await fetch('/api/deezer/search/album?q=genre:"gospel"')
        if (!resAlbums.ok) throw new Error('Error API Albums')
        const dataAlbums = await resAlbums.json()
        const uniqueAlbumsData = eliminarDuplicados(dataAlbums.data);

        const albums = await Promise.all(
          uniqueAlbumsData.map(async (album: any) => {
            const tracksRes = await fetch(`/api/deezer/album/${album.id}`)
            const tracksData = await tracksRes.json()
            const firstTrack = tracksData.tracks.data[0]
            return {
              id: album.id.toString(),
              title: album.title,
              artist: album.artist.name,
              imageSrc: album.cover_medium,
              preview: firstTrack?.preview || '',
              duration: 30,
            }
          })
        )
        setPopularAlbums(albums)
        setPlaylist(albums)

        const resArtists = await fetch('/api/deezer/search/artist?q=worship')
        if (!resArtists.ok) throw new Error('Error API Artists')
        const dataArtists = await resArtists.json()
        const uniqueArtistsData = eliminarDuplicados(dataArtists.data);

        const artists = uniqueArtistsData.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          photo: artist.picture_medium,
        }))
        setGospelArtists(artists)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setIsError(true)
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      const timeout = setTimeout(() => fetchData(), 1500)
      return () => clearTimeout(timeout)
    }
  }, [isAuthenticated, setPlaylist])

  const handleAlbumClick = (album: Album) => {
    const songData = {
      id: album.id,
      title: album.title,
      artist: album.artist,
      preview: album.preview,
      album: {
        title: album.title,
        cover_medium: album.imageSrc,
        id: album.id
      },
      duration: album.duration
    };

    setCurrentSong(songData);
    const updatedHistory = recentlyPlayed.filter((s) => s.id !== album.id);
    updatedHistory.unshift(album);
    if (updatedHistory.length > 5) updatedHistory.pop();
    setRecentlyPlayed(updatedHistory);
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    if (!currentSong || playlist.length === 0) return
    const index = playlist.findIndex((a) => a.id === currentSong.id)
    let newIndex = index
    if (direction === 'next') newIndex = (index + 1) % playlist.length
    if (direction === 'prev') newIndex = (index - 1 + playlist.length) % playlist.length
    setCurrentSong(playlist[newIndex])
  }

  const filteredAlbums = useMemo(() => {
    if (!debouncedSearchQuery) return popularAlbums
    const query = debouncedSearchQuery.toLowerCase()
    return popularAlbums.filter(
      (a) => a.title.toLowerCase().includes(query) || a.artist.toLowerCase().includes(query)
    )
  }, [debouncedSearchQuery, popularAlbums])

  const filteredArtists = useMemo(() => {
    if (!debouncedSearchQuery) return gospelArtists
    const query = debouncedSearchQuery.toLowerCase()
    return gospelArtists.filter((a) => a.name.toLowerCase().includes(query))
  }, [debouncedSearchQuery, gospelArtists])

  const latestSongs = useMemo(() => filteredAlbums.slice(0, 10), [filteredAlbums])
  const newReleases = useMemo(() => filteredAlbums.slice(-10), [filteredAlbums])
  const dailyMix = useMemo(() => filteredAlbums.sort(() => 0.5 - Math.random()).slice(0, 10), [filteredAlbums])

  const artistsPerPage = 6
  const startIndex = artistPage * artistsPerPage
  const currentArtists = filteredArtists.slice(startIndex, startIndex + artistsPerPage)

  const handleNextPage = () => {
    if ((artistPage + 1) * artistsPerPage < filteredArtists.length) {
      setArtistPage(artistPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (artistPage > 0) {
      setArtistPage(artistPage - 1)
    }
  }

  if (!isAuthenticated) return null
  if (isLoading)
    return (
      <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'} text-zinc-50`}>
        {t('loading')}
      </div>
    )
  if (isError)
    return (
      <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'} text-zinc-50`}>
        {t('loadingError')}
      </div>
    )

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-zinc-900 text-zinc-50' : 'bg-white text-black'}`}>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto space-y-8">
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full p-3 pl-10 rounded-md ${
                  theme === 'dark'
                    ? 'bg-zinc-800 text-zinc-50 placeholder-zinc-400'
                    : 'bg-zinc-200 text-black placeholder-zinc-500'
                } focus:outline-none focus:ring-2 focus:ring-green-400`}
              />
            </div>
          </div>

          <HorizontalSection title={t('latestSongs')}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {latestSongs.map((album) => (
                <AlbumCard key={album.id} album={album} onClick={handleAlbumClick} disableLink={true} />
              ))}
            </div>
          </HorizontalSection>

          <HorizontalSection title={t('newReleases')}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {newReleases.map((album) => (
                <AlbumCard key={album.id} album={album} onClick={handleAlbumClick} disableLink={true} />
              ))}
            </div>
          </HorizontalSection>

          <HorizontalSection title={t('gospelArtists')}>
            <div className="flex items-center gap-8">
              <button
                onClick={handlePrevPage}
                disabled={artistPage === 0}
                className="px-3 py-2 rounded bg-zinc-700 text-white disabled:opacity-50"
              >
                {t('prevButton')}
              </button>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10 flex-1">
                {currentArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} 
                  onClick={() => router.push(`/artist/${artist.id}?name=${encodeURIComponent(artist.name)}`)
                } />
                ))}
              </div>
              <button
                onClick={handleNextPage}
                disabled={(artistPage + 1) * artistsPerPage >= filteredArtists.length}
                className="px-3 py-2 rounded bg-zinc-700 text-white disabled:opacity-50"
              >
                {t('nextButton')}
              </button>
            </div>
          </HorizontalSection>

          <HorizontalSection title={t('dailyMix')}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {dailyMix.map((album) => (
                <AlbumCard key={album.id} album={album} onClick={handleAlbumClick} disableLink={true} />
              ))}
            </div>
          </HorizontalSection>

          <HorizontalSection title={t('recentlyPlayed')}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {recentlyPlayed.length > 0 ? (
                recentlyPlayed.map((album) => (
                  <AlbumCard key={album.id} album={album} onClick={handleAlbumClick} disableLink={true} />
                ))
              ) : (
                <p className="text-zinc-400">{t('noRecentSongs')}</p>
              )}
            </div>
          </HorizontalSection>

          <HorizontalSection title={t('popularAlbums')}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {filteredAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} onClick={handleAlbumClick} disableLink={true} />
              ))}
              {filteredAlbums.length === 0 && (
                <p className="text-zinc-400">{t('noResults')}</p>
              )}
            </div>
          </HorizontalSection>
        </main>
      </div>
    </div>
  )
}