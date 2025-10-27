'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import ProtectedRoute from '@/components/ProtectedRoute'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/context/ThemeContext'
import { MusicPlayerProvider, useMusicPlayer } from '@/context/MusicPlayerContext'
import ClientSplash from '@/components/ClientSplash'
import { Sidebar } from '@/components/Sidebar'
import { PlaybackControls } from '@/components/PlaybackControls'
import { TranslationProvider } from '@/context/TranslationContext'

const inter = Inter({ subsets: ['latin'] })

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { currentSong, playlist, isLoop, isShuffle, handleSkip, toggleLoop, toggleShuffle } = useMusicPlayer()
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <>
      {!isLoginPage && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}

      <main className={`flex-1 overflow-y-auto ${!isLoginPage ? 'pb-24' : ''}`}>
        <ThemeProvider>
          {!isSidebarOpen && !isLoginPage && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden fixed top-4 left-4 z-50 text-white bg-green-500 px-3 py-2 rounded"
            >
              ☰
            </button>
          )}
          {children}
        </ThemeProvider>
      </main>

      {!isLoginPage && currentSong && (
        <div className="fixed bottom-0 left-0 w-full z-50">
          <PlaybackControls
            currentSong={currentSong}
            playlist={playlist}
            onSkip={handleSkip}
            isLoop={isLoop}
            isShuffle={isShuffle}
            toggleLoop={toggleLoop}
            toggleShuffle={toggleShuffle}
          />
        </div>
      )}
    </>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <html lang="es">
      <body className={`flex ${inter.className}`}>
        <TranslationProvider>
          <MusicPlayerProvider>
            <ClientSplash>
              {isLoginPage ? (
                <AppContent>{children}</AppContent>
              ) : (
                <ProtectedRoute>
                  <AppContent>{children}</AppContent>
                </ProtectedRoute>
              )}
            </ClientSplash>
          </MusicPlayerProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}
