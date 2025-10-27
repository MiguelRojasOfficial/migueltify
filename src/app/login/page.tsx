'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ClientSplash from '@/components/ClientSplash'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('Por favor ingrese su nombre de usuario')
      return
    }
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('username', username)
      router.push('/')
  }

  const loginForm = (
    <div className="bg-zinc-900 text-zinc-50 flex items-center justify-center min-h-screen">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              required
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa la contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#1DB954] text-black font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )

  return <ClientSplash>{loginForm}</ClientSplash>
}
