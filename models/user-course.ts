import {
  type ContentType,
  type CourseStatus,
  type CourseType,
  type DeliveryMethod,
  type Department,
  type QuestionType,
  type Skill,
  type User,
} from './base';
import { type CourseCategory } from './course-category';
import { type Lecture, type OptionsQuestion } from './course-content';
import { type ProgramSource } from './program-source';

export interface CreateUserCourseRequest {
  course: string;
}

export interface UserCourse {
  id: string;
  title: string;
  coverImage: string;
  coverImageUrl: string;
  description: string;
  type: CourseType;
  creator: string;
  creatorObj: User;
  authors: string[];
  authorsObj: User[];
  skills: string[];
  skillsObj: Skill[];
  targetLearnersObj: (Department | User)[];
  programSources: string[];
  programSourcesObj: ProgramSource[];
  courseCategories: string[];
  courseCategoriesObj: CourseCategory[];
  skillLevel: string;
  avgRating: number;
  totalRatings: number;
  duration: number;
  completionDeadline: number;
  requiredAnswerQuestion: boolean;
  requiredLearning: boolean;
  isDisplayComments: boolean;
  deliveryMethod: DeliveryMethod;
  programPlace: string;
  createdAt: string;
  isFavorite: boolean;
  totalFavorite: number;
  dueDateAt: string;
  status: CourseStatus;
  source: string;
}

export interface UserCourseCurrent extends UserCourse {
  amountLearnedContent: number;
  totalContent: number;
  nextContent: UserCourseContent;
}

export interface UserCourseCurrentDTO extends UserCourseCurrent {
  progress: number;
}

export interface UserBooleanQuestion {}

export interface UserSelectSingleQuestion {
  options: OptionsQuestion[];
}

export interface UserSelectMultipleQuestion {
  options: OptionsQuestion[];
}

export interface UserSortQuestion {
  options: OptionsQuestion[];
}

export interface UserPairQuestion {
  options: OptionsQuestion[];
  linkOptions: OptionsQuestion[];
}

export interface UserFillQuestion {
  text: string;
}

export interface UserImageMapQuestion {
  image: string;
  imageUrl: string;
  totalAnswer: boolean;
}

export interface UserOpenQuestion {
  responseType: 'text' | 'document' | 'textAndDocument';
}

export interface UserOpinionSelectMultipleQuestion {
  options: OptionsQuestion[];
}

export interface UserOpinionOpenQuestion {
  responseType: 'text' | 'document' | 'textAndDocument';
}

export interface UserQuestion {
  id: string;
  question: string;
  description: string;
  questionDocument: string;
  thumb: string;
  thumbUrl: string;
  type: QuestionType;
  content:
    | UserBooleanQuestion
    | UserSelectSingleQuestion
    | UserSelectMultipleQuestion
    | UserSortQuestion
    | UserPairQuestion
    | UserFillQuestion
    | UserImageMapQuestion
    | UserOpenQuestion
    | UserOpinionSelectMultipleQuestion
    | UserOpinionOpenQuestion;
}

export interface AnswerBooleanQuestionRequest {
  answer: boolean;
}

export interface AnswerSelectSingleQuestionRequest {
  answer: string;
}

export interface AnswerSelectMultipleQuestionRequest {
  answer: string[];
}

export interface AnswerSortQuestionRequest {
  answer: string[];
}

export interface AnswerPairQuestionRequest {
  answer: string[];
  linkAnswer: string[];
}

export interface AnswerFillQuestionRequest {
  text: string;
}

export interface AnswerImageMapQuestionRequest {
  answers: {
    top: number;
    left: number;
    right: number;
    bottom: number;
    originalWidth: number;
    originalHeight: number;
  }[];
}

export interface AnswerOpenQuestionRequest {
  answer: string;
  answerDocument: string[];
}

export interface AnswerOpinionSelectMultipleQuestionRequest {
  answer: string[];
}

export interface AnswerOpinionOpenQuestionRequest {
  answer: string;
  answerDocument: string[];
}

export interface FinishUserCourseContentRequest {
  type?: QuestionType;
  answers?:
    | AnswerBooleanQuestionRequest
    | AnswerSelectSingleQuestionRequest
    | AnswerSelectMultipleQuestionRequest
    | AnswerSortQuestionRequest
    | AnswerPairQuestionRequest
    | AnswerFillQuestionRequest
    | AnswerImageMapQuestionRequest
    | AnswerOpenQuestionRequest
    | AnswerOpinionSelectMultipleQuestionRequest
    | AnswerOpinionOpenQuestionRequest;
}

export interface AnswerBooleanQuestion {
  answer: boolean;
}

export interface AnswerSelectSingleQuestion {
  answer: string;
}

export interface AnswerSelectMultipleQuestion {
  answer: string[];
}

export interface AnswerSortQuestion {
  answer: string[];
}

export interface AnswerPairQuestion {
  answer: string[];
  linkAnswer: string[];
}

export interface AnswerFillQuestion {
  text: string;
}

export interface AnswerImageMapQuestion {
  answers: string[];
}

export interface AnswerOpenQuestion {
  answer: string;
}

export interface AnswerOpinionSelectMultipleQuestion {
  answer: string[];
}

export interface AnswerOpinionOpenQuestion {
  answer: string;
}

export interface AnswerQuestion {
  answers:
    | AnswerBooleanQuestion
    | AnswerSelectSingleQuestion
    | AnswerSelectMultipleQuestion
    | AnswerSortQuestion
    | AnswerPairQuestion
    | AnswerFillQuestion
    | AnswerImageMapQuestion
    | AnswerOpenQuestion
    | AnswerOpinionSelectMultipleQuestion
    | AnswerOpinionOpenQuestion;
  correctAnswers?:
    | AnswerBooleanQuestion
    | AnswerSelectSingleQuestion
    | AnswerSelectMultipleQuestion
    | AnswerSortQuestion
    | AnswerPairQuestion
    | AnswerFillQuestion
    | AnswerImageMapQuestion
    | AnswerOpenQuestion
    | AnswerOpinionSelectMultipleQuestion
    | AnswerOpinionOpenQuestion;
  point: number;
}

export interface UserCourseContent {
  id: string;
  course: string;
  content: string;
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
  contentObj: Lecture | UserQuestion;
  userAnswers?: AnswerQuestion;
  reaction?: 'like' | 'dislike';
}

export interface UserCourseContentNode {
  id: string;
  course: string;
  content: string;
  position: number;
  description: string;
  section: string;
  thumb: string;
  thumbUrl: string;
  title: string;
  type: ContentType;
  contentType?: string;
  contentTypeExplanation?: string;
  isFinished: boolean;
  isLearnable: boolean;
}

export interface ReactionUserCourseContentRequest {
  reaction: 'like' | 'dislike';
}

export interface FinishUserCourseContent extends UserCourseContent {}
