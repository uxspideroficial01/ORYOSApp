// Serviço para transcrição de vídeos do YouTube

export class TranscriptService {
  /**
   * Busca transcrição de um vídeo via Edge Function do Supabase
   */
  static async getTranscript(videoId: string): Promise<{
    text: string;
    language: string;
    segments?: number;
  }> {
    // Em produção, isso seria uma chamada à Edge Function
    // Por agora, retorna mock para desenvolvimento

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    if (!supabaseUrl) {
      // Modo simulação
      return this.getMockTranscript(videoId);
    }

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/get-transcript`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar transcrição');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar transcrição:', error);
      // Fallback para mock em caso de erro
      return this.getMockTranscript(videoId);
    }
  }

  /**
   * Mock de transcrição para desenvolvimento/testes
   */
  private static getMockTranscript(videoId: string): Promise<{
    text: string;
    language: string;
    segments: number;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: `Olá pessoal, tudo bem? Hoje eu vou falar sobre um assunto super importante para quem está começando agora. Vocês sabem que eu sempre trago conteúdos práticos e diretos ao ponto, então bora lá! Primeira coisa que vocês precisam entender é que isso aqui não é complicado, é só seguir o passo a passo que eu vou mostrar. Muita gente fica com medo de começar, mas eu garanto que se você prestar atenção e aplicar tudo certinho, vai dar super certo. Então cola aqui comigo até o final que vai valer muito a pena! E não esquece de deixar aquele like, se inscrever no canal e ativar o sininho pra não perder nenhum conteúdo novo. Vamos nessa!`,
          language: 'pt',
          segments: 150,
        });
      }, 1500);
    });
  }

  /**
   * Extrai ID do vídeo de uma URL do YouTube
   */
  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    // Se já for um ID válido (11 caracteres)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }

    return null;
  }
}
