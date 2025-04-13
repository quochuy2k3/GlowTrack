import { type PaginatedListResponse } from './base';

export interface CreateProgramSourceRequest {
  name: string;
  description?: string;
}

export interface UpdateProgramSourceRequest {
  id: string;
  name?: string;
  description?: string;
}

export interface DeleteProgramSourceRequest {
  id: string;
}

export interface ProgramSource {
  id: string;
  name: string;
  description: string;
}
