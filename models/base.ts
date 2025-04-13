export interface PageInfo {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export type PaginatedListResponse<T> = {
  items: T[];
  meta: PageInfo;
};

export type ListResponse<T> = {
  items: T[];
};

export interface User {
  id: string;
  name: string;
  username: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface TargetLearnerRequest {
  id: string;
  type: 'department' | 'user';
}

export type DeliveryMethod = 'offline' | 'online';
export type ExaminationTerm = 'startOfTerm' | 'midTerm' | 'endOfTerm' | 'noClassification';
export type CourseType = 'course' | 'training';
export type UserRoleType = 'learner' | 'author' | 'manager' | 'owner';
export type MediaType = 'pdf' | 'doc' | 'sheet' | 'slide' | 'image' | 'video' | 'unknown';
export type LectureType =
  | 'pdf'
  | 'doc'
  | 'sheet'
  | 'slide'
  | 'image'
  | 'video'
  | 'youtube'
  | 'vimeo'
  | 'text'
  | 'embed'
  | 'audio';
export type ContentType = 'lecture' | 'question';
export type QuestionType =
  | 'BooleanQuestion'
  | 'SelectSingleQuestion'
  | 'SelectMultipleQuestion'
  | 'SortQuestion'
  | 'PairQuestion'
  | 'FillQuestion'
  | 'ImageMapQuestion'
  | 'OpenQuestion'
  | 'OpinionSelectMultipleQuestion'
  | 'OpinionOpenQuestion';
export type QuestionResponseType = 'text' | 'document' | 'textAndDocument';
export type QuestionCorrectorType = 'instructor' | 'manager';
export type CourseStatus = 'readyToStart' | 'inProgress' | 'completed';
