import { Course, HomeWidgetDataDTO, UserCourseCurrentDTO } from '@/models';

type BaseCourseCardProps = {
  width?: number;
  onPress?: () => void;
};

export type HomeWidgetCourseCardProps = BaseCourseCardProps & {
  variant: 'home-widget';
  course: HomeWidgetDataDTO;
};

export type ProgressCourseCardProps = BaseCourseCardProps & {
  variant: 'progress';
  course: UserCourseCurrentDTO;
};

export type ListItemCourseCardProps = BaseCourseCardProps & {
  variant: 'list-item';
  showProgress?: boolean;
  course: Course | HomeWidgetDataDTO;
};

export type RelatedListItemCourseCardProps = BaseCourseCardProps & {
  variant: 'related-list-item';
  showProgress?: boolean;
  course: Course | HomeWidgetDataDTO;
};

export type CourseCardProps =
  | HomeWidgetCourseCardProps
  | ProgressCourseCardProps
  | ListItemCourseCardProps
  | RelatedListItemCourseCardProps;
