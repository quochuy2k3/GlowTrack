import type {
  DeliveryMethod,
  Department,
  ExaminationTerm,
  PaginatedListResponse,
  Skill,
  TargetLearnerRequest,
  User,
} from './base';

export interface CreateExaminationRequest {
  title: string;
  coverImage?: string;
  description: string;
  targetLearners?: TargetLearnerRequest[];
  duration?: number;
  skills: string[];
  regulation?: string;
  deliveryMethod?: DeliveryMethod;
  examinationTerm?: ExaminationTerm;
  passGrade?: number;
  isActive?: boolean;
}

export interface UpdateExaminationRequest {
  id: string;
  title?: string;
  coverImage?: string;
  description?: string;
  targetLearners?: TargetLearnerRequest[];
  duration?: number;
  skills: string[];
  regulation?: string;
  deliveryMethod?: DeliveryMethod;
  examinationTerm?: ExaminationTerm;
  passGrade?: number;
  isActive?: boolean;
}

export interface UpdateMultipleExaminationRequest {
  listId: string[];
  isActive: boolean;
}

export interface DeleteExaminationRequest {
  id: string;
}

export interface Examination {
  id: string;
  title: string;
  coverImage: string;
  coverImageUrl: string;
  description: string;
  creator: string;
  creatorObj: User;
  duration: number;
  skills: string[];
  skillsObj: Skill[];
  regulation: string;
  deliveryMethod: DeliveryMethod;
  examinationTerm: ExaminationTerm;
  targetLearnersObj: (Department | User)[];
  participantsObj: User[];
  totalParticipants: number;
  passGrade: number;
  isActive: boolean;
  createdAt: string;
  type: string;
}

export interface ExaminationNode {
  id: string;
  title: string;
  examinationTerm: ExaminationTerm;
  participantsObj: User[];
  totalParticipants: number;
  creator: string;
  creatorObj: User;
  isActive: boolean;
  createdAt: string;
  type: string;
}
