// supabase/functions/analyze-creator/index.ts
// Analisa transcricoes e gera perfil de estilo do creator usando Claude Opus

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Schema do perfil de estilo
interface CreatorStyleAnalysis {
  creator_name: string
  videos_analyzed: number
  analysis_date: string

  ctr_textual: {
    primeiro_gancho_tipo: string
    exemplos_ganchos: string[]
    tempo_ate_conflito: string
    assimetria_informacao: {
      usa: boolean
      exemplos: string[]
    }
  }

  retencao_estrutural: {
    tipo_loop: string
    exemplos_loops: string[]
    frequencia_micro_recompensa: string
    tipos_micro_recompensa: string[]
    alternancia_cognitiva: {
      padroes: string[]
      exemplos: string[]
    }
    escalada_complexidade: string
  }

  linguagem: {
    friccao_controlada: {
      nivel: string
      exemplos: string[]
    }
    direcionamento_atencao: {
      usa: boolean
      frases_tipicas: string[]
    }
    economia_verbal: string
    densidade_informacional: string
  }

  funcoes_roteiro: {
    abrir_tensao: string
    instalar_risco: string
    manter_curiosidade: string
    micro_payoff: string
    elevar_apostas: string
    resolver_transformar: string
  }

  assinatura: {
    palavras_chave: string[]
    tom_predominante: string
    formato_preferido: string
    elementos_unicos: string[]
  }

  padroes_linguagem: {
    palavras_frequentes: Array<{ palavra: string; frequencia: number }>
    expressoes_tipicas: string[]
    conectores_favoritos: string[]
    bordoes: string[]
  }

  estrutura_tipica: {
    abertura: string
    desenvolvimento: string
    fechamento: string
    duracao_media_minutos: number
  }
}

const ANALYSIS_SYSTEM_PROMPT = `Voce e um especialista em analise de roteiros para YouTube com foco em retencao e CTR.

Sua tarefa e analisar transcricoes de videos de um creator e extrair um perfil DETALHADO e ESTRUTURADO do estilo dele.

## FRAMEWORK DE ANALISE (4 CAMADAS):

### CAMADA 1: CTR TEXTUAL (Antes do play existir)
Analise a primeira frase real (nao o "ola pessoal"):
- Tipo: afirmacao_contraintuitiva | acusacao_implicita | promessa_incompleta | confissao | pergunta_existencial
- Quantas frases ate aparecer conflito/tensao: imediato | 1-2_frases | 3-5_frases | mais_de_5
- Assimetria de informacao: sugere algo grande mas segura detalhes?

### CAMADA 2: RETENCAO ESTRUTURAL
- Loop: explicito (promessas diretas como "vou mostrar 5 coisas") | implicito (tensao nao resolvida) | misto
- Frequencia de micro-recompensa: muito_alta (15-30s) | alta (30-60s) | media (60-90s) | baixa (90s+)
- Tipos de micro-recompensa: insight, humor, dado_revelado, resultado_visual, validacao, etc
- Alternancia cognitiva: padroes como abstrato→concreto, problema→solucao, teoria→exemplo
- Escalada de complexidade: forte | moderada | baixa | nenhuma

### CAMADA 3: LINGUAGEM QUE PRENDE
- Friccao controlada: alta | media | baixa (quanto confronta crencas do espectador?)
- Direcionamento de atencao: usa frases como "olha isso", "repara", "o ponto e"?
- Economia verbal: excelente | boa | moderada | baixa
- Densidade informacional: muito_alta | alta | media | baixa

### CAMADA 4: FUNCOES DO ROTEIRO
Identifique como o creator executa cada funcao:
- Abrir tensao: como ele cria necessidade de continuar?
- Instalar risco: como mostra consequencia de nao saber?
- Manter curiosidade: como promete mais a frente?
- Micro-payoff: como recompensa atencao?
- Elevar apostas: como mostra que fica melhor?
- Resolver/transformar: como entrega a promessa?

### ASSINATURA UNICA
Identifique 3-4 palavras que definem o estilo (ex: "Velocidade + Sarcasmo + Densidade")

### PADROES DE LINGUAGEM
- Palavras que mais repete (com frequencia estimada)
- Expressoes tipicas e bordoes
- Conectores favoritos

### ESTRUTURA TIPICA
- Como geralmente abre os videos
- Como desenvolve o conteudo
- Como fecha

## INSTRUCOES IMPORTANTES:
1. Seja ESPECIFICO - use exemplos reais das transcricoes
2. Identifique PADROES que se repetem nos videos
3. Foque no que torna esse creator UNICO
4. O output deve ser um JSON valido seguindo o schema fornecido
5. Responda em portugues brasileiro
6. Retorne APENAS o JSON, sem texto adicional antes ou depois`

