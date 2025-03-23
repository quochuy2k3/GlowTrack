import axios from "axios";

export default async function deleteCoursesLearning(
  courses: string[],
  module: string
): Promise<any> {
  try {
    const response = await axios.delete(`/lms/user-plans/module/courses`, {
      data: {
        courses,
        module,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("deleteCoursesLearning___error", error);
    return {};
  }
}
