export type ImageSourceType = 'external' | 'uploaded';

export interface EntityImage {
  ext: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  isMain: boolean;
  sourceType: ImageSourceType;
  created: string;
}

export interface EntityImageList {
  images: EntityImage[];
}

export interface GameImageQuota {
  maxBytes: number;
  usedBytes: number;
  reservedBytes: number;
  maxFileBytes: number;
  maxImages: number;
  uploadEnabled: boolean;
}
