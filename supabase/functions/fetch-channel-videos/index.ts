// supabase/functions/fetch-channel-videos/index.ts
// Busca videos de um canal do YouTube usando Piped API (gratis)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Instancias Piped disponiveis (fallback se uma cair)
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://pipedapi.in.projectsegfau.lt',
]

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoInfo {
  video_id: string
  title: string
  thumbnail_url: string
  published_at?: string
  view_count: number
  duration_seconds: number
  url: string
}

interface ChannelInfo {
  id: string
  name: string
  url: string
  avatar_url?: string
  subscriber_count: number
  description?: string
}

// Extrai identificador do canal de diferentes formatos de URL
function extractChannelIdentifier(url: string): { type: 'id' | 'handle' | 'name', value: string } | null {
  const patterns = [
    // youtube.com/channel/UC...
    { regex: /youtube\.com\/channel\/(UC[\w-]+)/, type: 'id' as const },
    // youtube.com/@handle
    { regex: /youtube\.com\/@([\w.-]+)/, type: 'handle' as const },
    // youtube.com/c/channelname
    { regex: /youtube\.com\/c\/([\w.-]+)/, type: 'name' as const },
    // youtube.com/user/username
    { regex: /youtube\.com\/user\/([\w.-]+)/, type: 'name' as const },
    // Apenas @handle
    { regex: /^@([\w.-]+)$/, type: 'handle' as const },
    // Apenas channel ID
    { regex: /^(UC[\w-]+)$/, type: 'id' as const },
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern.regex)
    if (match) {
      return { type: pattern.type, value: match[1] }
    }
  }

  return null
}

// Tenta fetch em multiplas instancias Piped
async function fetchWithFallback(path: string): Promise<Response> {
  let lastError: Error | null = null

  for (const instance of PIPED_INSTANCES) {
    try {
      const response = await fetch(`${instance}${path}`, {
        headers: { 'User-Agent': 'ORYOS/1.0' },
      })

      if (response.ok) {
        return response
      }

      if (response.status === 404) {
        throw new Error('Canal nao encontrado')
      }
    } catch (error) {
      lastError = error
      console.log(`Instancia ${instance} falhou, tentando proxima...`)
    }
  }

  throw lastError || new Error('Todas as instancias Piped falharam')
}

// Busca canal por handle ou nome
async function resolveChannelId(identifier: { type: string, value: string }): Promise<string> {
  if (identifier.type === 'id') {
    return identifier.value
  }

  // Piped usa /c/ para buscar por nome/handle
  const searchPath = identifier.type === 'handle'
    ? `/channel/@${identifier.value}`
    : `/c/${identifier.value}`

  try {
    const response = await fetchWithFallback(searchPath)
    const data = await response.json()

    if (data.id) {
      return data.id
    }

    throw new Error('Canal nao encontrado')
  } catch {
    // Fallback: tentar buscar via search
    const searchResponse = await fetchWithFallback(`/search?q=${encodeURIComponent(identifier.value)}&filter=channels`)
    const searchData = await searchResponse.json()

    if (searchData.items && searchData.items.length > 0) {
      const channel = searchData.items.find((item: any) =>
        item.type === 'channel' &&
        (item.name?.toLowerCase().includes(identifier.value.toLowerCase()) ||
         item.url?.includes(identifier.value))
      )

      if (channel && channel.url) {
        // Extrair ID da URL
        const idMatch = channel.url.match(/\/channel\/(UC[\w-]+)/)
        if (idMatch) {
          return idMatch[1]
        }
      }
    }

    throw new Error('Canal nao encontrado')
  }
}

// Busca informacoes do canal e videos
async function getChannelData(channelId: string, maxVideos: number): Promise<{
  channel: ChannelInfo,
  videos: VideoInfo[]
}> {
  const response = await fetchWithFallback(`/channel/${channelId}`)
  const data = await response.json()

  if (!data) {
    throw new Error('Nao foi possivel obter dados do canal')
  }

  const channel: ChannelInfo = {
    id: data.id || channelId,
    name: data.name || data.uploader || 'Desconhecido',
    url: `https://youtube.com/channel/${channelId}`,
    avatar_url: data.avatarUrl || data.avatar,
    subscriber_count: data.subscriberCount || 0,
    description: data.description,
  }

  // Processar videos
  const relatedStreams = data.relatedStreams || []
  const videos: VideoInfo[] = relatedStreams
    .filter((item: any) => item.type === 'stream' || item.duration > 0)
    .slice(0, maxVideos)
    .map((video: any) => ({
      video_id: extractVideoIdFromUrl(video.url) || video.url,
      title: video.title || 'Sem titulo',
      thumbnail_url: video.thumbnail || '',
      published_at: video.uploaded ? new Date(video.uploaded).toISOString() : undefined,
      view_count: video.views || 0,
      duration_seconds: video.duration || 0,
      url: video.url?.startsWith('http')
        ? video.url
        : `https://youtube.com${video.url}`,
    }))

  return { channel, videos }
}

// Extrai video ID de URL
function extractVideoIdFromUrl(url: string): string | null {
  if (!url) return null

  const patterns = [
    /\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /^([\w-]{11})$/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

// Busca mais videos se necessario (paginacao)
async function fetchMoreVideos(
  channelId: string,
  currentVideos: VideoInfo[],
  maxVideos: number,
  nextpage?: string
): Promise<VideoInfo[]> {
  if (currentVideos.length >= maxVideos || !nextpage) {
    return currentVideos.slice(0, maxVideos)
  }

  try {
    const response = await fetchWithFallback(
      `/nextpage/channel/${channelId}?nextpage=${encodeURIComponent(nextpage)}`
    )
    const data = await response.json()

    const newVideos = (data.relatedStreams || [])
      .filter((item: any) => item.type === 'stream' || item.duration > 0)
      .map((video: any) => ({
        video_id: extractVideoIdFromUrl(video.url) || video.url,
        title: video.title || 'Sem titulo',
        thumbnail_url: video.thumbnail || '',
        published_at: video.uploaded ? new Date(video.uploaded).toISOString() : undefined,
        view_count: video.views || 0,
        duration_seconds: video.duration || 0,
        url: video.url?.startsWith('http')
          ? video.url
          : `https://youtube.com${video.url}`,
      }))

    const allVideos = [...currentVideos, ...newVideos]

    // Continuar paginacao se necessario
    if (allVideos.length < maxVideos && data.nextpage) {
      return fetchMoreVideos(channelId, allVideos, maxVideos, data.nextpage)
    }

    return allVideos.slice(0, maxVideos)
  } catch {
    return currentVideos.slice(0, maxVideos)
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { channel_url, max_videos = 20 } = await req.json()

    if (!channel_url) {
      return new Response(
        JSON.stringify({ error: 'channel_url e obrigatorio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 1. Extrair identificador do canal
    const identifier = extractChannelIdentifier(channel_url)
    if (!identifier) {
      return new Response(
        JSON.stringify({ error: 'URL do canal invalida. Use formato: youtube.com/@canal ou youtube.com/channel/UCxxxx' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Resolver channel ID
    const channelId = await resolveChannelId(identifier)

    // 3. Buscar dados do canal
    const { channel, videos } = await getChannelData(channelId, max_videos)

    // 4. Ordenar por views (mais populares primeiro)
    videos.sort((a, b) => b.view_count - a.view_count)

    return new Response(
      JSON.stringify({
        success: true,
        channel,
        videos,
        total_videos: videos.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
