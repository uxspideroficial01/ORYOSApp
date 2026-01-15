// supabase/functions/generate-script/index.ts
// Gera roteiros usando o estilo analisado do creator com Claude Sonnet

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateScriptRequest {
  topic: string
  prompt_template: string
  format?: 'youtube_long' | 'youtube_short' | 'reels' | 'twitter_thread'
  word_count?: number
  additional_instructions?: string
  language?: 'pt-BR' | 'en'
}

interface GeneratedScript {
  title_suggestion: string
  hook: string
  script_content: string
  thumbnail_ideas: string[]
  estimated_duration_seconds: number
  actual_word_count: number
}

const FORMAT_CONFIGS = {
  youtube_long: {
    min_words: 800,
    max_words: 2500,
    default_words: 1200,
    description: 'Video longo para YouTube (6-15 minutos)',
  },
  youtube_short: {
    min_words: 100,
    max_words: 250,
    default_words: 150,
    description: 'YouTube Shorts (ate 60 segundos)',
  },
  reels: {
    min_words: 80,
    max_words: 200,
    default_words: 120,
    description: 'Instagram/TikTok Reels (30-60 segundos)',
  },
  twitter_thread: {
    min_words: 400,
    max_words: 1000,
    default_words: 600,
    description: 'Thread para Twitter/X (8-15 tweets)',
  },
}

const GENERATION_SYSTEM_PROMPT = `Voce e um roteirista profissional especializado em conteudo para YouTube.

Sua tarefa e criar roteiros que:
1. Seguem EXATAMENTE o estilo do creator fornecido no prompt template
2. Sao otimizados para retencao e CTR
3. Aplicam todas as tecnicas de storytelling do framework de 4 camadas

REGRAS OBRIGATORIAS:
- O roteiro deve parecer que foi escrito pelo proprio creator
- Use os mesmos padroes de linguagem, bordoes e expressoes
- Mantenha a mesma frequencia de micro-recompensas
- Siga a mesma estrutura de abertura/desenvolvimento/fechamento
- Aplique o mesmo nivel de friccao controlada
- Use os mesmos tipos de loops e ganchos

OUTPUT:
Retorne APENAS um JSON valido com a estrutura especificada.
NAO inclua markdown, explicacoes ou texto fora do JSON.
NAO use crases ou blocos de codigo.`

function buildUserPrompt(request: GenerateScriptRequest): string {
  const format = FORMAT_CONFIGS[request.format || 'youtube_long']
  const wordCount = request.word_count || format.default_words

  return `## PERFIL DO ESTILO DO CREATOR:
${request.prompt_template}

## ASSUNTO DO ROTEIRO:
${request.topic}

## FORMATO:
${request.format || 'youtube_long'} - ${format.description}

## QUANTIDADE DE PALAVRAS:
Aproximadamente ${wordCount} palavras

${request.additional_instructions ? `## INSTRUCOES ADICIONAIS:\n${request.additional_instructions}` : ''}

## IDIOMA:
${request.language === 'en' ? 'Ingles' : 'Portugues brasileiro'}

## OUTPUT ESPERADO:
Retorne APENAS um JSON valido com esta estrutura exata:

{
  "title_suggestion": "Titulo otimizado para CTR (max 60 caracteres)",
  "hook": "Primeira frase do video (o gancho principal)",
  "script_content": "O roteiro completo aqui, pronto para ser lido/gravado. Texto corrido sem marcacoes.",
  "thumbnail_ideas": ["Ideia 1 de thumbnail", "Ideia 2", "Ideia 3"],
  "estimated_duration_seconds": 480,
  "actual_word_count": ${wordCount}
}

IMPORTANTE:
- O script_content deve ter aproximadamente ${wordCount} palavras
- O roteiro deve ser texto corrido, pronto para gravar
- NAO inclua marcacoes como [INTRO], [CORTE], etc
- O texto deve fluir naturalmente como se fosse uma fala
- Retorne APENAS o JSON, sem texto antes ou depois
- NAO use crases ou blocos de codigo markdown`
}

async function generateWithClaude(request: GenerateScriptRequest): Promise<GeneratedScript> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: GENERATION_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(request),
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `Claude API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.content?.[0]?.text

  if (!content) {
    throw new Error('Resposta vazia do Claude')
  }

  // Extrair JSON da resposta
  let jsonStr = content.trim()

  // Remover possivel markdown
  jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '')

  // Tentar encontrar o JSON
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    jsonStr = jsonMatch[0]
  }

  try {
    const parsed = JSON.parse(jsonStr)

    // Calcular word count real se nao veio
    if (!parsed.actual_word_count && parsed.script_content) {
      parsed.actual_word_count = parsed.script_content.split(/\s+/).length
    }

    // Estimar duracao se nao veio (150 palavras por minuto)
    if (!parsed.estimated_duration_seconds && parsed.actual_word_count) {
      parsed.estimated_duration_seconds = Math.round((parsed.actual_word_count / 150) * 60)
    }

    // Garantir que thumbnail_ideas e array
    if (!Array.isArray(parsed.thumbnail_ideas)) {
      parsed.thumbnail_ideas = parsed.thumbnail_ideas ? [parsed.thumbnail_ideas] : []
    }

    return parsed
  } catch (e) {
    console.error('Erro ao parsear JSON:', jsonStr.substring(0, 500))
    throw new Error('Resposta do Claude nao e um JSON valido')
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: GenerateScriptRequest = await req.json()

    // Validacoes
    if (!body.topic) {
      return new Response(
        JSON.stringify({ error: 'topic e obrigatorio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!body.prompt_template) {
      return new Response(
        JSON.stringify({ error: 'prompt_template e obrigatorio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY nao configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar formato
    if (body.format && !FORMAT_CONFIGS[body.format]) {
      return new Response(
        JSON.stringify({
          error: 'Formato invalido',
          valid_formats: Object.keys(FORMAT_CONFIGS)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar word_count
    if (body.word_count) {
      const format = FORMAT_CONFIGS[body.format || 'youtube_long']
      if (body.word_count < format.min_words || body.word_count > format.max_words) {
        return new Response(
          JSON.stringify({
            error: `word_count deve estar entre ${format.min_words} e ${format.max_words} para o formato ${body.format || 'youtube_long'}`
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Gerar roteiro com Claude Sonnet
    const script = await generateWithClaude(body)

    return new Response(
      JSON.stringify({
        success: true,
        script,
        format: body.format || 'youtube_long',
        requested_word_count: body.word_count || FORMAT_CONFIGS[body.format || 'youtube_long'].default_words,
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
