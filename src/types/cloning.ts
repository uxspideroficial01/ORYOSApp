// Tipos para sistema de clonagem de criadores - ORYOS
// Baseado no Framework de 4 Camadas (CTR + Retencao + Linguagem + Frankenstein)

// ============================================
// TIPOS DO YOUTUBE
// ============================================

export interface YouTubeChannel {
  id: string;
  name: string;
  url: string;
  avatar_url?: string;
  subscriber_count: number;
}

export interface YouTubeVideo {
  video_id: string;
  title: string;
  url: string;
  thumbnail_url?: string;
  duration_seconds: number;
  view_count: number;
  published_at: string;
}

// ============================================
// TIPOS DE VIDEO (para UI)
// ============================================

export interface Video {
  id: string;
  video_id: string;
  url: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  view_count?: number;
  published_at?: string;
  transcript?: string;
  transcript_language?: string;
  word_count?: number;
  status: 'empty' | 'loading' | 'transcribing' | 'ready' | 'error';
  error?: string;
}

// ============================================
// FRAMEWORK DE 4 CAMADAS - ANALISE
// ============================================

export interface CTRTextualAnalysis {
  primeiro_gancho_tipo:
    | 'afirmacao_contraintuitiva'
    | 'acusacao_implicita'
    | 'promessa_incompleta'
    | 'confissao'
    | 'pergunta_existencial';
  exemplos_ganchos: string[];
  tempo_ate_conflito: 'imediato' | '1-2_frases' | '3-5_frases' | 'mais_de_5';
  assimetria_informacao: {
    usa: boolean;
    exemplos: string[];
  };
}

export interface RetencaoEstruturalAnalysis {
  tipo_loop: 'explicito' | 'implicito' | 'misto';
  exemplos_loops: string[];
  frequencia_micro_recompensa: 'muito_alta' | 'alta' | 'media' | 'baixa';
  tipos_micro_recompensa: string[];
  alternancia_cognitiva: {
    padroes: string[];
    exemplos: string[];
  };
  escalada_complexidade: 'forte' | 'moderada' | 'baixa' | 'nenhuma';
}

export interface LinguagemAnalysis {
  friccao_controlada: {
    nivel: 'alta' | 'media' | 'baixa';
    exemplos: string[];
  };
  direcionamento_atencao: {
    usa: boolean;
    frases_tipicas: string[];
  };
  economia_verbal: 'excelente' | 'boa' | 'moderada' | 'baixa';
  densidade_informacional: 'muito_alta' | 'alta' | 'media' | 'baixa';
}

export interface FuncoesRoteiroAnalysis {
  abrir_tensao: string;
  instalar_risco: string;
  manter_curiosidade: string;
  micro_payoff: string;
  elevar_apostas: string;
  resolver_transformar: string;
}

export interface AssinaturaEstilo {
  palavras_chave: string[]; // Ex: ["Velocidade", "Sarcasmo", "Densidade"]
  tom_predominante: string;
  formato_preferido: string;
  elementos_unicos: string[];
}

export interface PadroesLinguagem {
  palavras_frequentes: Array<{ palavra: string; frequencia: number }>;
  expressoes_tipicas: string[];
  conectores_favoritos: string[];
  bordoes: string[];
}

export interface EstruturaTipica {
  abertura: string;
  desenvolvimento: string;
  fechamento: string;
  duracao_media_minutos: number;
}

// Analise completa do creator (4 camadas)
export interface CreatorStyleAnalysis {
  creator_name: string;
  videos_analyzed: number;
  analysis_date: string;

  // Camada 1: CTR Textual
  ctr_textual: CTRTextualAnalysis;

  // Camada 2: Retencao Estrutural
  retencao_estrutural: RetencaoEstruturalAnalysis;

  // Camada 3: Linguagem
  linguagem: LinguagemAnalysis;

  // Camada 4: Funcoes do Roteiro (Frankenstein)
  funcoes_roteiro: FuncoesRoteiroAnalysis;

  // Meta-analise
  assinatura: AssinaturaEstilo;
  padroes_linguagem: PadroesLinguagem;
  estrutura_tipica: EstruturaTipica;
}

// ============================================
// TIPOS DO BANCO DE DADOS
// ============================================

