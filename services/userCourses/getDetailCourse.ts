import { Course } from "@/models";
import axios from "axios";

export default async function getDetailCourse(id: string): Promise<any> {
  try {
    const response = await axios.get(`/lms/user-courses/${id}`);
    return response?.data?.data;
  } catch (error) {
    return {} as any;
  }
}
