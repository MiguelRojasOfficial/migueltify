'use client'

import { useEffect, useState } from "react"
import { useTheme } from "@/context/ThemeContext"
import { useMusicPlayer, Track } from '@/context/MusicPlayerContext'
import { useTranslation } from '@/context/TranslationContext'

interface Radio {
  id: string
  title: string
  picture_medium: string
  stream: string
}

const verifiedRadios = [
  { id: "franceinter", titleKey: "franceInterTitle", picture_medium: "https://flagcdn.com/w320/fr.png", stream: "https://icecast.radiofrance.fr/franceinter-midfi.mp3" },
  { id: "cadenaser", titleKey: "cadenaSerTitle", picture_medium: "https://flagcdn.com/w320/es.png", stream: "https://playerservices.streamtheworld.com/api/livestream-redirect/CADENASER.mp3" },
  { id: "rspradio", titleKey: "rspRadioTitle", picture_medium: "https://flagcdn.com/w320/ch.png", stream: "https://stream.srg-ssr.ch/m/rsp/mp3_128" },
  { id: "radio1", titleKey: "radio1Title", picture_medium: "https://flagcdn.com/w320/nl.png", stream: "https://icecast.omroep.nl/radio1-bb-mp3" },
]

export default function RadioPage() {
  const [radios, setRadios] = useState<Radio[]>([])
  const { setCurrentSong, setPlaylist, play } = useMusicPlayer()
  const { theme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    const translatedRadios = verifiedRadios.map(radio => ({
      ...radio,
      title: t(radio.titleKey)
    }))
    setRadios(translatedRadios)
  }, [t])

  const handleRadioClick = (radio: Radio) => {
    const radioTracks: Track[] = radios.map(r => ({
      id: r.id,
      title: r.title,
      artist: t("liveRadio"),
      preview: r.stream,
      album: {
        title: r.title,
        cover_medium: r.picture_medium,
        id: r.id,
      },
      duration: Infinity,
    }))

    const currentIndex = radioTracks.findIndex(r => r.id === radio.id)
    setPlaylist(radioTracks)
    setCurrentSong(radioTracks[currentIndex])
    play()
  }

  return (
    <div className={`flex flex-col h-screen ${theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-black"}`}>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto pt-6">
          <h1 className="text-center text-3xl font-bold mb-6">{t("radioTitle")}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {radios.map((radio) => (
              <div
                key={radio.id}
                className="bg-zinc-800/50 hover:bg-zinc-700 rounded-lg flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleRadioClick(radio)}
              >
                <img
                  src={radio.picture_medium}
                  alt={radio.title}
                  className="w-full aspect-square object-cover rounded-t"
                />
                <span className="font-semibold text-center p-2">{radio.title}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}