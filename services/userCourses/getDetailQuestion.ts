import { Course } from "@/models";
import axios from "axios";

export default async function getDetailQuestion(
  courseId: string,
  contentId: string
): Promise<any> {
  try {
    const response = await axios.get(
      `/lms/user-courses/${courseId}/${contentId}`
    );
    return response?.data?.data;
  } catch (error) {
    return {} as any;
  }
}
