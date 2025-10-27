import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const albumRes = await fetch(`https://api.deezer.com/album/${id}`);
    if (!albumRes.ok) {
      throw new Error('Failed to fetch album data');
    }
    const albumData = await albumRes.json();
    return NextResponse.json(albumData);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch album data' }, { status: 500 });
  }
}