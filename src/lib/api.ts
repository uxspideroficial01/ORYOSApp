// src/lib/api.ts
// Cliente de API para as Edge Functions do ORYOS

import { supabase } from './supabase';
import type {
  FetchChannelRequest,
  FetchChannelResponse,
  ExtractTranscriptRequest,
  ExtractTranscriptResponse,
  AnalyzeCreatorRequest,
  AnalyzeCreatorResponse,
  GenerateScriptRequest,
  GenerateScriptResponse,
  Creator,
  GeneratedScript,
  UserUsage,
} from '../types/cloning';

// ============================================
// CONFIGURACAO
// ============================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

async function callEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });

  if (error) {
    throw new Error(error.message || `Erro ao chamar ${functionName}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as T;
}

// ============================================
// YOUTUBE / CANAL
// ============================================

export async function fetchChannelVideos(
  channelUrl: string,
  maxVideos: number = 20
): Promise<FetchChannelResponse> {
  return callEdgeFunction<FetchChannelResponse>('fetch-channel-videos', {
    channel_url: channelUrl,
    max_videos: maxVideos,
  });
}

// ============================================
// TRANSCRICAO
// ============================================

export async function extractTranscript(
  videoId: string
): Promise<ExtractTranscriptResponse> {
  return callEdgeFunction<ExtractTranscriptResponse>('extract-transcript', {
    video_id: videoId,
  });
}

export async function extractMultipleTranscripts(
  videoIds: string[]
): Promise<ExtractTranscriptResponse> {
  return callEdgeFunction<ExtractTranscriptResponse>('extract-transcript', {
    video_ids: videoIds,
  });
}

// ============================================
// ANALISE DE CREATOR
// ============================================

export async function analyzeCreator(
  creatorName: string,
  transcripts: string[]
): Promise<AnalyzeCreatorResponse> {
  return callEdgeFunction<AnalyzeCreatorResponse>('analyze-creator', {
    creator_name: creatorName,
    transcripts,
  });
}

// ============================================
// GERACAO DE ROTEIRO
// ============================================

export async function generateScript(
  request: GenerateScriptRequest
): Promise<GenerateScriptResponse> {
  return callEdgeFunction<GenerateScriptResponse>('generate-script', request);
}

// ============================================
// CRUD - CREATORS (Estilos Salvos)
// ============================================

export async function getCreators(): Promise<Creator[]> {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCreator(id: string): Promise<Creator | null> {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(error.message);
  }
  return data;
}

export async function saveCreator(creator: Omit<Creator, 'id' | 'created_at' | 'updated_at'>): Promise<Creator> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario nao autenticado');

  const { data, error } = await supabase
    .from('creators')
    .insert({
      ...creator,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCreator(
  id: string,
  updates: Partial<Creator>
): Promise<Creator> {
  const { data, error } = await supabase
    .from('creators')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCreator(id: string): Promise<void> {
  const { error } = await supabase
    .from('creators')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ============================================
// CRUD - ROTEIROS GERADOS
// ============================================

export async function getGeneratedScripts(limit: number = 50): Promise<GeneratedScript[]> {
  const { data, error } = await supabase
    .from('generated_scripts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getGeneratedScript(id: string): Promise<GeneratedScript | null> {
  const { data, error } = await supabase
    .from('generated_scripts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
}

export async function saveGeneratedScript(
  script: Omit<GeneratedScript, 'id' | 'user_id' | 'created_at'>
): Promise<GeneratedScript> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario nao autenticado');

  const { data, error } = await supabase
    .from('generated_scripts')
    .insert({
      ...script,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateGeneratedScript(
  id: string,
  updates: Partial<GeneratedScript>
): Promise<GeneratedScript> {
  const { data, error } = await supabase
    .from('generated_scripts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteGeneratedScript(id: string): Promise<void> {
  const { error } = await supabase
    .from('generated_scripts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function toggleScriptFavorite(id: string, isFavorite: boolean): Promise<void> {
  const { error } = await supabase
    .from('generated_scripts')
    .update({ is_favorite: isFavorite })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function rateScript(id: string, rating: number): Promise<void> {
  const { error } = await supabase
    .from('generated_scripts')
    .update({ rating })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ============================================
// USAGE / LIMITES
// ============================================

export async function getUserUsage(): Promise<UserUsage | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
}

export async function incrementUsage(
  type: 'analyses' | 'scripts' | 'transcripts'
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario nao autenticado');

  const columnMap = {
    analyses: 'analyses_this_month',
    scripts: 'scripts_this_month',
    transcripts: 'transcripts_this_month',
  };

  const column = columnMap[type];

  // Usar RPC para incrementar atomicamente
  const { error } = await supabase.rpc('increment_usage', {
    user_id_param: user.id,
    column_name: column,
  });

  // Se a funcao nao existir, fazer update manual
  if (error) {
    const usage = await getUserUsage();
    if (usage) {
      await supabase
        .from('user_usage')
        .update({ [column]: (usage as any)[column] + 1 })
        .eq('user_id', user.id);
    }
  }
}

export async function checkUsageLimit(
  type: 'analyses' | 'scripts' | 'creators'
): Promise<{ allowed: boolean; current: number; max: number }> {
  const usage = await getUserUsage();
  if (!usage) {
    return { allowed: true, current: 0, max: 1 };
  }

  const limits = {
    analyses: {
      current: usage.analyses_this_month,
      max: usage.max_analyses_per_month,
    },
    scripts: {
      current: usage.scripts_this_month,
      max: usage.max_scripts_per_month,
    },
    creators: {
      current: 0, // Precisa contar da tabela creators
      max: usage.max_creators_saved,
    },
  };

  // Se for creators, contar quantos ja tem
  if (type === 'creators') {
    const creators = await getCreators();
    limits.creators.current = creators.length;
  }

  const limit = limits[type];
  const allowed = limit.max === -1 || limit.current < limit.max;

  return {
    allowed,
    current: limit.current,
    max: limit.max,
  };
}

// ============================================
// FLUXO COMPLETO DE CLONAGEM
// ============================================

export interface CloneCreatorOptions {
  channelUrl: string;
  selectedVideoIds: string[];
  styleName: string;
  onProgress?: (step: string, progress: number) => void;
}

export async function cloneCreatorStyle(
  options: CloneCreatorOptions
): Promise<Creator> {
  const { channelUrl, selectedVideoIds, styleName, onProgress } = options;

  // 1. Verificar limite
  const limitCheck = await checkUsageLimit('analyses');
  if (!limitCheck.allowed) {
    throw new Error(
      `Limite de analises atingido (${limitCheck.current}/${limitCheck.max}). Faca upgrade do plano.`
    );
  }

  onProgress?.('Buscando informacoes do canal...', 10);

  // 2. Buscar info do canal
  const channelData = await fetchChannelVideos(channelUrl, 1);

  onProgress?.('Extraindo transcricoes...', 20);

  // 3. Extrair transcricoes
  const transcriptData = await extractMultipleTranscripts(selectedVideoIds);

  if (!transcriptData.results || transcriptData.results.length === 0) {
    throw new Error('Nao foi possivel extrair transcricoes dos videos selecionados');
  }

  const transcripts = transcriptData.results
    .filter(r => r.success && r.transcript)
    .map(r => r.transcript);

  if (transcripts.length < 3) {
    throw new Error('Minimo de 3 transcricoes necessarias para analise');
  }

  onProgress?.('Analisando estilo do creator...', 50);

  // 4. Analisar com IA
  const analysisData = await analyzeCreator(channelData.channel.name, transcripts);

  onProgress?.('Salvando estilo...', 90);

  // 5. Salvar no banco
  const creator = await saveCreator({
    channel_id: channelData.channel.id,
    channel_name: channelData.channel.name,
    channel_url: channelData.channel.url,
    avatar_url: channelData.channel.avatar_url,
    subscriber_count: channelData.channel.subscriber_count,
    style_name: styleName,
    video_ids: selectedVideoIds,
    total_videos_analyzed: transcripts.length,
    analysis: analysisData.analysis,
    prompt_template: analysisData.prompt_template,
  });

  // 6. Incrementar uso
  await incrementUsage('analyses');

  onProgress?.('Concluido!', 100);

  return creator;
}

// ============================================
// FLUXO DE GERACAO DE ROTEIRO
// ============================================

export interface GenerateScriptWithCreatorOptions {
  creatorId: string;
  topic: string;
  format?: 'youtube_long' | 'youtube_short' | 'reels' | 'twitter_thread';
  wordCount?: number;
  additionalInstructions?: string;
}

export async function generateScriptWithCreator(
  options: GenerateScriptWithCreatorOptions
): Promise<GeneratedScript> {
  const { creatorId, topic, format = 'youtube_long', wordCount, additionalInstructions } = options;

  // 1. Verificar limite
  const limitCheck = await checkUsageLimit('scripts');
  if (!limitCheck.allowed) {
    throw new Error(
      `Limite de roteiros atingido (${limitCheck.current}/${limitCheck.max}). Faca upgrade do plano.`
    );
  }

  // 2. Buscar creator
  const creator = await getCreator(creatorId);
  if (!creator) {
    throw new Error('Estilo nao encontrado');
  }

  // 3. Gerar roteiro
  const scriptData = await generateScript({
    topic,
    prompt_template: creator.prompt_template,
    format,
    word_count: wordCount,
    additional_instructions: additionalInstructions,
  });

  // 4. Salvar no banco
  const savedScript = await saveGeneratedScript({
    creator_id: creatorId,
    topic,
    format,
    word_count_target: wordCount,
    additional_instructions: additionalInstructions,
    title_suggestion: scriptData.script.title_suggestion,
    hook: scriptData.script.hook,
    script_content: scriptData.script.script_content,
    thumbnail_ideas: scriptData.script.thumbnail_ideas,
    actual_word_count: scriptData.script.actual_word_count,
    estimated_duration_seconds: scriptData.script.estimated_duration_seconds,
    is_favorite: false,
  });

  // 5. Incrementar uso
  await incrementUsage('scripts');

  return savedScript;
}
