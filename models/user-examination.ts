import {
  type ContentType,
  type CourseStatus,
  type DeliveryMethod,
  type Department,
  type ExaminationTerm,
  type PaginatedListResponse,
  type Skill,
  type User,
} from './base';
import { type Lecture } from './course-content';
import { type UserQuestion } from './user-course';
import { type AnswerQuestion, type FinishUserCourseContentRequest } from './user-course';

export interface CreateUserExaminationRequest {
  examination: string;
}

export interface UserExamination {
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
  isActive: boolean;
  isSubmitted: boolean;
  submittedAt: string;
  isGraded: boolean;
  gradedAt: string;
  startedAt: string;
  createdAt: string;
  dueDateAt: string;
  status: CourseStatus;
  totalContent: number;
}

export interface UserExaminationContentNode {
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
  isFinished: boolean;
}

export interface ExaminationAnswerQuestion {
  answers: AnswerQuestion['answers'];
}

export interface UserExaminationContent {
  id: string;
  examination: string;
  content: string;
  point: number;
  position: number;
  section: string;
  thumb: string;
  thumbUrl: string;
  title: string;
  type: ContentType;
  contentType?: string;
  contentTypeExplanation?: string;
  contentObj: Lecture | UserQuestion;
  userAnswers?: ExaminationAnswerQuestion;
}

export interface FinishUserExaminationContentRequest extends FinishUserCourseContentRequest {}

export interface FinishUserExaminationContent extends UserExaminationContent {}

export interface GradeUserExaminationContentRequest {
  point: number;
}

export interface LearnerDetailExamination {
  id: string;
  title: string;
  joinedAt: string;
  submittedAt: string;
  gradedAt: string;
  point: number;
  maxPoint: number;
  passGrade: number;
}

export interface LearnerDetailExaminationSectionNode {
  id: string;
  name: string;
  description: string;
  color: string;
  position: number;
}

export interface LearnerDetailExaminationContentNode {
  examination: string;
  content: string;
  position: number;
  section: string;
  thumb: string;
  thumbUrl: string;
  title: string;
  type: ContentType;
  firstSeenAt: string;
  finishedAt: string;
  questionType: string;
  answerPoint: number;
  point: number;
  isGraded: boolean;
  gradedAt: string;
}

export interface UserExaminationResult {
  examination: LearnerDetailExamination;
  examinationSections: LearnerDetailExaminationSectionNode[];
  examinationContents: LearnerDetailExaminationContentNode[];
}

export interface UserExaminationContentResult {
  id: string;
  examination: string;
  content: string;
  point: number;
  position: number;
  section: string;
  thumb: string;
  thumbUrl: string;
  title: string;
  type: ContentType;
  contentType?: string;
  contentTypeExplanation?: string;
  contentObj: Lecture | UserQuestion;
  userAnswers: AnswerQuestion;
}
