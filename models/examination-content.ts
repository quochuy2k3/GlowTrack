import {
  type ContentType,
  type LectureType,
  type PaginatedListResponse,
  type QuestionType,
} from './base';
import {
  type BooleanQuestionRequest,
  type BooleanQuestion,
  type FillQuestionRequest,
  type FillQuestion,
  type ImageMapQuestionRequest,
  type ImageMapQuestion,
  type Lecture,
  type OpenQuestionRequest,
  type OpenQuestion,
  type OpinionOpenQuestionRequest,
  type OpinionOpenQuestion,
  type OpinionSelectMultipleQuestionRequest,
  type OpinionSelectMultipleQuestion,
  type PairQuestionRequest,
  type PairQuestion,
  type Question,
  type SelectMultipleQuestionRequest,
  type SelectMultipleQuestion,
  type SelectSingleQuestionRequest,
  type SelectSingleQuestion,
  type SortQuestionRequest,
  type SortQuestion,
} from './course-content';

export interface ExaminationContentNode {
  id: string;
  examination: string;
  content: string;
  point: number;
  position: number;
  description: string;
  section: string;
  thumb: string;
  thumbUrl: string;
  title: string;
  type: ContentType;
  contentType?: string;
  contentTypeExplanation?: string;
}

export interface ExaminationContent {
  id: string;
  examination: string;
  content: string;
  contentObj: Lecture | Question;
  point: number;
  position: number;
  section: string;
  thumb: string;
  thumbUrl: string;
  title: string;
  type: ContentType;
  contentType?: string;
  contentTypeExplanation?: string;
}

export interface DeleteExaminationContentRequest {
  id: string;
}

export interface CreateExaminationContentLectureRequest {
  title?: string;
  description?: string;
  thumb?: string;
  content: string;
  source: string;
  type: LectureType;
  examination: string;
  section: string;
  positionIndex?: number;
  point: number;
}

export interface UpdateExaminationContentLectureRequest {
  id: string;
  title?: string;
  description?: string;
  thumb?: string;
  content?: string;
  source?: string;
  type?: LectureType;
  section: string;
  positionIndex?: number;
  point: number;
}

export interface CreateExaminationContentQuestionRequest {
  thumb?: string;
  question?: string;
  description?: string;
  questionDocument?: string;
  questionDocumentType?: 'pdf' | 'doc' | 'image';
  answerExplain?: string;
  type: QuestionType;
  content:
    | BooleanQuestionRequest
    | SelectSingleQuestionRequest
    | SelectMultipleQuestionRequest
    | PairQuestionRequest
    | SortQuestionRequest
    | FillQuestionRequest
    | ImageMapQuestionRequest
    | OpenQuestionRequest
    | OpinionSelectMultipleQuestionRequest
    | OpinionOpenQuestionRequest;
  examination: string;
  section: string;
  positionIndex?: number;
  point: number;
}

export interface UpdateExaminationContentQuestionRequest {
  id: string;
  question: string;
  description?: string;
  thumb?: string;
  questionDocument?: string;
  questionDocumentType?: 'pdf' | 'doc' | 'image';
  answerExplain?: string;
  type: QuestionType;
  content:
    | BooleanQuestionRequest
    | SelectSingleQuestionRequest
    | SelectMultipleQuestionRequest
    | PairQuestionRequest
    | SortQuestionRequest
    | FillQuestionRequest
    | ImageMapQuestionRequest
    | OpenQuestionRequest
    | OpinionSelectMultipleQuestionRequest
    | OpinionOpenQuestionRequest;
  section: string;
  positionIndex?: number;
  point: number;
}

export interface UpdateExaminationContentRequest {
  id: string;
  section: string;
  positionIndex?: number;
  point: number;
}
