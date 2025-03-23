import addCoursesLearning from "./addCoursesLearning";
import addModule from "./addModule";
import deleteCoursesLearning from "./deleteCoursesLearning";
import deleteModule from "./deleteModule";
import listUserPlans from "./list";

const userPlansService = {
  listUserPlans,
  addCoursesLearning,
  deleteCoursesLearning,
  addModule,
  deleteModule,
};

export default userPlansService;
