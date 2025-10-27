import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { genreId: string } }) {
  const { genreId } = params
  const res = await fetch(`https://api.deezer.com/genre/${genreId}/artists`)
  const data = await res.json()
  return NextResponse.json(data)
}
