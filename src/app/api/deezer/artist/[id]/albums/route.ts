import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`https://api.deezer.com/artist/${params.id}/albums`);
    const data = await res.json();
    
    return NextResponse.json(data.data || []);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}