import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL,
    BREVO_FROM_NAME: process.env.BREVO_FROM_NAME
  })
}

