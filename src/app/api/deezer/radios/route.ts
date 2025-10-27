import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://api.deezer.com/radio')
    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ data: [] }, { status: 500 })
  }
}