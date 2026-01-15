// supabase/functions/extract-transcript/index.ts
// Extrai transcricao de video do YouTube usando TranscriptAPI ($5/mes - 1000 creditos)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TRANSCRIPT_API_URL = 'https://transcriptapi.com/api/v2/youtube/transcript'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranscriptSegment {
  text: string
  start?: number
  duration?: number
}

interface TranscriptAPIResponse {
  video_id: string
  language: string
  transcript: TranscriptSegment[]
  metadata?: {
    title: string
    author_name: string
    author_url: string
    thumbnail_url: string
  }
}

interface TranscriptResponse {
  success: boolean
  video_id: string
  title?: string
  channel?: string
  thumbnail?: string
  transcript: string
  word_count: number
  language?: string
}

// Extrai video ID de diferentes formatos de URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/v\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
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

async function fetchTranscript(videoId: string): Promise<TranscriptResponse> {
  const apiKey = Deno.env.get('TRANSCRIPT_API_KEY')

  if (!apiKey) {
    throw new Error('TRANSCRIPT_API_KEY nao configurada')
  }

  // Construir URL com parametros
  const url = new URL(TRANSCRIPT_API_URL)
  url.searchParams.set('video_url', `https://youtube.com/watch?v=${videoId}`)
  url.searchParams.set('format', 'json')
  url.searchParams.set('include_timestamp', 'false')
  url.searchParams.set('send_metadata', 'true')

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()

    if (response.status === 401) {
      throw new Error('API key invalida')
    }
    if (response.status === 404) {
      throw new Error('Video nao encontrado ou sem transcricao')
    }
    if (response.status === 429) {
      throw new Error('Limite de requisicoes atingido')
    }

    throw new Error(`Erro na API: ${response.status} - ${errorText}`)
  }

  const data: TranscriptAPIResponse = await response.json()

  // Concatenar todos os segmentos de texto
  const fullTranscript = data.transcript
    .map(segment => segment.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/\[.*?\]/g, '') // Remove [Music], [Applause], etc
    .trim()

  if (!fullTranscript || fullTranscript.length < 50) {
    throw new Error('Transcricao vazia ou muito curta')
  }

  return {
    success: true,
    video_id: data.video_id || videoId,
    title: data.metadata?.title,
    channel: data.metadata?.author_name,
    thumbnail: data.metadata?.thumbnail_url,
    transcript: fullTranscript,
    word_count: fullTranscript.split(/\s+/).length,
    language: data.language,
  }
}

// Processa multiplos videos
async function fetchMultipleTranscripts(
  videoIds: string[]
): Promise<{ results: TranscriptResponse[], errors: { video_id: string, error: string }[] }> {
  const results: TranscriptResponse[] = []
  const errors: { video_id: string, error: string }[] = []

  for (const videoId of videoIds) {
    try {
      // Delay entre requests para respeitar rate limit
      if (results.length > 0 || errors.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }

      const result = await fetchTranscript(videoId)
      results.push(result)
    } catch (error) {
      errors.push({
        video_id: videoId,
        error: error.message || 'Erro desconhecido',
      })
    }
  }

  return { results, errors }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()

    // Modo single video
    if (body.video_url || body.video_id) {
      const input = body.video_url || body.video_id
      const videoId = extractVideoId(input)

      if (!videoId) {
        return new Response(
          JSON.stringify({ error: 'URL ou ID do video invalido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const result = await fetchTranscript(videoId)

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Modo batch
    if (body.video_urls || body.video_ids) {
      const inputs: string[] = body.video_urls || body.video_ids
      const videoIds = inputs
        .map(input => extractVideoId(input))
        .filter((id): id is string => id !== null)

      if (videoIds.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Nenhum video ID valido encontrado' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Limitar a 10 videos por request
      const limitedIds = videoIds.slice(0, 10)
      const { results, errors } = await fetchMultipleTranscripts(limitedIds)

      return new Response(
        JSON.stringify({
          success: true,
          total_requested: limitedIds.length,
          total_success: results.length,
          total_errors: errors.length,
          results,
          errors: errors.length > 0 ? errors : undefined,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'video_url, video_id, video_urls ou video_ids e obrigatorio' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
