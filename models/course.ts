import {
  CourseStatus,
  type CourseType,
  type DeliveryMethod,
  type Department,
  type PaginatedListResponse,
  type Skill,
  type TargetLearnerRequest,
  type User as User,
} from './base';
import { type ContentType } from './base';
import { type CourseCategory } from './course-category';
import { type Instructor } from './instructor';
import { type LearningObjective } from './learning-objective';
import { type ProgramSource } from './program-source';

export interface CreateCourseRequest {
  title: string;
  coverImage?: string;
  description: string;
  type?: CourseType;
  authors: string[];
  skills: string[];
  targetLearners?: TargetLearnerRequest[];
  programSources?: string[];
  courseCategories?: string[];
  instructors?: string[];
  learningObjectives?: string[];
  skillLevel?: string;
  duration?: number;
  completionDeadline?: number;
  requiredAnswerQuestion?: boolean;
  requiredLearning?: boolean;
  isDisplayComments?: boolean;
  isActive?: boolean;
  deliveryMethod?: DeliveryMethod;
  programPlace?: string;
}

export interface UpdateCourseRequest {
  id: string;
  title?: string;
  coverImage?: string;
  description?: string;
  authors?: string[];
  skills?: string[];
  targetLearners?: TargetLearnerRequest[];
  programSources?: string[];
  courseCategories?: string[];
  instructors?: string[];
  learningObjectives?: string[];
  skillLevel?: string;
  duration?: number;
  completionDeadline?: number;
  requiredAnswerQuestion?: boolean;
  requiredLearning?: boolean;
  isDisplayComments?: boolean;
  isActive?: boolean;
  isTemplate?: boolean;
  programPlace?: string;
}

export interface UpdateMultipleCourseRequest {
  listId: string[];
  isActive: boolean;
}

export interface DeleteCourseRequest {
  id: string;
}

export interface ShareCourseRequest {
  id: string;
  targetLearners: TargetLearnerRequest[];
}

export interface Course {
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
  instructors: string[];
  instructorsObj: Instructor[];
  learningObjectives: string[];
  learningObjectivesObj: LearningObjective[];
  skillLevel: string;
  avgRating: number;
  totalRatings: number;
  duration: number;
  completionDeadline: number;
  requiredAnswerQuestion: boolean;
  requiredLearning: boolean;
  isDisplayComments: boolean;
  isActive: boolean;
  deliveryMethod: DeliveryMethod;
  programPlace: string;
  participantsObj: User[];
  totalParticipants: number;
  createdAt: string;
  source: string;
  status: CourseStatus;

  progress: undefined;
}

export interface CourseNode {
  id: string;
  title: string;
  coverImage: string;
  coverImageUrl: string;
  type: CourseType;
  creator: string;
  creatorObj: User;
  participantsObj: User[];
  totalParticipants: number;
  avgRating: number;
  totalRatings: number;
  isActive: boolean;
  createdAt: string;
}

export interface CourseShare {
  id: string;
  targetLearnersObj: (Department | User)[];
}

export interface CourseTemplate {
  course: CourseTemplateCourse;
  courseSections: CourseSectionNode[];
  courseContents: CourseContentNode[];
}

export interface CourseTemplateCourse {
  id: string;
  title: string;
  coverImage: string;
  coverImageUrl: string;
  description: string;
  type: CourseType;
  courseCategories: string[];
  courseCategoriesObj: CourseCategory[];
  skillLevel: string;
  duration: number;
  isActive: boolean;
  deliveryMethod: DeliveryMethod;
  programPlace: string;
}

export interface CourseTemplateNode {
  id: string;
  title: string;
  coverImage: string;
  coverImageUrl: string;
  type: CourseType;
  courseCategories: string[];
  courseCategoriesObj: CourseCategory[];
  isActive: boolean;
  createdAt: string;
}

export interface CourseContentNode {
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
}

export interface CourseSectionNode {
  id: string;
  name: string;
  description: string;
  color: string;
  position: number;
}
