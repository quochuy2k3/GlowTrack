import { type MediaType, type PaginatedListResponse } from './base';

export interface Media {
  id: string;
  name: string;
  type: MediaType;
  usageCount: number;
  thumb: string;
  thumbUrl: string;
  source: string;
  createdAt: string;
}

export interface MediaNode {
  id: string;
  name: string;
  type: object;
  usageCount: number;
  thumb: string;
  thumbUrl: string;
  source: string;
  createdAt: string;
}

export interface UploadVideoRequest {
  fileSize: number;
}

export interface UploadVideo {
  videoId: string;
  uploadLink: string;
  fileSize: number;
}
