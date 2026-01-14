// Tipos para análise de canais do YouTube

export interface Channel {
  id: string;
  user_id: string;
  channel_id: string;
  channel_name: string;
  channel_url: string;
  subscriber_count?: number;
  video_count?: number;
  description?: string;
  thumbnail_url?: string;
  added_at: string;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
}

export interface VideoAnalysis {
  id: string;
  video_id: string;
  channel_id: string;

  structure: {
    intro: {
      duration_seconds: number;
      hook_type: string;
      elements: string[];
    };
    desenvolvimento: {
      sections: Array<{
        topic: string;
        duration_seconds: number;
        techniques: string[];
      }>;
    };
    conclusao: {
      duration_seconds: number;
      cta_type: string;
      elements: string[];
    };
    total_duration_seconds: number;
  };

  tone_analysis: {
    tom_geral: 'formal' | 'informal' | 'conversacional' | 'profissional' | 'divertido';
    formalidade: number; // 0-10
    energia: number; // 0-10
    emocional: number; // 0-10
    tecnico: number; // 0-10
    linguagem_caracteristica: string[];
  };

  patterns: {
    duracao_media_intro_segundos: number;
    duracao_media_desenvolvimento_segundos: number;
    duracao_media_conclusao_segundos: number;
    usa_storytelling: boolean;
    frequencia_exemplos: number; // 0-10
    uso_de_dados_estatisticas: boolean;
    formato_predominante: string;
  };

  narrative_elements: {
    hooks: Array<{
      tipo: string;
      exemplo: string;
    }>;
    transicoes: string[];
    calls_to_action: Array<{
      momento: string;
      tipo: string;
      exemplo: string;
    }>;
    elementos_retencao: string[];
  };

  techniques: {
    uso_de_perguntas_retoricas: boolean;
    storytelling_pessoal: boolean;
    analogias_metaforas: string[];
    repeticao_enfase: boolean;
    uso_de_listas: boolean;
    contraste_comparacao: boolean;
    surpresa_revelacao: boolean;
  };

  analyzed_at: string;
  analysis_model: string;
}

export interface HybridModel {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  channel_ids: string[];

  hybrid_structure: VideoAnalysis['structure'];
  hybrid_tone: VideoAnalysis['tone_analysis'];
  hybrid_patterns: VideoAnalysis['patterns'];
  hybrid_techniques: VideoAnalysis['techniques'];

  prompt_template: string;
  total_videos_analyzed: number;
  total_channels: number;
  created_at: string;
  updated_at: string;
}

export interface AnalysisJob {
  id: string;
  user_id: string;
  type: 'channel_analysis' | 'model_generation';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  config: {
    channel_ids?: string[];
    videos_per_channel?: number;
    model_name?: string;
  };
  progress: number; // 0-100
  current_step?: string;
  result?: any;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}
