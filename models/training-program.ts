import { type DeliveryMethod, type PaginatedListResponse } from './base';

export interface CreateTrainingProgramRequest {
  coverImage?: string;
  programDetails: string;
  location?: string;
  place: string;
  time: string;
  duration: number;
  deliveryMethod: DeliveryMethod;
  course: string;
}

export interface UpdateTrainingProgramRequest {
  id: string;
  coverImage?: string;
  programDetails: string;
  location?: string;
  place: string;
  time: string;
  duration: number;
  deliveryMethod: DeliveryMethod;
}

export interface DeleteTrainingProgramRequest {
  id: string;
}

export interface TrainingProgram {
  id: string;
  coverImage: string;
  coverImageUrl: string;
  programDetails: string;
  location: string;
  place: string;
  time: string;
  duration: number;
  deliveryMethod: DeliveryMethod;
  course: string;
}

export interface TrainingProgramNode extends TrainingProgram {
  createdAt: string;
}
