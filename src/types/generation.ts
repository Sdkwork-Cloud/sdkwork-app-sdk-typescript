export interface GenerationTaskVO {
  id: string;
  type: string;
  status: string;
  progress?: number;
  prompt?: string;
  model?: string;
  resultUrl?: string;
  resultUrls?: string[];
  createdAt?: string;
  completedAt?: string;
  error?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  numImages?: number;
  style?: string;
  quality?: string;
  responseFormat?: string;
}

export interface ImageVariationRequest {
  sourceImage: string;
  numImages?: number;
  size?: string;
}

export interface ImageEditRequest {
  sourceImage: string;
  mask?: string;
  prompt: string;
  numImages?: number;
  size?: string;
}

export interface ImageUpscaleRequest {
  sourceImage: string;
  scale?: number;
}

export interface VideoGenerationRequest {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  duration?: number;
  fps?: number;
  format?: string;
  style?: string;
  aspectRatio?: string;
  motionStrength?: number;
  cameraMotion?: string;
  loop?: boolean;
  hd?: boolean;
  audioUrls?: string[];
}

export interface ImageToVideoRequest {
  imageUrl: string;
  model?: string;
  duration?: number;
}

export interface VideoExtendRequest {
  videoUrl: string;
  extendDuration?: number;
}

export interface VideoStyleTransferRequest {
  videoUrl: string;
  style: string;
  model?: string;
}

export interface MusicGenerationRequest {
  prompt: string;
  model?: string;
  lyrics?: string;
  duration?: number;
  genre?: string;
  style?: string;
  tempo?: number;
  key?: string;
  mood?: string;
  instruments?: string;
  format?: string;
}

export interface MusicExtendRequest {
  musicUrl: string;
  extendDuration?: number;
}

export interface MusicRemixRequest {
  musicUrl: string;
  style?: string;
}

export interface MusicSimilarRequest {
  referenceUrl: string;
  prompt?: string;
}

export interface MusicStylesQuery {
  category?: string;
}

export interface MusicStylesVO {
  styles: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

export interface AudioTTSRequest {
  text: string;
  model?: string;
  voice?: string;
  language?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  format?: string;
  emotion?: string;
}

export interface AudioTranscriptionRequest {
  audioUrl: string;
  model?: string;
  language?: string;
}

export interface AudioTranslationRequest {
  audioUrl: string;
  targetLanguage: string;
  model?: string;
}

export interface VoiceCloneRequest {
  sampleAudioUrl: string;
  name?: string;
}

export interface VoiceListQuery {
  language?: string;
}

export interface VoiceListVO {
  voices: Array<{
    id: string;
    name: string;
    language: string;
    gender?: string;
    previewUrl?: string;
  }>;
}

export interface GenerationModule {
  createImage(request: ImageGenerationRequest): Promise<GenerationTaskVO>;
  createImageVariation(request: ImageVariationRequest): Promise<GenerationTaskVO>;
  editImage(request: ImageEditRequest): Promise<GenerationTaskVO>;
  upscaleImage(request: ImageUpscaleRequest): Promise<GenerationTaskVO>;
  getImageTask(taskId: string): Promise<GenerationTaskVO>;
  listImageTasks(page?: number, size?: number): Promise<GenerationTaskVO[]>;
  cancelImageTask(taskId: string): Promise<void>;
  createVideo(request: VideoGenerationRequest): Promise<GenerationTaskVO>;
  imageToVideo(request: ImageToVideoRequest): Promise<GenerationTaskVO>;
  extendVideo(request: VideoExtendRequest): Promise<GenerationTaskVO>;
  videoStyleTransfer(request: VideoStyleTransferRequest): Promise<GenerationTaskVO>;
  getVideoTask(taskId: string): Promise<GenerationTaskVO>;
  listVideoTasks(page?: number, size?: number): Promise<GenerationTaskVO[]>;
  cancelVideoTask(taskId: string): Promise<void>;
  createMusic(request: MusicGenerationRequest): Promise<GenerationTaskVO>;
  extendMusic(request: MusicExtendRequest): Promise<GenerationTaskVO>;
  remixMusic(request: MusicRemixRequest): Promise<GenerationTaskVO>;
  generateSimilarMusic(request: MusicSimilarRequest): Promise<GenerationTaskVO>;
  getMusicStyles(query?: MusicStylesQuery): Promise<MusicStylesVO>;
  getMusicTask(taskId: string): Promise<GenerationTaskVO>;
  listMusicTasks(page?: number, size?: number): Promise<GenerationTaskVO[]>;
  cancelMusicTask(taskId: string): Promise<void>;
  textToSpeech(request: AudioTTSRequest): Promise<GenerationTaskVO>;
  getVoiceList(query?: VoiceListQuery): Promise<VoiceListVO>;
  audioTranscription(request: AudioTranscriptionRequest): Promise<GenerationTaskVO>;
  getTranscriptionResult(taskId: string): Promise<GenerationTaskVO>;
  audioTranslation(request: AudioTranslationRequest): Promise<GenerationTaskVO>;
  voiceClone(request: VoiceCloneRequest): Promise<GenerationTaskVO>;
  getAudioTask(taskId: string): Promise<GenerationTaskVO>;
  listAudioTasks(page?: number, size?: number): Promise<GenerationTaskVO[]>;
  cancelAudioTask(taskId: string): Promise<void>;
}
