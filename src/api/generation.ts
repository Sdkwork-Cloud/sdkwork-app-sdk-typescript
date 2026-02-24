import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  GenerationTaskVO,
  ImageGenerationRequest,
  ImageVariationRequest,
  ImageEditRequest,
  ImageUpscaleRequest,
  VideoGenerationRequest,
  ImageToVideoRequest,
  VideoExtendRequest,
  VideoStyleTransferRequest,
  MusicGenerationRequest,
  MusicExtendRequest,
  MusicRemixRequest,
  MusicSimilarRequest,
  MusicStylesQuery,
  MusicStylesVO,
  AudioTTSRequest,
  AudioTranscriptionRequest,
  AudioTranslationRequest,
  VoiceCloneRequest,
  VoiceListQuery,
  VoiceListVO,
  GenerationModule,
} from '../types/generation';
import type { PageResult } from '../types/common';

export class GenerationApi implements GenerationModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async createImage(request: ImageGenerationRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/image'), request);
  }

  async createImageVariation(request: ImageVariationRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/image/variations'), request);
  }

  async editImage(request: ImageEditRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/image/edits'), request);
  }

  async upscaleImage(request: ImageUpscaleRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/image/upscale'), request);
  }

  async getImageTask(taskId: string): Promise<GenerationTaskVO> {
    return this.client.get<GenerationTaskVO>(appApiPath(`/generation/image/tasks/${taskId}`));
  }

  async listImageTasks(page: number = 1, size: number = 20): Promise<GenerationTaskVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    const result = await this.client.get<PageResult<GenerationTaskVO>>(appApiPath('/generation/image/tasks'), params);
    return result.content;
  }

  async cancelImageTask(taskId: string): Promise<void> {
    await this.client.delete(appApiPath(`/generation/image/tasks/${taskId}`));
  }

  async createVideo(request: VideoGenerationRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/video'), request);
  }

  async imageToVideo(request: ImageToVideoRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/video/image-to-video'), request);
  }

  async extendVideo(request: VideoExtendRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/video/extend'), request);
  }

  async videoStyleTransfer(request: VideoStyleTransferRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/video/style-transfer'), request);
  }

  async getVideoTask(taskId: string): Promise<GenerationTaskVO> {
    return this.client.get<GenerationTaskVO>(appApiPath(`/generation/video/tasks/${taskId}`));
  }

  async listVideoTasks(page: number = 1, size: number = 20): Promise<GenerationTaskVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    const result = await this.client.get<PageResult<GenerationTaskVO>>(appApiPath('/generation/video/tasks'), params);
    return result.content;
  }

  async cancelVideoTask(taskId: string): Promise<void> {
    await this.client.delete(appApiPath(`/generation/video/tasks/${taskId}`));
  }

  async createMusic(request: MusicGenerationRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/music'), request);
  }

  async extendMusic(request: MusicExtendRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/music/extend'), request);
  }

  async remixMusic(request: MusicRemixRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/music/remix'), request);
  }

  async generateSimilarMusic(request: MusicSimilarRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/music/similar'), request);
  }

  async getMusicStyles(query?: MusicStylesQuery): Promise<MusicStylesVO> {
    const params: Record<string, string | number | boolean | undefined> = query ? { category: query.category } : {};
    return this.client.get<MusicStylesVO>(appApiPath('/generation/music/styles'), params);
  }

  async getMusicTask(taskId: string): Promise<GenerationTaskVO> {
    return this.client.get<GenerationTaskVO>(appApiPath(`/generation/music/tasks/${taskId}`));
  }

  async listMusicTasks(page: number = 1, size: number = 20): Promise<GenerationTaskVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    const result = await this.client.get<PageResult<GenerationTaskVO>>(appApiPath('/generation/music/tasks'), params);
    return result.content;
  }

  async cancelMusicTask(taskId: string): Promise<void> {
    await this.client.delete(appApiPath(`/generation/music/tasks/${taskId}`));
  }

  async textToSpeech(request: AudioTTSRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/audio/tts'), request);
  }

  async getVoiceList(query?: VoiceListQuery): Promise<VoiceListVO> {
    const params: Record<string, string | number | boolean | undefined> = query ? { language: query.language } : {};
    return this.client.get<VoiceListVO>(appApiPath('/generation/audio/voices'), params);
  }

  async audioTranscription(request: AudioTranscriptionRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/audio/transcription'), request);
  }

  async getTranscriptionResult(taskId: string): Promise<GenerationTaskVO> {
    return this.client.get<GenerationTaskVO>(appApiPath(`/generation/audio/transcription/${taskId}`));
  }

  async audioTranslation(request: AudioTranslationRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/audio/translation'), request);
  }

  async voiceClone(request: VoiceCloneRequest): Promise<GenerationTaskVO> {
    return this.client.post<GenerationTaskVO>(appApiPath('/generation/audio/voice-clone'), request);
  }

  async getAudioTask(taskId: string): Promise<GenerationTaskVO> {
    return this.client.get<GenerationTaskVO>(appApiPath(`/generation/audio/tasks/${taskId}`));
  }

  async listAudioTasks(page: number = 1, size: number = 20): Promise<GenerationTaskVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    const result = await this.client.get<PageResult<GenerationTaskVO>>(appApiPath('/generation/audio/tasks'), params);
    return result.content;
  }

  async cancelAudioTask(taskId: string): Promise<void> {
    await this.client.delete(appApiPath(`/generation/audio/tasks/${taskId}`));
  }
}

export function createGenerationApi(client: HttpClient): GenerationModule {
  return new GenerationApi(client);
}
