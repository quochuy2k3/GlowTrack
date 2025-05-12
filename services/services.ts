import * as WidgetServices from './widgets';
import * as NotificationServices from './notifications';
import * as UserServices from './users';
import * as ExaminationServices from './examinations';
import * as CourseServices from './courses';
import * as MediaServices from './media';
import * as TalentSkillsServices from './talent-skills';
import * as AuthServices from './auth';
import * as RoutineServices from './routine';
import * as ScanServices from './scan';
import * as TrackerServices from './tracker';
import * as RequestServices from './requests';
import * as CoupleServices from './couple';

const services = {
  ...WidgetServices,
  ...NotificationServices,
  ...UserServices,
  ...ExaminationServices,
  ...CourseServices,
  ...MediaServices,
  ...TalentSkillsServices,
  ...AuthServices,
  ...RoutineServices,
  ...ScanServices,
  ...TrackerServices,
  ...RequestServices,
  ...CoupleServices,
};

export default services;
