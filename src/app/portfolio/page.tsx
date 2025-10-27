'use client'

import Link from 'next/link'
import { useTranslation } from '@/context/TranslationContext'
import { Github, Linkedin, Mail } from 'lucide-react'
import { SiVercel } from 'react-icons/si'

const projects = [
{
    id: 1,
    name: 'Miguelflix',
    img: '/images/miguelflix.png',
    description: 'Next + React + Typescript + Tailwind + CSS + API de Contentful',
    href: 'https://tu-proyecto-en-vercel.vercel.app'
  },
  {
    id: 2,
    name: 'Miguel TV',
    img: '/images/migueltv.png',
    description: 'Next + React + Typescript + Tailwind + CSS + API  de TMDb',
    href: 'https://tu-proyecto-en-vercel.vercel.app'
  },
  {
    id: 3,
    name: 'MiguelStore',
    img: '/images/miguelstore.png',
    description: 'Next + React + Typescript + Tailwind + CSS',
    href: 'https://netflix-clon.vercel.app'
  },
  {
    id: 4,
    name: 'Miguel CRM',
    img: '/images/miguelcrm.png',
    description: 'Next + React + Typescript + Tailwind + CSS',
    href: 'https://netflix-clon.vercel.app'
  },
  {
    id: 5,
    name: 'Airport',
    img: '/images/airplane.png',
    description: 'React + Three.js + @react-three/fiber + CSS',
    href: 'https://miguelrojasoficial.onrender.com'
  }
]

const socialLinks = [
  { id: 1, name: "GitHub", icon: <Github className="h-6 w-6" />, url:"https://github.com/MiguelRojasOfficial", text: "@MiguelRojasOfficial" },
  { id: 2, name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, url:"https://linkedin.com/in/miguelrojasoficial", text: "@miguelrojasoficial" },
  { id: 3, name: "Render", icon: (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M26.827.01c-4.596-.216-8.461 3.107-9.12 7.487-.027.203-.066.4-.099.596-1.025 5.454-5.797 9.584-11.53 9.584a11.67 11.67 0 0 1-5.634-1.442.298.298 0 0 0-.444.262v18.854h17.602V22.097c0-2.439 1.971-4.419 4.4-4.419h4.4c4.982 0 8.99-4.15 8.795-9.197C35.02 3.937 31.35.226 26.827.01Z"/>
      </svg>
    ), 
    url: "https://miguelrojasoficial.onrender.com", text: "@miguelrojasofficial" },
  { id: 4, name: "Correo", icon: <Mail className="h-6 w-6" />, url:"https://mail.google.com/mail/?view=cm&fs=1&to=miguelrojasy3@gmail.com", text: "miguelrojasy3@gmail.com" },
]

export default function PortfolioPage() {
  const { t } = useTranslation()

  return (
    <div className="p-6 pb-32 sm:pb-6 min-h-screen bg-neutral-900 text-white">
      <h1 className="text-center text-3xl font-bold mb-6">{t('myProjects')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
           <a
            key={project.id}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <img
              src={project.img}
              alt={project.name}
              className="w-full h-auto object-cover rounded-t-lg bg-gray-800"
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              <p className="text-sm text-zinc-400 mb-4 flex-1">{project.description}</p>
              <span className="text-xs text-end text-zinc-400">{t('clickToGoToProject')}</span>
            </div>
          </a>
        ))}

        <div className="bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col overflow-hidden p-6 md:p-10">
          <h2 className="text-lg font-semibold text-center md:mt-8 mb-6">Conecta conmigo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map(item => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition w-full"
              >
                <div className="text-green-500">{item.icon}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-zinc-300">{item.text}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}