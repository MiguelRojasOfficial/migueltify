'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type SupportedLang = 'es' | 'en' | 'fr' | 'zh' | 'zu'

interface TranslationContextProps {
  lang: SupportedLang
  setLang: (lang: SupportedLang) => void
  t: (key: string) => string
  tGenre: (genreName: string) => string
}

const translations: Record<string, Record<string, string>> = {
  es: {
    home: 'Inicio', explore: 'Explorar', radio: 'Radio', library: 'Mi Biblioteca', portfolio: 'Mi Portafolio', playlists: 'Playlists', createPlaylist: 'Crear Playlist', settings: 'Configuración', logout: 'Cerrar Sesión', account: 'Cuenta', profile: 'Perfil', plan: 'Plan', premium: 'Premium', notifications: 'Notificaciones', email: 'Email', push: 'Push', language: 'Idioma', yourEmail: 'Tu correo', enterValidEmail: 'Ingresa un correo válido', send: 'Enviar', welcomeMessage: 'Mensaje de bienvenida enviado a', pushEnabled: 'Notificaciones push habilitadas', pushDisabled: 'Notificaciones push deshabilitadas', spanish: 'Español', english: 'Inglés', french: 'Francés', chinese: 'Chino', zulu: 'IsiZulu',
    editProfile: 'Editar Perfil', profilePhoto: 'Foto de perfil+', username: 'Usuario', birthdate: 'Fecha de nacimiento', gender: 'Género', select: 'Selecciona', save: 'Guardar',
    searchPlaceholder: 'Busca tus canciones y artistas favoritos',
    latestSongs: 'Últimas Canciones',
    newReleases: 'Nuevos Lanzamientos',
    gospelArtists: 'Artistas de Gospel',
    prevButton: '‹',
    nextButton: '›',
    dailyMix: 'Mix del Día',
    recentlyPlayed: 'Reproducido Recientemente',
    noRecentSongs: 'Las canciones que reproduzcas aparecerán aquí.',
    popularAlbums: 'Álbumes Populares',
    noResults: 'No se encontraron resultados.',
    loading: 'Cargando...',
    loadingError: 'Error al cargar datos.',
    loadingGenres: 'Cargando géneros...',
    exploreGenres: 'Explorar Géneros',
    noGenres: 'No hay géneros',
    loadingArtists: 'Cargando artistas...',
    artistsTitle: 'Artistas',
    loadingAlbums: 'Cargando álbumes...',
    errorLoadingAlbums: 'Error al cargar álbumes',
    noAlbumsAvailable: 'Este artista no tiene álbumes disponibles.',
    unknownArtist: 'Desconocido',
    unknownArtistName: 'Artista desconocido',
    yourLibrary: 'Tu Biblioteca',
    searchLibrary: 'Buscar en tu biblioteca',
    allSongs: 'Canciones',
    likedSongsTitle: 'Canciones Favoritas',
    likedAlbumsTitle: 'Álbumes Favoritos',
    noFavoriteAlbums: 'No tienes álbumes favoritos.',
    loadingAlbum: 'Cargando álbum...',
    albumNotFound: 'Álbum no encontrado.',
    albumTitle: 'ÁLBUM',
    songs: 'canciones',
    title: 'Título',
    actions: 'Acciones',
    duration: 'Duración',
    discography: 'Discografía',
    viewAll: 'Ver todo',
    similarArtistsTitle: 'Artistas similares',
    clickToGoToProject: 'Click para ir al proyecto',
    radioTitle: 'Radios',
    liveRadio: 'Radio en vivo',
    franceInterTitle: 'France Inter (Francia)',
    cadenaSerTitle: 'Cadena SER (España)',
    rspRadioTitle: 'RSP Radio (Suiza)',
    radio1Title: 'Radio 1 (Países Bajos)'
  },
  en: {
    home: 'Home', explore: 'Explore', radio: 'Radio', library: 'My Library', portfolio: 'My Portfolio', playlists: 'Playlists', createPlaylist: 'Create Playlist', settings: 'Settings', logout: 'Log Out', account: 'Account', profile: 'Profile', plan: 'Plan', premium: 'Premium', notifications: 'Notifications', email: 'Email', push: 'Push', language: 'Language', yourEmail: 'Your Email', enterValidEmail: 'Enter a valid email', send: 'Send', welcomeMessage: 'Welcome message sent to', pushEnabled: 'Push notifications enabled', pushDisabled: 'Push notifications disabled', spanish: 'Spanish', english: 'English', french: 'French', chinese: 'Chinese', zulu: 'Zulu',
    editProfile: 'Edit Profile', profilePhoto: 'Profile Photo+', username: 'Username', birthdate: 'Date of Birth', gender: 'Gender', select: 'Select', save: 'Save',
    searchPlaceholder: 'Search for your favorite songs and artists',
    latestSongs: 'Latest Songs',
    newReleases: 'New Releases',
    gospelArtists: 'Gospel Artists',
    prevButton: '‹',
    nextButton: '›',
    dailyMix: 'Daily Mix',
    recentlyPlayed: 'Recently Played',
    noRecentSongs: 'Songs you play will appear here.',
    popularAlbums: 'Popular Albums',
    noResults: 'No results found.',
    loading: 'Loading...',
    loadingError: 'Error loading data.',
    loadingGenres: 'Loading genres...',
    exploreGenres: 'Explore Genres',
    noGenres: 'No genres found',
    loadingArtists: 'Loading artists...',
    artistsTitle: 'Artists',
    loadingAlbums: 'Loading albums...',
    errorLoadingAlbums: 'Error loading albums',
    noAlbumsAvailable: 'This artist has no albums available.',
    unknownArtist: 'Unknown',
    unknownArtistName: 'Unknown artist',
    yourLibrary: 'Your Library',
    searchLibrary: 'Search your library',
    allSongs: 'Songs',
    likedSongsTitle: 'Liked Songs',
    likedAlbumsTitle: 'Liked Albums',
    noFavoriteAlbums: 'You have no favorite albums.',
    loadingAlbum: 'Loading album...',
    albumNotFound: 'Album not found.',
    albumTitle: 'ALBUM',
    songs: 'songs',
    title: 'Title',
    actions: 'Actions',
    duration: 'Duration',
    discography: 'Discography',
    viewAll: 'View all',
    similarArtistsTitle: 'Similar artists',
    clickToGoToProject: 'Click to go to the project',
    radioTitle: 'Radios',
    liveRadio: 'Live Radio',
    franceInterTitle: 'France Inter (France)',
    cadenaSerTitle: 'Cadena SER (Spain)',
    rspRadioTitle: 'RSP Radio (Switzerland)',
    radio1Title: 'Radio 1 (Netherlands)'
  },
  fr: {
    home: 'Accueil', explore: 'Explorer', radio: 'Radio', library: 'Ma Bibliothèque', portfolio: 'Mon Portfolio', playlists: 'Playlists', createPlaylist: 'Créer Playlist', settings: 'Paramètres', logout: 'Déconnexion', account: 'Compte', profile: 'Profil', plan: 'Plan', premium: 'Premium', notifications: 'Notifications', email: 'Email', push: 'Push', language: 'Langue', yourEmail: 'Votre Email', enterValidEmail: 'Entrez un email valide', send: 'Envoyer', welcomeMessage: 'Message de bienvenue envoyé à', pushEnabled: 'Notifications push activées', pushDisabled: 'Notifications push désactivées', spanish: 'Espagnol', english: 'Anglais', french: 'Français', chinese: 'Chinois', zulu: 'Zoulou',
    editProfile: 'Modifier le profil', profilePhoto: 'Photo de profil+', username: 'Nom d’utilisateur', birthdate: 'Date de naissance', gender: 'Genre', select: 'Sélectionner', save: 'Enregistrer',
    searchPlaceholder: 'Recherchez vos chansons et artistes préférés',
    latestSongs: 'Dernières chansons',
    newReleases: 'Nouveaux lancements',
    gospelArtists: 'Artistes Gospel',
    prevButton: '‹',
    nextButton: '›',
    dailyMix: 'Mix du jour',
    recentlyPlayed: 'Écouté récemment',
    noRecentSongs: 'Les chansons que vous écoutez apparaîtront ici.',
    popularAlbums: 'Albums populaires',
    noResults: 'Aucun résultat trouvé.',
    loading: 'Chargement...',
    loadingError: 'Erreur de chargement des données.',
    loadingGenres: 'Chargement des genres...',
    exploreGenres: 'Explorer les genres',
    noGenres: 'Aucun genre trouvé',
    loadingArtists: 'Chargement des artistes...',
    artistsTitle: 'Artistes',
    loadingAlbums: 'Chargement des albums...',
    errorLoadingAlbums: 'Erreur lors du chargement des albums',
    noAlbumsAvailable: "Cet artiste n'a pas d'albums disponibles.",
    unknownArtist: 'Inconnu',
    unknownArtistName: 'Artiste inconnu',
    yourLibrary: 'Votre Bibliothèque',
    searchLibrary: 'Rechercher dans votre bibliothèque',
    allSongs: 'Toutes les chansons',
    likedSongsTitle: 'Chansons aimées',
    likedAlbumsTitle: 'Albums aimés',
    noFavoriteAlbums: "Vous n'avez pas d'albums favoris.",
    loadingAlbum: "Chargement de l'album...",
    albumNotFound: 'Album non trouvé.',
    albumTitle: 'ALBUM',
    songs: 'chansons',
    title: 'Titre',
    actions: 'Actions',
    duration: 'Durée',
    discography: 'Discographie',
    viewAll: 'Tout voir',
    similarArtistsTitle: 'Artistes similaires',
    clickToGoToProject: 'Cliquez pour aller au projet',
    radioTitle: 'Radios',
    liveRadio: 'Radio en direct',
    franceInterTitle: 'France Inter (France)',
    cadenaSerTitle: 'Cadena SER (Espagne)',
    rspRadioTitle: 'RSP Radio (Suisse)',
    radio1Title: 'Radio 1 (Pays-Bas)'
  },
  zh: {
    home: '首页', explore: '探索', radio: '广播', library: '我的音乐库', portfolio: '我的作品集', playlists: '播放列表', createPlaylist: '创建播放列表', settings: '设置', logout: '退出登录', account: '账户', profile: '个人资料', plan: '计划', premium: '高级', notifications: '通知', email: '邮箱', push: '推送', language: '语言', yourEmail: '你的邮箱', enterValidEmail: '请输入有效邮箱', send: '发送', welcomeMessage: '欢迎邮件已发送至', pushEnabled: '推送通知已启用', pushDisabled: '推送通知已禁用', spanish: '西班牙语', english: '英语', french: '法语', chinese: '中文', zulu: '祖鲁语',
    editProfile: '编辑资料', profilePhoto: '头像+', username: '用户名', birthdate: '出生日期', gender: '性别', select: '选择', save: '保存',
    searchPlaceholder: '搜索你最喜欢的歌曲和艺术家',
    latestSongs: '最新歌曲',
    newReleases: '新专辑',
    gospelArtists: '福音艺术家',
    prevButton: '‹',
    nextButton: '›',
    dailyMix: '每日混音',
    recentlyPlayed: '最近播放',
    noRecentSongs: '你播放的歌曲将显示在这里。',
    popularAlbums: '热门专辑',
    noResults: '没有找到结果。',
    loading: '加载中...',
    loadingError: '加载数据时出错。',
    loadingGenres: '加载类型...',
    exploreGenres: '探索类型',
    noGenres: '没有找到任何类型',
    loadingArtists: '正在加载艺人...',
    artistsTitle: '艺人',
    loadingAlbums: '正在加载专辑...',
    errorLoadingAlbums: '加载专辑时出错',
    noAlbumsAvailable: '这位艺人没有可用的专辑。',
    unknownArtist: '未知',
    unknownArtistName: '未知艺人',
    yourLibrary: '你的音乐库',
    searchLibrary: '搜索你的音乐库',
    allSongs: '所有歌曲',
    likedSongsTitle: '喜欢的歌曲',
    likedAlbumsTitle: '喜欢的专辑',
    noFavoriteAlbums: '你没有喜欢的专辑。',
    loadingAlbum: '正在加载专辑...',
    albumNotFound: '未找到专辑。',
    albumTitle: '专辑',
    songs: '歌曲',
    title: '标题',
    actions: '操作',
    duration: '时长',
    discography: '唱片',
    viewAll: '查看全部',
    similarArtistsTitle: '相似艺人',
    clickToGoToProject: '点击进入项目',
    radioTitle: '广播',
    liveRadio: '直播电台',
    franceInterTitle: '法国国际广播电台 (法国)',
    cadenaSerTitle: 'SER电台 (西班牙)',
    rspRadioTitle: 'RSP电台 (瑞士)',
    radio1Title: 'Radio 1 (荷兰)'
  },
  zu: {
    home: 'Ekhaya', explore: 'Hlola', radio: 'Umsakazo', library: 'Umthombo Wami', portfolio: 'Iphothifoliyo Yami', playlists: 'Amalista', createPlaylist: 'Dala I-Playlist', settings: 'Izilungiselelo', logout: 'Phuma', account: 'I-akhawunti', profile: 'Iphrofayili', plan: 'Uhlelo', premium: 'Premium', notifications: 'Izaziso', email: 'Imeyili', push: 'Push', language: 'Ulimi', yourEmail: 'Imeyili yakho', enterValidEmail: 'Faka imeyili evumelekile', send: 'Thumela', welcomeMessage: 'Umyalezo wokwamukela uthunyelwe ku', pushEnabled: 'Izaziso ze-push zivuliwe', pushDisabled: 'Izaziso ze-push zivaliwe', spanish: 'IsiSpanish', english: 'IsiNgisi', french: 'IsiFulentshi', chinese: 'IsiShayina', zulu: 'IsiZulu',
    editProfile: 'Hlela iphrofayela', profilePhoto: 'Isithombe sephrofayela+', username: 'Igama lomsebenzisi', birthdate: 'Usuku lokuzalwa', gender: 'Ubulili', select: 'Khetha', save: 'Londoloza',
    searchPlaceholder: 'Sesha izingoma nabaculi abayizintandokazi zakho',
    latestSongs: 'Izingoma zakamuva',
    newReleases: 'Okusha okukhishiwe',
    gospelArtists: 'Abaculi beGospel',
    prevButton: '‹',
    nextButton: '›',
    dailyMix: 'I-Daily Mix',
    recentlyPlayed: 'Okudlalwe Muva nje',
    noRecentSongs: 'Izingoma ozidlala zizovela lapha.',
    popularAlbums: 'Amalbhuma adumile',
    noResults: 'Awekho imiphumela etholakele.',
    loading: 'Iyalayisha...',
    loadingError: 'Iphutha lokulayisha idatha.',
    loadingGenres: 'Iyalayisha izinhlobo...',
    exploreGenres: 'Hlola izinhlobo',
    noGenres: 'Azikho izinhlobo ezitholakalayo',
    loadingArtists: 'Iyalayisha abaculi...',
    artistsTitle: 'Abaculi',
    loadingAlbums: 'Iyalayisha ama-albhamu...',
    errorLoadingAlbums: 'Iphutha lokulayisha ama-albhamu',
    noAlbumsAvailable: 'Lo mculi awanayo ama-albhamu atholakalayo.',
    unknownArtist: 'Okungaziwa',
    unknownArtistName: 'Umculi ongaziwa',
    yourLibrary: 'Umthombo Wakho',
    searchLibrary: 'Sesha umthombo wakho',
    allSongs: 'Zonke Izingoma',
    likedSongsTitle: 'Izingoma Ezithandwayo',
    likedAlbumsTitle: 'Ama-albhamu athandwayo',
    noFavoriteAlbums: 'Awunawo ama-albhamu athandwayo.',
    loadingAlbum: 'Iyalayisha i-albhamu...',
    albumNotFound: 'I-albhamu ayitholakalanga.',
    albumTitle: 'I-ALBHAMU',
    songs: 'izingoma',
    title: 'Isihloko',
    actions: 'Izenzo',
    duration: 'Isikhathi',
    discography: 'I-Discography',
    viewAll: 'Buka konke',
    similarArtistsTitle: 'Abaculi abafanayo',
    clickToGoToProject: 'Chofoza ukuya kuphrojekthi',
    radioTitle: 'Amaradiyo',
    liveRadio: 'Umsakazo bukhoma',
    franceInterTitle: 'France Inter (eFrance)',
    cadenaSerTitle: 'Cadena SER (eSpain)',
    rspRadioTitle: 'RSP Radio (eSwitzerland)',
    radio1Title: 'Radio 1 (eNetherlands)'
  }
}

