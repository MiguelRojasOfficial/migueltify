# Migueltify - Plataforma de Música

Migueltify es una plataforma de música tipo streaming, desarrollada con Next.js 13, React y Tailwind CSS (sin Bootstrap), que consume datos de la API de Deezer. Permite explorar géneros, artistas, álbumes, playlists y estaciones de radio, además de reproducir canciones y gestionar una biblioteca de música personalizada.

## Características principales

- Explorar géneros y artistas populares.
- Visualizar álbumes y canciones de artistas.
- Reproducción de canciones y playlists directamente desde Deezer.
- Gestión de biblioteca: agregar canciones y álbumes a tu colección personal.
- Like/Unlike canciones y álbumes.
- Interfaz completamente responsiva para dispositivos móviles y escritorio.
- Soporte de múltiples idiomas (traducciones mediante TranslationContext).
- Temas claros y oscuros mediante ThemeContext.
- Integración con API de estaciones de radio usando RadioBrowser.
- Notificaciones por email con Brevo.

## Tecnologías utilizadas

- Next.js 13 (app/ y pages/)
- React 18 con Hooks (useState, useEffect)
- TypeScript para tipado estático
- Tailwind CSS para estilos modernos y responsivos
- Lucide Icons para iconografía (Play, Heart, Plus, etc.)
- Deezer API para música, artistas y géneros
- RadioBrowser API para estaciones de radio
- Brevo API para envío de emails
- Next.js Server Actions y API Routes para consumir datos de Deezer

## Instalación

1. Clonar el repositorio:  
   `git clone https://github.com/MiguelRojasOfficial/miguelflix.git`  
   `cd miguelflix`

2. Instalar dependencias:  
   `npm install`

3. Configurar variables de entorno (.env.local):  
   NEXT_PUBLIC_DEEZER_API_KEY=tu_api_key  
   BREVO_API_KEY=tu_api_key_brevo  
   BREVO_FROM_EMAIL=tu_email  
   BREVO_FROM_NAME=TuNombre

4. Ejecutar en desarrollo:  
   `npm run dev`

5. Acceder a http://localhost:3000

## Uso

- Navega a /explore para ver géneros.  
- Selecciona un género para ver sus artistas.  
- Selecciona un artista para ver sus álbumes y canciones.  
- Reproduce canciones directamente o agrega a tu biblioteca.  
- Accede a playlists predefinidas desde /playlist?id=<playlistId>.

## Funcionalidades adicionales

- Carrusel de artistas similares en la página de álbum.  
- Reproducción de audio vía proxy para evitar problemas de CORS.  
- Gestión de favoritos y biblioteca con iconos dinámicos.  
- Compatibilidad con dispositivos móviles usando grids y flex responsive.

## Contribución

- Hacer un fork del repositorio.  
- Crear una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`  
- Hacer commit de tus cambios: `git commit -m "Descripción del cambio"`  
- Push a tu rama: `git push origin feature/nueva-funcionalidad`  
- Crear un Pull Request.

## Licencia

MIT License © Miguel Rojas
