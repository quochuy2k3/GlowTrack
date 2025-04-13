export interface CreateCourseSectionRequest {
  name: string;
  description?: string;
  color?: string;
  course: string;
  positionIndex?: number;
}

export interface UpdateCourseSectionRequest {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  positionIndex?: number;
}

export interface DeleteCourseSectionRequest {
  id: string;
}

export interface CourseSection {
  id: string;
  name: string;
  description: string;
  color: string;
  position: number;
}
