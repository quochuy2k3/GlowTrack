import axios from "axios";
import utils from "@/utils";

export default async function addCoursesLearning(
  courses: string[],
  module: string
): Promise<any> {
  try {
    const response = await axios.post(`/lms/user-plans/module/courses`, {
      courses,
      module,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("addCoursesLearning___error", error);
    return {};
  }
}
