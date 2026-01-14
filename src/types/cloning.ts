// Tipos para sistema de clonagem de criadores

export interface Video {
  id: string;
  video_id: string;
  url: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  duration?: number;
  view_count?: number;
  published_at?: string;
  transcript?: string;
  transcript_language?: string;
  status: 'empty' | 'loading' | 'transcribing' | 'ready' | 'error';
  error?: string;
}

export interface CreatorAnalysis {
  // Tom de voz
  voice_tone: {
    tom_predominante: 'energético' | 'calmo' | 'profissional' | 'descontraído' | 'inspirador';
    variacao_tonal: number; // 0-10
    velocidade_fala: 'rápido' | 'moderado' | 'devagar';
    pausas_dramaticas: boolean;
    enfase_palavras: string[];
  };

  // Trejeitos e estilo
  style_quirks: {
    expressoes_faciais?: string[];
    gestos_caracteristicos?: string[];
    maneirismos_verbais: string[];
    interacoes_camera: string[];
  };

  // Estilo de comunicação
  communication_style: {
    abordagem: 'direto ao ponto' | 'storytelling' | 'educacional' | 'entretenimento';
    nivel_formalidade: number; // 0-10
    uso_humor: number; // 0-10
    uso_exemplos: number; // 0-10
    interacao_audiencia: boolean;
    perguntas_retoricas: boolean;
  };

  // Vícios de linguagem
  language_patterns: {
    palavras_repeticao: Array<{
      palavra: string;
      frequencia: number;
    }>;
    conectores_favoritos: string[];
    girias_regionalismos: string[];
    bordoes: string[];
  };

  // Estrutura narrativa
  narrative_structure: {
    abertura_tipo: string;
    duracao_intro_segundos: number;
    uso_ganchos: string[];
    transicoes_caracteristicas: string[];
    fechamento_tipo: string;
    cta_padrao: string;
  };

  // Elementos de retenção
  retention_elements: {
    uso_cortes_rapidos: boolean;
    mudancas_ritmo: boolean;
    elementos_surpresa: string[];
    loops_abertos: boolean;
    teasers_conteudo: boolean;
  };

  // Estratégias de CTR
  ctr_strategies: {
    titulos_padrao: string[];
    thumbnails_estilo: string;
    primeiros_segundos_estrategia: string;
  };
}

export interface ClonedCreator {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  channel_id: string;
  channel_name: string;
  channel_url: string;
  avatar_url?: string;

  // Vídeos usados para análise
  video_ids: string[];
  total_videos: number;

  // Análise consolidada
  analysis: CreatorAnalysis;

  // Prompt template específico deste creator
  prompt_template: string;

  created_at: string;
  updated_at: string;
}

export interface ScriptGenerationRequest {
  creator_id: string;
  topic: string;
  format?: 'youtube_short' | 'youtube_long' | 'tiktok' | 'instagram_reel';
  duration_target?: number; // em segundos
  additional_instructions?: string;
}

export interface GeneratedScript {
  id: string;
  user_id: string;
  creator_id: string;
  topic: string;
  format: string;

  // Roteiro gerado
  script: {
    titulo_sugerido: string;
    thumbnail_sugestao: string;
    hook: string;
    intro: string;
    desenvolvimento: string[];
    conclusao: string;
    cta: string;
  };

  // Metadados
  estimated_duration_seconds: number;
  word_count: number;

  created_at: string;
}

export interface CloningJob {
  id: string;
  user_id: string;
  type: 'creator_analysis' | 'script_generation';
  status: 'queued' | 'processing' | 'completed' | 'failed';

  config: {
    creator_name?: string;
    video_urls?: string[];
    topic?: string;
  };

  progress: number; // 0-100
  current_step?: string;

  result?: any;
  error_message?: string;

  created_at: string;
  started_at?: string;
  completed_at?: string;
}
