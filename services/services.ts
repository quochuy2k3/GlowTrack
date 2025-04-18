import * as WidgetServices from './widgets';
import * as NotificationServices from './notifications';
import * as UserServices from './users';
import * as ExaminationServices from './examinations';
import * as CourseServices from './courses';
import * as MediaServices from './media';
import * as TalentSkillsServices from './talent-skills';
import * as AuthServices from './auth';
import * as RoutineServices from './routine';
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
};

export default services;
