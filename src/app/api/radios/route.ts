import { NextResponse } from 'next/server'

interface Station {
  stationuuid: string
  name: string
  favicon: string | null
  url_resolved: string
}

export async function GET() {
const RADIOBROWSER_API_URL = 'https://us1.api.radio-browser.info/json/stations/search?limit=15&language=spanish&hidebroken=true';  try {
    const response = await fetch(RADIOBROWSER_API_URL, {
      headers: {
        'User-Agent': 'TuAppDeMusica/1.0'
      }
    })
    
    if (!response.ok) {
      console.error(`Error al contactar con RadioBrowser: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: `Error de la API: ${response.status}` }, { status: response.status })
    }
    
    const data: Station[] = await response.json()

    if (!Array.isArray(data)) {
      console.error("La respuesta de la API no es un array:", data)
      return NextResponse.json({ error: 'Formato de datos incorrecto de la API' }, { status: 500 })
    }

    const radios = data.map((station) => ({
      id: station.stationuuid,
      title: station.name,
      picture_medium: station.favicon || '/placeholder.png',
      stream: station.url_resolved,
    }))

    return NextResponse.json({ data: radios })

  } catch (error) {
    console.error('Error interno del servidor en la API de radios:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}