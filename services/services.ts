import coursesService from "./courses";
import talentManagementService from "./talentManagement";
import shopService from "./shop";
import userCoursesService from "./userCourses";
import widgetsService from "./widgets";
import userPlansService from "./userPlans";
import userSettingsService from "./userSettings";
export default {
  courses: coursesService,
  talentManagement: talentManagementService,
  shop: shopService,
  userCourses: userCoursesService,
  widgets: widgetsService,
  userPlans: userPlansService,
  userSettings: userSettingsService,
} as const;