const genreTranslations: Record<SupportedLang, Record<string, string>> = {
  es: {
    'Todos': 'Todos', 'Pop': 'Pop', 'Dance': 'Dance', 'Rock': 'Rock', 'Indie': 'Indie', 'Alternative': 'Alternativa',
    'Rap/Hip Hop': 'Rap/Hip Hop', 'R&B': 'R&B', 'Reggae': 'Reggae', 'Reggaeton': 'Reggaetón', 'Latin Pop': 'Latin Pop',
    'Latino': 'Latino', 'Metal': 'Metal', 'Jazz': 'Jazz', 'Classical': 'Clásica', 'Folk': 'Folk', 'Soundtrack': 'Bandas sonoras',
    'Country': 'Country', 'Blues': 'Blues', 'Funk': 'Funk', 'Soul': 'Soul', 'Gospel': 'Gospel', 'House': 'House',
    'Trance': 'Trance', 'Techno': 'Techno', 'World': 'Música del Mundo',
    'Alternativo': 'Alternativo', 'Electro': 'Electro', 'Películas/Juegos': 'Películas/Juegos', 'Soul & Funk': 'Soul & Funk',
    'Música colombiana': 'Música colombiana', 'Cumbia': 'Cumbia', 'Infantil': 'Infantil',
    'Música Africana': 'Música Africana', 'Música Asiática': 'Música Asiática',
    'Música Brasileña': 'Música Brasileña', 'Música de La India': 'Música de La India'
  },
  en: {
    'Todos': 'All', 'Pop': 'Pop', 'Dance': 'Dance', 'Rock': 'Rock', 'Indie': 'Indie', 'Alternative': 'Alternative',
    'Rap/Hip Hop': 'Rap/Hip Hop', 'R&B': 'R&B', 'Reggae': 'Reggae', 'Reggaeton': 'Reggaeton', 'Latin Pop': 'Latin Pop',
    'Latino': 'Latin', 'Metal': 'Metal', 'Jazz': 'Jazz', 'Classical': 'Classical', 'Folk': 'Folk', 'Soundtrack': 'Soundtrack',
    'Country': 'Country', 'Blues': 'Blues', 'Funk': 'Funk', 'Soul': 'Soul', 'Gospel': 'Gospel', 'House': 'House',
    'Trance': 'Trance', 'Techno': 'Techno', 'World': 'World Music',
    'Alternativo': 'Alternative', 'Electro': 'Electro', 'Películas/Juegos': 'Movies/Games', 'Soul & Funk': 'Soul & Funk',
    'Música colombiana': 'Colombian Music', 'Cumbia': 'Cumbia', 'Infantil': 'Children\'s Music',
    'Música Africana': 'African Music', 'Música Asiática': 'Asian Music',
    'Música Brasileña': 'Brazilian Music', 'Música de La India': 'Indian Music'
  },
  fr: {
    'Todos': 'Tous', 'Pop': 'Pop', 'Dance': 'Dance', 'Rock': 'Rock', 'Indie': 'Indie', 'Alternative': 'Alternative',
    'Rap/Hip Hop': 'Rap/Hip Hop', 'R&B': 'R&B', 'Reggae': 'Reggae', 'Reggaeton': 'Reggaeton', 'Latin Pop': 'Latin Pop',
    'Latino': 'Latin', 'Metal': 'Metal', 'Jazz': 'Jazz', 'Classical': 'Classique', 'Folk': 'Folk', 'Soundtrack': 'Bandes originales',
    'Country': 'Country', 'Blues': 'Blues', 'Funk': 'Funk', 'Soul': 'Soul', 'Gospel': 'Gospel', 'House': 'House',
    'Trance': 'Trance', 'Techno': 'Techno', 'World': 'Musiques du Monde',
    'Alternativo': 'Alternative', 'Electro': 'Electro', 'Películas/Juegos': 'Films/Jeux', 'Soul & Funk': 'Soul & Funk',
    'Música colombiana': 'Musique colombienne', 'Cumbia': 'Cumbia', 'Infantil': 'Musique pour enfants',
    'Música Africana': 'Musique africaine', 'Música Asiática': 'Musique asiatique',
    'Música Brasileña': 'Musique brésilienne', 'Música de La India': 'Musique indienne'
  },
  zh: {
    'Todos': '所有', 'Pop': '流行', 'Dance': '舞曲', 'Rock': '摇滚', 'Indie': '独立', 'Alternative': '另类',
    'Rap/Hip Hop': '说唱/嘻哈', 'R&B': 'R&B', 'Reggae': '雷鬼', 'Reggaeton': '雷鬼动', 'Latin Pop': '拉丁流行',
    'Latino': '拉丁', 'Metal': '金属', 'Jazz': '爵士', 'Classical': '古典', 'Folk': '民谣', 'Soundtrack': '原声',
    'Country': '乡村', 'Blues': '蓝调', 'Funk': '放克', 'Soul': '灵魂乐', 'Gospel': '福音', 'House': '浩室',
    'Trance': '出神', 'Techno': '科技', 'World': '世界音乐',
    'Alternativo': '另类', 'Electro': '电子', 'Películas/Juegos': '电影/游戏', 'Soul & Funk': '灵魂乐和放克',
    'Música colombiana': '哥伦比亚音乐', 'Cumbia': '坎比亚', 'Infantil': '儿童音乐',
    'Música Africana': '非洲音乐', 'Música Asiática': '亚洲音乐',
    'Música Brasileña': '巴西音乐', 'Música de La India': '印度音乐'
  },
  zu: {
    'Todos': 'Konke', 'Pop': 'Pop', 'Dance': 'Dance', 'Rock': 'Rock', 'Indie': 'Indie', 'Alternative': 'Okuhlukile',
    'Rap/Hip Hop': 'Rap/Hip Hop', 'R&B': 'R&B', 'Reggae': 'Reggae', 'Reggaeton': 'Reggaeton', 'Latin Pop': 'Latin Pop',
    'Latino': 'Latin', 'Metal': 'Metal', 'Jazz': 'Jazz', 'Classical': 'Classical', 'Folk': 'Folk', 'Soundtrack': 'I-Soundtrack',
    'Country': 'Country', 'Blues': 'Blues', 'Funk': 'Funk', 'Soul': 'Soul', 'Gospel': 'Gospel', 'House': 'House',
    'Trance': 'Trance', 'Techno': 'Techno', 'World': 'Umculo Womhlaba',
    'Alternativo': 'Okuhlukile', 'Electro': 'Electro', 'Películas/Juegos': 'Amafilimu/Imidlalo', 'Soul & Funk': 'I-Soul & Funk',
    'Música colombiana': 'Umculo waseColombia', 'Cumbia': 'I-Cumbia', 'Infantil': 'Umculo Wezingane',
    'Música Africana': 'Umculo wase-Afrika', 'Música Asiática': 'Umculo wase-Asia',
    'Música Brasileña': 'Umculo waseBrazil', 'Música de La India': 'Umculo wase-India'
  }
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>('es')

  useEffect(() => {
    const cookieMatch = document.cookie.match(/NEXT_LOCALE=(\w+)/)
    if (cookieMatch) setLangState(cookieMatch[1] as SupportedLang)
  }, [])

  const setLang = (newLang: SupportedLang) => {
    setLangState('')
    setTimeout(() => setLangState(newLang), 0)
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=${60*60*24*365}`
  }

  const t = (key: string) => translations[lang]?.[key] || key

  const tGenre = (genreName: string) => {
    return genreTranslations[lang]?.[genreName] || genreName;
  }

  return (
    <TranslationContext.Provider value={{ lang, setLang, t, tGenre }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) throw new Error('useTranslation debe usarse dentro de TranslationProvider')
  return context
}