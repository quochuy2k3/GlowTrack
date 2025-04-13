export interface CreateExaminationSectionRequest {
  name: string;
  description?: string;
  color?: string;
  examination: string;
  positionIndex?: number;
}

export interface UpdateExaminationSectionRequest {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  positionIndex?: number;
}

export interface DeleteExaminationSectionRequest {
  id: string;
}

export interface ExaminationSection {
  id: string;
  name: string;
  description: string;
  color: string;
  position: number;
}
