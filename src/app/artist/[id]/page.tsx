'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Play, Loader2 } from 'lucide-react'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { useTheme } from '@/context/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'

export default function ArtistPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { playPlaylist } = useMusicPlayer()
  const { theme } = useTheme()

  const [artistName, setArtistName] = useState('')
  const [artistImage, setArtistImage] = useState('')
  const [albums, setAlbums] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const artistRes = await fetch(`/api/deezer?url=https://api.deezer.com/artist/${id}`)
        const artistData = await artistRes.json()

        const albumsRes = await fetch(`/api/deezer?url=https://api.deezer.com/artist/${id}/albums`)
        const albumsData = await albumsRes.json()

        if (artistData?.name) {
          setArtistName(artistData.name)
          setArtistImage(artistData.picture_xl || artistData.picture_big || '')
        }

        if (albumsData?.data) {
          const unique = new Map()
          albumsData.data.forEach((a: any) => unique.set(a.id, a))
          setAlbums([...unique.values()])
        }
      } catch (error) {
        console.error('Error al cargar artista:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtistData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-zinc-500" />
      </div>
    )
  }

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
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
          <p className="text-center text-zinc-500">No hay álbumes disponibles.</p>
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
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/deezer?url=https://api.deezer.com/album/${album.id}`)
                          const data = await res.json()
                          if (data.tracks?.data?.length > 0) {
                            const playlist = data.tracks.data.map((track: any) => ({
                              id: track.id,
                              title: track.title,
                              artist: track.artist.name,
                              preview: track.preview,
                              album: { title: album.title, cover_medium: album.cover_medium, id: album.id },
                              duration: track.duration
                            }))
                            playPlaylist(playlist, 0)
                          }
                        } catch (error) {
                          console.error('Error al reproducir álbum:', error)
                        }
                      }}
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
    </div>
  )
}
