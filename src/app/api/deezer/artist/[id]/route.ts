import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const res = await fetch(`https://api.deezer.com/artist/${params.id}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Error fetching artist data' }, { status: 500 });
    }
}