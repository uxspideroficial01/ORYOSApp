// Serviço para integração com YouTube Data API v3

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export class YouTubeService {
  /**
   * Extrai o Channel ID ou handle de uma URL do YouTube
   */
  static extractChannelIdentifier(url: string): string | null {
    const patterns = [
      /youtube\.com\/channel\/([\w-]+)/,
      /youtube\.com\/@([\w-]+)/,
      /youtube\.com\/c\/([\w-]+)/,
      /youtube\.com\/user\/([\w-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  /**
   * Busca informações do canal
   */
  static async getChannelInfo(channelIdOrHandle: string) {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API Key não configurada');
    }

    let url: string;

    if (channelIdOrHandle.startsWith('UC')) {
      url = `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelIdOrHandle}&key=${YOUTUBE_API_KEY}`;
    } else {
      const handle = channelIdOrHandle.startsWith('@') ? channelIdOrHandle : `@${channelIdOrHandle}`;
      url = `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&forHandle=${handle}&key=${YOUTUBE_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('Canal não encontrado');
    }

    const channel = data.items[0];
    return {
      id: channel.id,
      name: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: parseInt(channel.statistics.subscriberCount),
      videoCount: parseInt(channel.statistics.videoCount),
      thumbnailUrl: channel.snippet.thumbnails.high.url,
    };
  }

  /**
   * Busca vídeos recentes do canal
   */
  static async getChannelVideos(channelId: string, maxResults: number = 5) {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API Key não configurada');
    }

    const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId);
    const detailsUrl = `${YOUTUBE_API_BASE}/videos?part=contentDetails,statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    return searchData.items.map((item: any, index: number) => {
      const details = detailsData.items[index];
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        duration: this.parseDuration(details.contentDetails.duration),
        viewCount: parseInt(details.statistics.viewCount),
      };
    });
  }

  /**
   * Converte duração ISO 8601 para segundos
   */
  private static parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    return hours * 3600 + minutes * 60 + seconds;
  }
}
