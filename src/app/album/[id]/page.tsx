'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Play, Heart, Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useMusicPlayer, Track } from '@/context/MusicPlayerContext'
import { useTranslation } from '@/context/TranslationContext'

interface AlbumData {
  id: number
  title: string
  cover_xl: string
  cover_medium: string
  artist: { id: number; name: string }
  release_date: string
  tracks: { data: any[] }
}

interface DiscographyAlbum {
  id: number
  title: string
  cover_medium: string
}

interface SimilarArtist {
  id: number
  name: string
  picture_medium: string
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
  return `${minutes}:${formattedSeconds}`
}

export default function AlbumPage() {
  const { id } = useParams()
  const {
    setCurrentSong,
    setPlaylist,
    play,
    myLibrary,
    addToLibrary,
    removeFromLibrary,
    likedSongs,
    likedAlbums,
    toggleLikeSong,
    toggleLikeAlbum,
  } = useMusicPlayer()

  const { t } = useTranslation()
  const [album, setAlbum] = useState<AlbumData | null>(null)
  const [tracks, setTracks] = useState<any[]>([])
  const [discography, setDiscography] = useState<DiscographyAlbum[]>([])
  const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([])
  const [loading, setLoading] = useState(true)
  const [artistsCarouselIndex, setArtistsCarouselIndex] = useState(0)

  const isTrackLiked = (trackId: number) =>
    likedSongs?.some(track => track.id === trackId) ?? false

  const isTrackInLibrary = (trackId: number) =>
    myLibrary?.some(track => track.id === trackId) ?? false

  const isAlbumInLibrary = (): boolean => {
    if (!album || !album.tracks || !album.tracks.data) return false
    return album.tracks.data.every((track: any) => isTrackInLibrary(track.id))
  }

  useEffect(() => {
    if (!id) return
    async function fetchData() {
      setLoading(true)
      try {
        const albumRes = await fetch(`/api/deezer/album/${id}`)
        const albumData = await albumRes.json()

        setAlbum(albumData)
        setTracks(albumData.tracks?.data || [])

        if (albumData.artist && albumData.artist.id) {
          const [discographyRes, similarArtistsRes] = await Promise.all([
            fetch(`/api/deezer/artist/${albumData.artist.id}/albums`),
            fetch(`/api/deezer/artist/${albumData.artist.id}/related`),
          ])

          const discographyData = await discographyRes.json()
          const similarArtistsData = await similarArtistsRes.json()

          setDiscography(discographyData.data || [])
          setSimilarArtists(similarArtistsData.data || [])
        }
      } catch (error) {
        console.error('Error al obtener datos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleAddAlbumToLibrary = () => {
    if (!album || !album.tracks) return
    const albumTracks = album.tracks.data.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      preview: track.preview,
      album: {
        title: album.title,
        cover_medium: album.cover_medium,
        id: album.id,
      },
      duration: track.duration,
    }))

    if (isAlbumInLibrary()) {
      albumTracks.forEach(track => removeFromLibrary(track.id))
    } else {
      albumTracks.forEach(track => addToLibrary(track))
    }
  }

  const playAlbum = () => {
    if (!album || !tracks.length) return
    const playlistTracks: Track[] = tracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      preview: track.preview,
      album: {
        title: album.title,
        cover_medium: album.cover_medium,
        id: album.id,
      },
      duration: track.duration,
    }))
    setPlaylist(playlistTracks)
    setCurrentSong(playlistTracks[0])
    play()
  }

  const playSong = (track: any) => {
    if (!album) return
    const songData: Track = {
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      preview: track.preview,
      album: {
        title: album.title,
        cover_medium: album.cover_medium,
        id: album.id,
      },
      duration: track.duration,
    }
    setCurrentSong(songData)
    setPlaylist(tracks.map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist.name,
      preview: t.preview,
      album: {
        title: album.title,
        cover_medium: album.cover_medium,
        id: album.id,
      },
      duration: t.duration,
    })))
    play()
  }

  const handleAddSong = (track: any) => {
    if (!album) return
    const songData: Track = {
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      preview: track.preview,
      album: {
        title: album.title,
        cover_medium: album.cover_medium,
        id: album.id,
      },
      duration: track.duration,
    }

    if (isTrackInLibrary(track.id)) {
      removeFromLibrary(track.id)
    } else {
      addToLibrary(songData)
    }
  }

  const handleNextArtist = () => {
    setArtistsCarouselIndex(prev => (prev + 6) % similarArtists.length)
  }

  const handlePrevArtist = () => {
    setArtistsCarouselIndex(prev => (prev - 6 + similarArtists.length) % similarArtists.length)
  }

  if (loading) return <p className="text-center mt-10">{t('loadingAlbum')}</p>
  if (!album) return <p className="text-center mt-10">{t('albumNotFound')}</p>

  const isAlbumLiked = likedAlbums ? likedAlbums.has(Number(id)) : false
  const albumInLibrary = isAlbumInLibrary()

  const displayedArtists = similarArtists.slice(artistsCarouselIndex, artistsCarouselIndex + 6)
  if (displayedArtists.length < 6 && similarArtists.length > 6) {
    const remaining = 6 - displayedArtists.length
    displayedArtists.push(...similarArtists.slice(0, remaining))
  }

  return (
    <div className="bg-zinc-900 text-zinc-50 min-h-screen p-6">
      {album?.artist ? (
        <div className="flex items-end gap-6 mb-8">
          <img src={album.cover_xl} alt={album.title} className="w-48 h-48 rounded" />
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-400">{t('albumTitle')}</span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold break-words">{album.title}</h1>
            <p className="text-zinc-400 text-sm">
              {album.artist.name} • {album.release_date.slice(0, 4)} • {tracks.length} {t('songs')}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center mt-10">{t('loadingAlbum')}</p>
      )}

      <div className="flex items-center gap-4 mb-8 relative">
        <button
          className="w-12 h-12 rounded-full bg-green-400 text-black flex items-center justify-center hover:scale-105 transition-transform"
          onClick={playAlbum}
        >
          <Play fill="black" />
        </button>
        <button
          className="text-zinc-400 hover:text-green-500 transition"
          onClick={() => toggleLikeAlbum(Number(id))}
        >
          <Heart
            size={28}
            fill={isAlbumLiked ? '#24c55e' : 'none'}
            color={isAlbumLiked ? '#24c55e' : 'currentColor'}
          />
        </button>
        <button
          className="text-zinc-400 hover:text-green-500 transition relative"
          onClick={handleAddAlbumToLibrary}
        >
          {albumInLibrary ? <Check size={28} color="#24c55e" /> : <Plus size={28} />}
        </button>
      </div>

      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b border-zinc-700 text-zinc-400 text-sm">
            <th className="py-2 w-12">#</th>
            <th className="py-2">{t('title')}</th>
            <th className="py-2 w-20 text-center">{t('actions')}</th>
            <th className="py-2 w-16 text-right">{t('duration')}</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => {
            const trackInLibrary = isTrackInLibrary(track.id)
            const liked = isTrackLiked(track.id)
            const fullTrackData = {
              ...track,
              artist: track.artist.name,
              album: {
                title: album.title,
                cover_medium: album.cover_medium,
                id: album.id,
              },
            }
            return (
              <tr
                key={track.id}
                className="border-b border-zinc-800 text-sm text-zinc-200 hover:bg-zinc-800/50 transition-colors"
              >
                <td className="py-2 cursor-pointer" onClick={() => playSong(fullTrackData)}>
                  {index + 1}
                </td>
                <td className="py-2 cursor-pointer" onClick={() => playSong(fullTrackData)}>
                  {track.title}
                </td>
                <td className="py-2 flex justify-center gap-3">
                  <button onClick={() => toggleLikeSong(fullTrackData)} className="transition">
                    <Heart
                      size={16}
                      fill={liked ? '#24c55e' : 'none'}
                      color={liked ? '#24c55e' : 'currentColor'}
                    />
                  </button>
                  <button onClick={() => handleAddSong(fullTrackData)} className="transition">
                    {trackInLibrary ? <Check size={16} color="#24c55e" /> : <Plus size={16} />}
                  </button>
                </td>
                <td className="py-2 text-zinc-400 text-right">
                  {formatDuration(track.preview ? 30 : 0)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t('discography')}</h2>
          {album.artist && (
            <a
              href={`/artist/${album.artist.id}/albums`}
              className="text-sm text-zinc-400 hover:underline"
            >
              {t('viewAll')}
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {discography.slice(0, 6).map(disc => (
            <a
              key={disc.id}
              href={`/album/${disc.id}`}
              className="flex flex-col items-center text-center"
            >
              <img src={disc.cover_medium} alt={disc.title} className="w-full rounded shadow-lg mb-2" />
              <p className="text-sm font-semibold">{disc.title}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t('similarArtistsTitle')}</h2>
          <div className="flex gap-2">
            <button onClick={handlePrevArtist} className="text-zinc-400 hover:text-white transition">
              <ChevronLeft />
            </button>
            <button onClick={handleNextArtist} className="text-zinc-400 hover:text-white transition">
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedArtists.map(artist => (
            <a
              key={artist.id}
              href={`/artist/${artist.id}`}
              className="flex flex-col items-center text-center"
            >
              <img
                src={artist.picture_medium}
                alt={artist.name}
                className="w-full rounded-full shadow-lg mb-2"
              />
              <p className="text-sm font-semibold">{artist.name}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
