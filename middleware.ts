import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_FILE = /\.(.*)$/ // evita afectar imágenes, css, js, etc.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // No aplicar a archivos estáticos, API o _next
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || PUBLIC_FILE.test(pathname)) {
    return
  }

  // Si ya hay idioma en la URL, no hacemos nada
  const hasLang = /^\/(es|en|fr|zh|zu)(\/|$)/.test(pathname)
  if (hasLang) return

  const supported = ["es","en","fr","zh","zu"]

  // 1️⃣ Revisar cookie (idioma elegido previamente)
  const cookieLang = req.cookies.get("NEXT_LOCALE")?.value
  if (cookieLang && supported.includes(cookieLang)) {
    return NextResponse.redirect(new URL(`/${cookieLang}${pathname}`, req.url))
  }

  // 2️⃣ Detectar idioma del navegador si no hay cookie
  const acceptLang = req.headers.get("accept-language") || ""
  const preferred = acceptLang.split(",")[0].split("-")[0] // ej: "en-US" → "en"
  const lang = supported.includes(preferred) ? preferred : "es"

  // Redirigir a /lang + path
  return NextResponse.redirect(new URL(`/${lang}${pathname}`, req.url))
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // aplica a todo excepto archivos, API y _next
}
