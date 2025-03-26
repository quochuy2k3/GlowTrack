import { type ProgramSource } from './program-source';

export interface HomeWidgetData {
  id: string;
  title: string;
  coverImage: string;
  coverImageUrl: string;
  source: 'course' | 'training' | 'courseAndTraining' | 'examination';
  programSources: string[];
  programSourcesObj: ProgramSource[];
  duration: number;
  completionDeadline: number;
  totalLearnedContents: number;
  totalContents: number;
  dueDateAt: string;
  status: 'readyToStart' | 'inProgress' | 'completed';
  examinationTerm: 'startOfTerm' | 'midTerm' | 'endOfTerm' | 'noClassification';
  isFavorite: boolean;
}

export interface HomeWidgetDataDTO extends HomeWidgetData {
  progress: number;
}

export interface HomeWidget {
  id: string;
  name: string;
  code: string;
  dataObj: HomeWidgetData[];
}

export interface HomeWidgetDTO extends HomeWidget {
  dataObj: HomeWidgetDataDTO[];
}
