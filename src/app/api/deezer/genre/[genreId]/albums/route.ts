import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { genreId: string } }) {
  try {
    const res = await fetch(`https://api.deezer.com/genre/${params.genreId}/albums`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching albums' }, { status: 500 })
  }
}