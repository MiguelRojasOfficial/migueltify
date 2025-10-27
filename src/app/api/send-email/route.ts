import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY
  const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL
  const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME

  if (!BREVO_API_KEY) {
    return NextResponse.json({ success: false, error: 'No se encontró la API Key' })
  }

  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ success: false, error: 'Email no proporcionado' })

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key':  process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: BREVO_FROM_NAME, email: BREVO_FROM_EMAIL },
        to: [{ email }],
        subject: 'Bienvenido',
        htmlContent: `<p>Hola, bienvenido a nuestra plataforma!</p>`
      })
    })

    if (!res.ok) {
      const errorData = await res.json()
      return NextResponse.json({ success: false, error: errorData.message || 'Error en Brevo' })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Error desconocido' })
  }
}