export interface Creator {
  id: string;
  user_id: string;
  channel_id: string;
  channel_name: string;
  channel_url: string;
  avatar_url?: string;
  subscriber_count: number;
  style_name: string;
  video_ids: string[];
  total_videos_analyzed: number;
  analysis: CreatorStyleAnalysis;
  prompt_template: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorVideo {
  id: string;
  creator_id: string;
  video_id: string;
  title?: string;
  url: string;
  thumbnail_url?: string;
  duration_seconds: number;
  view_count: number;
  published_at?: string;
  transcript?: string;
  transcript_language: string;
  word_count: number;
  status: 'pending' | 'transcribing' | 'ready' | 'error';
  error_message?: string;
  created_at: string;
}

export interface GeneratedScript {
  id: string;
  user_id: string;
  creator_id?: string;
  topic: string;
  format: 'youtube_long' | 'youtube_short' | 'reels' | 'twitter_thread';
  word_count_target?: number;
  additional_instructions?: string;
  title_suggestion?: string;
  hook?: string;
  script_content: string;
  thumbnail_ideas: string[];
  actual_word_count: number;
  estimated_duration_seconds: number;
  rating?: number;
  is_favorite: boolean;
  created_at: string;
}

export interface AnalysisJob {
  id: string;
  user_id: string;
  type: 'channel_analysis' | 'script_generation' | 'batch_transcript';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  config: Record<string, unknown>;
  progress: number;
  current_step?: string;
  total_steps: number;
  result?: Record<string, unknown>;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface UserUsage {
  id: string;
  user_id: string;
  analyses_this_month: number;
  scripts_this_month: number;
  transcripts_this_month: number;
  current_period_start: string;
  max_analyses_per_month: number;
  max_scripts_per_month: number;
  max_creators_saved: number;
  plan: 'free' | 'pro' | 'business';
  plan_expires_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// TIPOS DE REQUEST/RESPONSE DAS EDGE FUNCTIONS
// ============================================

// fetch-channel-videos
export interface FetchChannelRequest {
  channel_url: string;
  max_videos?: number;
}

export interface FetchChannelResponse {
  success: boolean;
  channel: YouTubeChannel;
  videos: YouTubeVideo[];
  total_videos: number;
}

// extract-transcript
export interface ExtractTranscriptRequest {
  video_url?: string;
  video_id?: string;
  video_urls?: string[];
  video_ids?: string[];
  include_metadata?: boolean;
}

export interface TranscriptResult {
  success: boolean;
  video_id: string;
  title?: string;
  channel?: string;
  thumbnail?: string;
  transcript: string;
  word_count: number;
  language?: string;
}

export interface ExtractTranscriptResponse {
  success: boolean;
  total_requested?: number;
  total_success?: number;
  total_errors?: number;
  results?: TranscriptResult[];
  errors?: Array<{ video_id: string; error: string }>;
  // Single video response
  video_id?: string;
  transcript?: string;
  word_count?: number;
}

// analyze-creator
export interface AnalyzeCreatorRequest {
  creator_name: string;
  transcripts: string[];
}

export interface AnalyzeCreatorResponse {
  success: boolean;
  analysis: CreatorStyleAnalysis;
  prompt_template: string;
}

// generate-script
export interface GenerateScriptRequest {
  topic: string;
  prompt_template: string;
  format?: 'youtube_long' | 'youtube_short' | 'reels' | 'twitter_thread';
  word_count?: number;
  additional_instructions?: string;
  language?: 'pt-BR' | 'en';
}

export interface GenerateScriptResponse {
  success: boolean;
  script: {
    title_suggestion: string;
    hook: string;
    script_content: string;
    thumbnail_ideas: string[];
    estimated_duration_seconds: number;
    actual_word_count: number;
  };
  format: string;
  requested_word_count: number;
}

// ============================================
// TIPOS PARA UI/STATE
// ============================================

export interface CloningState {
  step: 'input' | 'selecting' | 'analyzing' | 'complete' | 'error';
  channel?: YouTubeChannel;
  videos: YouTubeVideo[];
  selectedVideoIds: string[];
  styleName: string;
  transcripts: Map<string, string>;
  analysis?: CreatorStyleAnalysis;
  promptTemplate?: string;
  error?: string;
  progress: {
    current: number;
    total: number;
    message: string;
  };
}

export interface ScriptGeneratorState {
  selectedCreatorId?: string;
  topic: string;
  format: 'youtube_long' | 'youtube_short' | 'reels' | 'twitter_thread';
  wordCount: number;
  additionalInstructions: string;
  isGenerating: boolean;
  generatedScript?: GenerateScriptResponse['script'];
  error?: string;
}

// ============================================
// CONSTANTES
// ============================================

export const FORMAT_OPTIONS = {
  youtube_long: {
    label: 'YouTube Longo',
    description: '6-15 minutos',
    minWords: 800,
    maxWords: 2500,
    defaultWords: 1200,
  },
  youtube_short: {
    label: 'YouTube Shorts',
    description: 'Ate 60 segundos',
    minWords: 100,
    maxWords: 250,
    defaultWords: 150,
  },
  reels: {
    label: 'Reels/TikTok',
    description: '30-60 segundos',
    minWords: 80,
    maxWords: 200,
    defaultWords: 120,
  },
  twitter_thread: {
    label: 'Thread Twitter',
    description: '8-15 tweets',
    minWords: 400,
    maxWords: 1000,
    defaultWords: 600,
  },
} as const;

export const PLAN_LIMITS = {
  free: {
    analyses_per_month: 1,
    scripts_per_month: 5,
    creators_saved: 1,
  },
  pro: {
    analyses_per_month: 10,
    scripts_per_month: 100,
    creators_saved: 20,
  },
  business: {
    analyses_per_month: -1, // ilimitado
    scripts_per_month: -1,
    creators_saved: -1,
  },
} as const;
