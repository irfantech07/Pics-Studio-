export type ImageStyle = 'minimal' | 'luxury' | 'tech' | 'soft' | 'premium' | 'outdoor' | 'studio';

export interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  config: ProcessingConfig;
}

export interface ProcessingConfig {
  style: ImageStyle;
  aspectRatio: '1:1' | '4:5' | '16:9';
  resolution: number;
  brightness: number;
  contrast: number;
  sharpness: number;
}
