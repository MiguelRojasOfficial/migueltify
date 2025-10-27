import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    const data = await res.json()

    console.log("Respuesta de la API de prueba:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al probar la API:", error)
    return NextResponse.json({ error: "Fallo en la prueba de API" }, { status: 500 })
  }
}