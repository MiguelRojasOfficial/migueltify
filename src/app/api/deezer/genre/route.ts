import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://api.deezer.com/genre')
    if (!res.ok) throw new Error('Error al obtener géneros de Deezer')

    const data = await res.json()
    const filtered = data.data.filter((g: any) => g.name.toLowerCase() !== 'reggaetón')

    return NextResponse.json({ data: filtered })
  } catch (err) {
    return NextResponse.json({ data: [], error: (err as Error).message })
  }
}
