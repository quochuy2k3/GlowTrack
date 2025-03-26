import { type PaginatedListResponse } from './base';

export interface CreateLearningObjectiveRequest {
  title: string;
  description: string;
}

export interface UpdateLearningObjectiveRequest {
  id: string;
  title: string;
  description: string;
}

export interface DeleteLearningObjectiveRequest {
  id: string;
}

export interface LearningObjective {
  id: string;
  title: string;
  description: string;
}

export interface LearningObjectiveNode {
  id: string;
  title: string;
}