function buildUserPrompt(creatorName: string, transcripts: string[]): string {
  const combinedTranscripts = transcripts
    .map((t, i) => `=== VIDEO ${i + 1} ===\n${t.slice(0, 8000)}`)
    .join('\n\n')

  return `Analise as transcricoes do creator "${creatorName}" e gere um perfil completo de estilo.

## TRANSCRICOES DOS VIDEOS:

${combinedTranscripts}

## OUTPUT ESPERADO:
Retorne APENAS um JSON valido seguindo este schema exato:

{
  "creator_name": "${creatorName}",
  "videos_analyzed": ${transcripts.length},
  "analysis_date": "${new Date().toISOString()}",
  "ctr_textual": {
    "primeiro_gancho_tipo": "afirmacao_contraintuitiva | acusacao_implicita | promessa_incompleta | confissao | pergunta_existencial",
    "exemplos_ganchos": ["exemplo1", "exemplo2", "exemplo3"],
    "tempo_ate_conflito": "imediato | 1-2_frases | 3-5_frases | mais_de_5",
    "assimetria_informacao": {
      "usa": true,
      "exemplos": ["exemplo1", "exemplo2"]
    }
  },
  "retencao_estrutural": {
    "tipo_loop": "explicito | implicito | misto",
    "exemplos_loops": ["exemplo1", "exemplo2"],
    "frequencia_micro_recompensa": "muito_alta | alta | media | baixa",
    "tipos_micro_recompensa": ["insight", "humor", "dado_revelado"],
    "alternancia_cognitiva": {
      "padroes": ["abstrato->concreto", "problema->solucao"],
      "exemplos": ["exemplo1"]
    },
    "escalada_complexidade": "forte | moderada | baixa | nenhuma"
  },
  "linguagem": {
    "friccao_controlada": {
      "nivel": "alta | media | baixa",
      "exemplos": ["exemplo1"]
    },
    "direcionamento_atencao": {
      "usa": true,
      "frases_tipicas": ["olha isso", "repara"]
    },
    "economia_verbal": "excelente | boa | moderada | baixa",
    "densidade_informacional": "muito_alta | alta | media | baixa"
  },
  "funcoes_roteiro": {
    "abrir_tensao": "descricao de como o creator faz",
    "instalar_risco": "descricao",
    "manter_curiosidade": "descricao",
    "micro_payoff": "descricao",
    "elevar_apostas": "descricao",
    "resolver_transformar": "descricao"
  },
  "assinatura": {
    "palavras_chave": ["palavra1", "palavra2", "palavra3"],
    "tom_predominante": "descricao do tom",
    "formato_preferido": "descricao do formato",
    "elementos_unicos": ["elemento1", "elemento2"]
  },
  "padroes_linguagem": {
    "palavras_frequentes": [{"palavra": "exemplo", "frequencia": 15}],
    "expressoes_tipicas": ["expressao1", "expressao2"],
    "conectores_favoritos": ["entao", "mas"],
    "bordoes": ["bordao1"]
  },
  "estrutura_tipica": {
    "abertura": "descricao de como abre",
    "desenvolvimento": "descricao de como desenvolve",
    "fechamento": "descricao de como fecha",
    "duracao_media_minutos": 10
  }
}

IMPORTANTE: Retorne APENAS o JSON, sem markdown, sem explicacoes, sem texto antes ou depois.`
}

