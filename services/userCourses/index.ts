import categories from "./categories";
import currentCourse from "./currentCourse";
import getContentCourse from "./getContentCourse";
import getDetailCourse from "./getDetailCourse";
import getDetailQuestion from "./getDetailQuestion";
import getSectionCourse from "./getSectionCourse";

const userCoursesService = {
  currentCourse,
  categories,
  getDetailCourse,
  getContentCourse,
  getDetailQuestion,
  getSectionCourse,
};

export default userCoursesService;
