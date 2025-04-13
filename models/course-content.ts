import type {
  ContentType,
  LectureType,
  QuestionCorrectorType,
  QuestionResponseType,
  QuestionType,
} from './base';

// Lecture models
export interface Lecture {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  sourceUrl: string;
  thumb: string;
  thumbUrl: string;
  type: LectureType;
}

export interface CreateCourseContentLectureRequest {
  title?: string;
  description?: string;
  thumb?: string;
  content: string;
  source: string;
  type: LectureType;
  course: string;
  section: string;
  positionIndex?: number;
}

export interface UpdateCourseContentLectureRequest {
  id: string;
  title?: string;
  description?: string;
  thumb?: string;
  content?: string;
  source?: string;
  type?: LectureType;
  section: string;
  positionIndex?: number;
}

// Question models
export interface OptionsQuestionRequest {
  id?: string;
  content: string;
}

export interface OptionsQuestion {
  id: string;
  content: string;
}

// Boolean Question
export interface BooleanQuestionRequest {
  answer: boolean;
}

export interface BooleanQuestion {
  answer: boolean;
}

// Select Single Question
export interface SelectSingleQuestionRequest {
  options: OptionsQuestionRequest[];
  answer: number;
  randomOrder: boolean;
}

export interface SelectSingleQuestion {
  options: OptionsQuestion[];
  answer: number;
  randomOrder: boolean;
}

// Select Multiple Question
export interface SelectMultipleQuestionRequest {
  options: OptionsQuestionRequest[];
  answer: number[];
  randomOrder: boolean;
}

export interface SelectMultipleQuestion {
  options: OptionsQuestion[];
  answer: number[];
  randomOrder: boolean;
}

// Pair Question
export interface PairQuestionRequest {
  options: OptionsQuestionRequest[];
  linkOptions: OptionsQuestionRequest[];
}

export interface PairQuestion {
  options: OptionsQuestion[];
  linkOptions: OptionsQuestion[];
}

// Sort Question
export interface SortQuestionRequest {
  options: OptionsQuestionRequest[];
}

export interface SortQuestion {
  options: OptionsQuestion[];
}

// Fill Question
export interface FillQuestionRequest {
  text: string;
}

export interface FillQuestion {
  text: string;
}

// Image Map Question
export interface ImageMapCoordinateRequest {
  top: number;
  left: number;
  right: number;
  bottom: number;
  originalWidth: number;
  originalHeight: number;
}

export interface ImageMapCoordinate {
  top: number;
  left: number;
  right: number;
  bottom: number;
  originalWidth: number;
  originalHeight: number;
}

export interface ImageMapQuestionRequest {
  image: string;
  answers: ImageMapCoordinateRequest[];
}

export interface ImageMapQuestion {
  image: string;
  imageUrl: string;
  answers: ImageMapCoordinate[];
}

// Open Question
export interface OpenQuestionRequest {
  responseType: QuestionResponseType;
  corrector?: QuestionCorrectorType;
}

export interface OpenQuestion {
  responseType: QuestionResponseType;
  corrector: QuestionCorrectorType;
}

// Opinion Questions
export interface OpinionSelectMultipleQuestionRequest {
  options: OptionsQuestionRequest[];
  randomOrder: boolean;
}

export interface OpinionSelectMultipleQuestion {
  options: OptionsQuestion[];
  randomOrder: boolean;
}

export interface OpinionOpenQuestionRequest {
  responseType: QuestionResponseType;
}

export interface OpinionOpenQuestion {
  responseType: QuestionResponseType;
}

export interface CreateCourseContentQuestionRequest {
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
  course: string;
  section: string;
  positionIndex?: number;
}

export interface UpdateCourseContentQuestionRequest {
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
}

export interface Question {
  id: string;
  question: string;
  description: string;
  questionDocument: string;
  answerExplain: string;
  thumb: string;
  thumbUrl: string;
  type: QuestionType;
  content:
    | BooleanQuestion
    | SelectSingleQuestion
    | SelectMultipleQuestion
    | SortQuestion
    | PairQuestion
    | FillQuestion
    | ImageMapQuestion
    | OpenQuestion
    | OpinionSelectMultipleQuestion
    | OpinionOpenQuestion;
}

export interface UpdateCourseContentRequest {
  id: string;
  section: string;
  positionIndex?: number;
}

export interface DeleteCourseContentRequest {
  id: string;
}

export interface CourseContent {
  id: string;
  course: string;
  content: string;
  contentObj: Lecture | Question;
  position: number;
  section: string;
  thumb: string;
  thumbUrl: string;
  title: string;
  type: ContentType;
  contentType?: string;
  contentTypeExplanation?: string;
  like: number;
  dislike: number;
}
