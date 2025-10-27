'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Home as HomeIcon, Search, Library, Plus, Radio, Settings, X } from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import { CreatePlaylistForm } from './CreatePlaylistForm'
import { useTranslation } from '@/context/TranslationContext'

export interface Playlist {
  id: string
  name: string
}

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('Usuario')
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([])
  const [activeSection, setActiveSection] = useState<string>('Inicio')
  const playlistContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadProfile = () => {
      const storedProfile = localStorage.getItem('profile')
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile)
        setUsername(parsed.username || 'Usuario')
      }
      const storedPic = localStorage.getItem('profilePic')
      if (storedPic) setProfilePic(storedPic)
    }
    loadProfile()
    window.addEventListener('storage', loadProfile)
    return () => window.removeEventListener('storage', loadProfile)
  }, [])

  useEffect(() => {
    const storedPlaylists = localStorage.getItem('userPlaylists')
    if (storedPlaylists) setUserPlaylists(JSON.parse(storedPlaylists))
  }, [])

  useEffect(() => {
    const container = playlistContainerRef.current
    if (!container) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      container.scrollTop += e.deltaY
    }
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  const handleCreatePlaylist = (name: string) => {
    const newPlaylist = { id: `custom-${Date.now()}`, name }
    const updatedPlaylists = [...userPlaylists, newPlaylist]
    setUserPlaylists(updatedPlaylists)
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists))
  }

  const menuItems = [
    { name: t('home'), icon: <HomeIcon size={20} />, href: '/' },
    { name: t('explore'), icon: <Search size={20} />, href: '/explore' },
    { name: t('radio'), icon: <Radio size={20} />, href: '/radio' },
    { name: t('library'), icon: <Library size={20} />, href: '/library' },
    { name: t('portfolio'), icon: <Plus size={20} />, href: '/portfolio' }
  ]

  return (
    <aside
      className={`bg-zinc-950 p-6 flex flex-col justify-between shadow-lg z-40 h-screen
      fixed top-0 left-0 w-72 transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 md:static`}
    >
      <button
        className="absolute top-4 right-4 md:hidden text-white"
        onClick={() => setIsOpen(false)}
      >
        <X size={24} />
      </button>

      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse-glow">
          <div className="w-3 h-3 bg-white rounded-full animate-ping-slow" />
        </div>
        <span className="font-extrabold text-2xl text-green-500 tracking-widest animate-fade-in">
          MIGUELTIFY
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {menuItems.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 p-2 mb-1 rounded-md text-sm font-semibold transition-all
              ${activeSection === item.name 
                ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)]' 
                : 'text-zinc-200 hover:bg-zinc-800 hover:text-white hover:shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`}
            onClick={() => {
              setActiveSection(item.name)
              setIsOpen(false)
            }}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}

        <div className="mt-6 pt-4 border-t border-zinc-800 max-h-64 overflow-y-auto pr-2" ref={playlistContainerRef}>
          <h2 className="text-zinc-400 uppercase text-xs mb-2">{t('playlists')}</h2>

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-green-500 mt-2 transition-all"
          >
            <Plus size={18} /> {t('createPlaylist')}
          </button>

          <div className="mt-2 flex flex-col gap-1">
            {userPlaylists.map(pl => (
              <button
                key={pl.id} 
                //href={`/playlist/${pl.id}?id=${pl.id}`} 
                className="text-left text-sm text-zinc-400 hover:text-green-500 hover:underline block transition-all"
                onClick={() => setIsOpen(false)}
              >
                {pl.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="pt-4 border-t border-zinc-800 flex items-center gap-3 group mb-[160px] md:mb-24">
        <img
          src={profilePic || '/user-image.jpg'}
          alt="Perfil"
          className="w-15 h-10 rounded-full object-cover border-2 border-green-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.7)] transition-shadow duration-300"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white group-hover:text-green-500 transition-colors">
            {username}
          </span>
          <Link
            href="/settings"
            className="text-xs text-zinc-400 hover:text-green-500 flex items-center gap-1 transition-colors"
          >
            <Settings size={12} /> {t('settings')}
          </Link>
        </div>
        <LogoutButton />
      </div>

      {isFormOpen && (
        <CreatePlaylistForm
          onPlaylistCreated={handleCreatePlaylist}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </aside>
  )
}