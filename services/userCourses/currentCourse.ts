import { CurrentCourse } from "@/models/currentCourse";
import axios from "axios";

export default async function currentCourse(): Promise<CurrentCourse> {
  try {
    const response = await axios.get(`/lms/user-courses/current`);
    return response?.data?.data;
  } catch (error) {
    return {} as CurrentCourse;
  }
}
