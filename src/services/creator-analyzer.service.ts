// Serviço para análise de criadores usando Claude API
import type { CreatorAnalysis, Video } from '@/types/cloning';

export class CreatorAnalyzerService {
  /**
   * Analisa múltiplos vídeos de um criador e consolida em um perfil único
   */
  static async analyzeCreator(
    videos: Video[],
    creatorName: string
  ): Promise<CreatorAnalysis> {
    // Em produção, faria chamada real à Claude API
    // Por agora, retorna análise simulada

    const claudeApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (!claudeApiKey) {
      return this.getMockAnalysis();
    }

    // Aqui seria a implementação real com Claude
    const prompt = this.buildAnalysisPrompt(videos, creatorName);

    try {
      // const response = await callClaudeAPI(prompt);
      // return this.parseAnalysisResponse(response);

      // Por agora, retorna mock
      return this.getMockAnalysis();
    } catch (error) {
      console.error('Erro na análise:', error);
      return this.getMockAnalysis();
    }
  }

  /**
   * Constrói o prompt para análise do criador
   */
  private static buildAnalysisPrompt(videos: Video[], creatorName: string): string {
    const transcripts = videos
      .filter((v) => v.transcript)
      .map((v, idx) => `
VÍDEO ${idx + 1}: ${v.title}
Duração: ${v.duration ? Math.floor(v.duration / 60) : '?'} minutos
Transcrição:
${v.transcript}

---
`)
      .join('\n\n');

    return `Você é um especialista em análise de comunicação e criação de conteúdo digital. Analise em profundidade o estilo do criador "${creatorName}" baseado nas transcrições de ${videos.length} vídeos.

${transcripts}

**INSTRUÇÕES:**

Analise profundamente e retorne um JSON estruturado com:

\`\`\`json
{
  "voice_tone": {
    "tom_predominante": "<energético/calmo/profissional/descontraído/inspirador>",
    "variacao_tonal": <0-10>,
    "velocidade_fala": "<rápido/moderado/devagar>",
    "pausas_dramaticas": <true/false>,
    "enfase_palavras": ["palavra1", "palavra2", ...]
  },
  "style_quirks": {
    "maneirismos_verbais": ["exemplo1", "exemplo2"],
    "interacoes_camera": ["olha pra camera", "gesticula muito", ...]
  },
  "communication_style": {
    "abordagem": "<direto ao ponto/storytelling/educacional/entretenimento>",
    "nivel_formalidade": <0-10>,
    "uso_humor": <0-10>,
    "uso_exemplos": <0-10>,
    "interacao_audiencia": <true/false>,
    "perguntas_retoricas": <true/false>
  },
  "language_patterns": {
    "palavras_repeticao": [
      {"palavra": "pessoal", "frequencia": 15},
      {"palavra": "então", "frequencia": 12}
    ],
    "conectores_favoritos": ["tipo", "mas", "só que"],
    "girias_regionalismos": ["massa", "dahora"],
    "bordoes": ["vamo nessa", "bora lá"]
  },
  "narrative_structure": {
    "abertura_tipo": "Cumprimento + gancho com pergunta",
    "duracao_intro_segundos": 30,
    "uso_ganchos": ["perguntas diretas", "promessas de valor"],
    "transicoes_caracteristicas": ["e agora", "bora pro próximo"],
    "fechamento_tipo": "Resumo + CTA múltiplo",
    "cta_padrao": "like + inscrever + comentar"
  },
  "retention_elements": {
    "uso_cortes_rapidos": true,
    "mudancas_ritmo": true,
    "elementos_surpresa": ["reviravoltas", "fatos curiosos"],
    "loops_abertos": true,
    "teasers_conteudo": true
  },
  "ctr_strategies": {
    "titulos_padrao": ["Como X em Y", "X coisas que você precisa saber"],
    "thumbnails_estilo": "expressão facial marcante + texto curto",
    "primeiros_segundos_estrategia": "gancho forte + promessa de valor"
  }
}
\`\`\`

IMPORTANTE:
- Seja MUITO específico nos exemplos
- Capture nuances únicas deste criador
- Identifique padrões que se repetem
- Foque em elementos replicáveis
- Retorne APENAS o JSON, sem texto adicional`;
  }

