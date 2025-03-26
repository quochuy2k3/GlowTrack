export interface CreateCourseCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCourseCategoryRequest {
  id: string;
  name?: string;
  description?: string;
  parentId?: string;
}

export interface DeleteCourseCategoryRequest {
  id: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
}

export interface CourseCategoryTreeNode {
  id: string;
  name: string;
  description: string;
  children: CourseCategoryTreeNode | CourseCategoryTreeNode[];
}