async function analyzeWithClaude(
  creatorName: string,
  transcripts: string[]
): Promise<CreatorStyleAnalysis> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-20250514',
      max_tokens: 4096,
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(creatorName, transcripts),
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

  // Extrair JSON da resposta (caso tenha texto extra)
  let jsonStr = content.trim()

  // Tentar encontrar o JSON se estiver envolvido em texto
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    jsonStr = jsonMatch[0]
  }

  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('Erro ao parsear JSON:', jsonStr.substring(0, 500))
    throw new Error('Resposta do Claude nao e um JSON valido')
  }
}

// Gera prompt template para geracao de roteiros
function generatePromptTemplate(analysis: CreatorStyleAnalysis): string {
  return `Voce e um roteirista que escreve EXATAMENTE no estilo de ${analysis.creator_name}.

## ASSINATURA DO ESTILO:
${analysis.assinatura.palavras_chave.join(' + ')}

## REGRAS DE CTR (Gancho):
- Tipo de gancho: ${analysis.ctr_textual.primeiro_gancho_tipo}
- Tempo ate conflito: ${analysis.ctr_textual.tempo_ate_conflito}
- ${analysis.ctr_textual.assimetria_informacao.usa ? 'USA assimetria de informacao' : 'NAO usa assimetria de informacao'}

## REGRAS DE RETENCAO:
- Tipo de loop: ${analysis.retencao_estrutural.tipo_loop}
- Micro-recompensa a cada: ${analysis.retencao_estrutural.frequencia_micro_recompensa === 'muito_alta' ? '15-30 segundos' : analysis.retencao_estrutural.frequencia_micro_recompensa === 'alta' ? '30-60 segundos' : '60-90 segundos'}
- Tipos de recompensa: ${analysis.retencao_estrutural.tipos_micro_recompensa.join(', ')}
- Padroes de alternancia: ${analysis.retencao_estrutural.alternancia_cognitiva.padroes.join(', ')}

## REGRAS DE LINGUAGEM:
- Friccao: ${analysis.linguagem.friccao_controlada.nivel}
- Economia verbal: ${analysis.linguagem.economia_verbal}
- Densidade: ${analysis.linguagem.densidade_informacional}
- ${analysis.linguagem.direcionamento_atencao.usa ? `Usar frases como: ${analysis.linguagem.direcionamento_atencao.frases_tipicas.join(', ')}` : 'Nao usa frases de direcionamento explicitas'}

## PADROES DE LINGUAGEM OBRIGATORIOS:
- Expressoes tipicas: ${analysis.padroes_linguagem.expressoes_tipicas.join(', ')}
- Conectores: ${analysis.padroes_linguagem.conectores_favoritos.join(', ')}
- Bordoes: ${analysis.padroes_linguagem.bordoes.join(', ')}

## ESTRUTURA DO ROTEIRO:
- Abertura: ${analysis.estrutura_tipica.abertura}
- Desenvolvimento: ${analysis.estrutura_tipica.desenvolvimento}
- Fechamento: ${analysis.estrutura_tipica.fechamento}

## FUNCOES QUE O ROTEIRO DEVE CUMPRIR:
1. ABRIR TENSAO: ${analysis.funcoes_roteiro.abrir_tensao}
2. INSTALAR RISCO: ${analysis.funcoes_roteiro.instalar_risco}
3. MANTER CURIOSIDADE: ${analysis.funcoes_roteiro.manter_curiosidade}
4. ENTREGAR MICRO-PAYOFFS: ${analysis.funcoes_roteiro.micro_payoff}
5. ELEVAR APOSTAS: ${analysis.funcoes_roteiro.elevar_apostas}
6. RESOLVER/TRANSFORMAR: ${analysis.funcoes_roteiro.resolver_transformar}

## TOM:
${analysis.assinatura.tom_predominante}

O roteiro deve parecer que foi escrito pelo proprio ${analysis.creator_name}.`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { creator_name, transcripts } = await req.json()

    if (!creator_name) {
      return new Response(
        JSON.stringify({ error: 'creator_name e obrigatorio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!transcripts || !Array.isArray(transcripts) || transcripts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'transcripts deve ser um array com pelo menos 1 transcricao' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY nao configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Analisar com Claude Opus
    const analysis = await analyzeWithClaude(creator_name, transcripts)

    // Gerar prompt template
    const promptTemplate = generatePromptTemplate(analysis)

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        prompt_template: promptTemplate,
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