  /**
   * Mock de análise para desenvolvimento
   */
  private static getMockAnalysis(): CreatorAnalysis {
    return {
      voice_tone: {
        tom_predominante: 'energético',
        variacao_tonal: 8,
        velocidade_fala: 'moderado',
        pausas_dramaticas: true,
        enfase_palavras: ['pessoal', 'muito importante', 'super', 'demais'],
      },
      style_quirks: {
        maneirismos_verbais: [
          'Olá pessoal',
          'Tudo bem?',
          'Bora lá',
          'Vamo nessa',
          'É isso aí',
        ],
        interacoes_camera: [
          'Olha direto para a câmera',
          'Gesticula com as mãos frequentemente',
          'Sorri ao falar pontos importantes',
        ],
      },
      communication_style: {
        abordagem: 'educacional',
        nivel_formalidade: 4,
        uso_humor: 7,
        uso_exemplos: 9,
        interacao_audiencia: true,
        perguntas_retoricas: true,
      },
      language_patterns: {
        palavras_repeticao: [
          { palavra: 'pessoal', frequencia: 15 },
          { palavra: 'então', frequencia: 12 },
          { palavra: 'tipo', frequencia: 10 },
          { palavra: 'super', frequencia: 8 },
        ],
        conectores_favoritos: ['e aí', 'mas', 'então', 'tipo'],
        girias_regionalismos: ['massa', 'dahora', 'mano'],
        bordoes: ['Vamo nessa!', 'Bora lá!', 'É isso aí!'],
      },
      narrative_structure: {
        abertura_tipo: 'Cumprimento caloroso + gancho com pergunta',
        duracao_intro_segundos: 25,
        uso_ganchos: [
          'Perguntas diretas à audiência',
          'Promessas de valor específicas',
          'Criar curiosidade',
        ],
        transicoes_caracteristicas: [
          'E agora vamos para',
          'Próximo ponto importante',
          'Olha só isso aqui',
        ],
        fechamento_tipo: 'Resumo rápido + múltiplos CTAs',
        cta_padrao: 'Like, inscrever, ativar sininho, comentar',
      },
      retention_elements: {
        uso_cortes_rapidos: true,
        mudancas_ritmo: true,
        elementos_surpresa: ['Dados surpreendentes', 'Fatos pouco conhecidos'],
        loops_abertos: true,
        teasers_conteudo: true,
      },
      ctr_strategies: {
        titulos_padrao: [
          'Como [X] em [Y tempo]',
          '[Número] coisas que você PRECISA saber sobre [X]',
          'O SEGREDO de [X] que ninguém conta',
        ],
        thumbnails_estilo: 'Expressão facial marcante + texto amarelo grande + contraste alto',
        primeiros_segundos_estrategia:
          'Gancho fortíssimo com pergunta ou afirmação polêmica + promessa clara de valor',
      },
    };
  }

  /**
   * Gera prompt template para criar roteiros no estilo do criador
   */
  static generatePromptTemplate(
    creatorName: string,
    analysis: CreatorAnalysis
  ): string {
    return `Você é um especialista em criar roteiros de vídeo no estilo de "${creatorName}".

**PERFIL DO CRIADOR:**

**Tom de Voz:**
- Tom predominante: ${analysis.voice_tone.tom_predominante}
- Variação tonal: ${analysis.voice_tone.variacao_tonal}/10
- Velocidade de fala: ${analysis.voice_tone.velocidade_fala}
- Usa pausas dramáticas: ${analysis.voice_tone.pausas_dramaticas ? 'Sim' : 'Não'}
- Palavras com ênfase: ${analysis.voice_tone.enfase_palavras.join(', ')}

**Estilo de Comunicação:**
- Abordagem: ${analysis.communication_style.abordagem}
- Formalidade: ${analysis.communication_style.nivel_formalidade}/10
- Uso de humor: ${analysis.communication_style.uso_humor}/10
- Uso de exemplos: ${analysis.communication_style.uso_exemplos}/10
- Interage com audiência: ${analysis.communication_style.interacao_audiencia ? 'Sim' : 'Não'}
- Usa perguntas retóricas: ${analysis.communication_style.perguntas_retoricas ? 'Sim' : 'Não'}

**Vícios de Linguagem e Bordões:**
${analysis.language_patterns.bordoes.map((b) => `- "${b}"`).join('\n')}

**Conectores Favoritos:**
${analysis.language_patterns.conectores_favoritos.join(', ')}

**Estrutura Narrativa:**
- Abertura: ${analysis.narrative_structure.abertura_tipo}
- Duração típica da intro: ${analysis.narrative_structure.duracao_intro_segundos}s
- Ganchos usados: ${analysis.narrative_structure.uso_ganchos.join(', ')}
- Transições: ${analysis.narrative_structure.transicoes_caracteristicas.join(', ')}
- Fechamento: ${analysis.narrative_structure.fechamento_tipo}
- CTA padrão: ${analysis.narrative_structure.cta_padrao}

**Elementos de Retenção:**
- Cortes rápidos: ${analysis.retention_elements.uso_cortes_rapidos ? 'Sim' : 'Não'}
- Mudanças de ritmo: ${analysis.retention_elements.mudancas_ritmo ? 'Sim' : 'Não'}
- Loops abertos: ${analysis.retention_elements.loops_abertos ? 'Sim' : 'Não'}

**Estratégias de CTR:**
- Padrões de título: ${analysis.ctr_strategies.titulos_padrao.join(' | ')}
- Primeiros segundos: ${analysis.ctr_strategies.primeiros_segundos_estrategia}

---

**INSTRUÇÕES PARA CRIAÇÃO DE ROTEIRO:**

1. **ABERTURA (primeiros 15-30 segundos):**
   - Use um dos bordões característicos
   - Crie gancho forte com pergunta ou afirmação impactante
   - Prometa valor específico
   - Mantenha o tom ${analysis.voice_tone.tom_predominante}

2. **DESENVOLVIMENTO:**
   - Use exemplos práticos e específicos
   - Mantenha ritmo ${analysis.voice_tone.velocidade_fala}
   - Intercale com perguntas retóricas para manter engajamento
   - Use transições naturais como "${analysis.narrative_structure.transicoes_caracteristicas[0]}"

3. **FECHAMENTO:**
   - Resuma pontos principais
   - Use ${analysis.narrative_structure.cta_padrao}
   - Finalize com bordão característico

4. **LINGUAGEM:**
   - Use conectores: ${analysis.language_patterns.conectores_favoritos.slice(0, 3).join(', ')}
   - Incorpore bordões naturalmente
   - Mantenha nível de formalidade ${analysis.communication_style.nivel_formalidade}/10

**AGORA CRIE UM ROTEIRO SOBRE O TEMA:**
[TEMA SERÁ INSERIDO AQUI]

**FORMATO:**
Título sugerido:
Sugestão de thumbnail:
---
[ROTEIRO COMPLETO]
---
Tempo estimado:
Observações:`;
  }
}
