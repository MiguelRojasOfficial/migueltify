'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { useMusicPlayer, Track } from '@/context/MusicPlayerContext'
import { useTranslation } from '@/context/TranslationContext'

interface Album {
  id: number
  title: string
  cover_big: string
  cover_medium: string
  cover_xl: string
}

export default function ArtistAlbumsPage() {
  const { id } = useParams()
  const [albums, setAlbums] = useState<Album[]>([])
  const [artistName, setArtistName] = useState('')
  const [artistImage, setArtistImage] = useState('')
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const { setCurrentSong, setPlaylist } = useMusicPlayer()

  useEffect(() => {
    if (!id) return

    async function fetchData() {
      try {
        const artistRes = await fetch(`/api/deezer/artist/${id}`)
        const artistData = await artistRes.json()
        setArtistName(artistData.name)
        setArtistImage(artistData.picture_xl || artistData.picture_big)

        const albumsRes = await fetch(`/api/deezer/artist/${id}/albums`)
        const albumsData = await albumsRes.json()

        const validAlbums = (albumsData.data || []).filter(
          (album: any) => album.id && album.cover_big
        )

        setAlbums(validAlbums)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const playAlbum = async (albumId: number, albumTitle: string, albumCover: string) => {
    try {
      const res = await fetch(`/api/deezer/album/${albumId}`)
      const data = await res.json()
      const albumTracks = (data.tracks?.data || []).map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: artistName,
        preview: track.preview || '',
        duration: track.duration || 30,
        album: {
          title: albumTitle,
          cover_medium: albumCover,
          id: albumId,
        },
      }))

      if (albumTracks.length > 0) {
        setPlaylist(albumTracks)
        setCurrentSong(albumTracks[0])
      }
    } catch (error) {
      console.error(`Error al obtener canciones del álbum ${albumId}:`, error)
    }
  }

  if (loading) return <p className="text-center mt-10">{t('loadingAlbums')}</p>

  return (
    <div className="p-6">
      {artistImage && (
        <div className="mb-6 relative w-full h-64">
          <Image
            src={artistImage}
            alt={artistName}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 text-center">{artistName}</h1>

      {albums.length === 0 ? (
        <p className="text-center">{t('noAlbumsArtist')}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {albums.map(album => (
            <div
              key={album.id}
              className="relative group rounded overflow-hidden bg-neutral-900/40 hover:bg-neutral-800/60 transition-all p-2"
            >
              <div className="relative">
                <img
                  src={album.cover_big}
                  alt={album.title}
                  className="w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity space-y-2">
                  <button
                    onClick={() => playAlbum(album.id, album.title, album.cover_medium)}
                    className="bg-green-400 text-black rounded-full p-2 sm:p-3 hover:scale-105 transition-transform"
                    title="Reproducir álbum"
                  >
                    <Play fill="black" />
                  </button>

                  <Link
                    href={`/album/${album.id}`}
                    className="px-3 py-1 text-xs sm:px-4 sm:py-1.5 bg-white/90 text-black rounded-full font-semibold hover:bg-white transition"
                  >
                    Ver álbum completo
                  </Link>
                </div>
              </div>

              <p className="mt-3 text-sm font-semibold text-center">{album.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
